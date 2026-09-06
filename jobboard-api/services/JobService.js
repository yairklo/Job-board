const Job = require('../models/Job');
const createError = require('../helpers/createError');
const handleError = require('../helpers/handleError');
const { normalizeJob, serializeJob } = require('../helpers/normalizeJob');
const generateJobNumber = require('../helpers/generateJobNumber');
const { toObjectId } = require('../helpers/mongoValidators');

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildJobFilter(query = {}) {
  const filter = {};
  const search = query.search || query.q;

  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: regex }, { company: regex }, { category: regex }, { location: regex }];
  }

  if (query.jobType) {
    filter.jobType = query.jobType;
  }

  const experience = query.experienceLevel || query.experience;
  if (experience) {
    filter.experienceLevel = experience;
  }

  if (query.salaryMin != null || query.salaryMax != null) {
    filter['salary.min'] = {};
    if (query.salaryMin != null) {
      filter['salary.max'] = { $gte: Number(query.salaryMin) };
    }
    if (query.salaryMax != null) {
      filter['salary.min'] = { $lte: Number(query.salaryMax) };
    }
  }

  return filter;
}

function assertJobWriteAccess(job, user) {
  const isOwner = String(job.recruiterId) === String(user._id);
  if (!isOwner && !user.isAdmin) {
    throw createError('AuthZ', 'Access denied. You can only modify your own jobs.', 403);
  }
}

async function listJobs(query = {}) {
  try {
    const filter = buildJobFilter(query);
    const sort = query.sort === 'salary'
      ? { 'salary.min': 1 }
      : { createdAt: -1 };

    const hasPaging = query.page != null || query.limit != null;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    if (!hasPaging) {
      const jobs = await Job.find(filter).sort(sort);
      return jobs.map(serializeJob);
    }

    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      Job.find(filter).sort(sort).skip(skip).limit(limit),
      Job.countDocuments(filter),
    ]);

    return {
      docs: jobs.map(serializeJob),
      jobs: jobs.map(serializeJob),
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  } catch (err) {
    throw handleError(err, 'Failed to list jobs');
  }
}

async function listMyJobs(user, query = {}) {
  try {
    const filter = { recruiterId: user._id, ...buildJobFilter(query) };
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    return jobs.map(serializeJob);
  } catch (err) {
    throw handleError(err, 'Failed to list recruiter jobs');
  }
}

async function getById(id) {
  try {
    const job = await Job.findById(id);
    if (!job) {
      throw createError('NotFound', 'Job not found', 404);
    }
    return serializeJob(job);
  } catch (err) {
    throw handleError(err, 'Failed to get job');
  }
}

async function createJob(payload, user) {
  try {
    const normalized = normalizeJob(payload);
    const job = await Job.create({
      ...normalized,
      recruiterId: user._id,
      savedBy: [],
      jobNumber: await generateJobNumber(),
    });
    return serializeJob(job);
  } catch (err) {
    throw handleError(err, 'Failed to create job');
  }
}

async function updateJob(id, payload, user) {
  try {
    const job = await Job.findById(id);
    if (!job) {
      throw createError('NotFound', 'Job not found', 404);
    }

    assertJobWriteAccess(job, user);

    const normalized = normalizeJob(payload);
    job.title = normalized.title;
    job.company = normalized.company;
    job.description = normalized.description;
    job.category = normalized.category;
    job.location = normalized.location;
    job.jobType = normalized.jobType;
    job.experienceLevel = normalized.experienceLevel;
    job.salary = normalized.salary;
    job.phone = normalized.phone;
    job.email = normalized.email;
    job.applyLink = normalized.applyLink;
    job.image = normalized.image;
    await job.save();

    return serializeJob(job);
  } catch (err) {
    throw handleError(err, 'Failed to update job');
  }
}

async function deleteJob(id, user) {
  try {
    const job = await Job.findById(id);
    if (!job) {
      throw createError('NotFound', 'Job not found', 404);
    }

    assertJobWriteAccess(job, user);
    await job.deleteOne();
    return { deleted: true };
  } catch (err) {
    throw handleError(err, 'Failed to delete job');
  }
}

async function toggleSaved(id, user) {
  try {
    const job = await Job.findById(id);
    if (!job) {
      throw createError('NotFound', 'Job not found', 404);
    }

    const userId = toObjectId(user._id);
    const alreadySaved = job.savedBy.some((savedId) => String(savedId) === String(user._id));

    if (alreadySaved) {
      job.savedBy.pull(userId);
    } else {
      job.savedBy.push(userId);
    }

    await job.save();
    return serializeJob(job);
  } catch (err) {
    throw handleError(err, 'Failed to toggle saved job');
  }
}

module.exports = {
  listJobs,
  listMyJobs,
  getById,
  createJob,
  updateJob,
  deleteJob,
  toggleSaved,
};
