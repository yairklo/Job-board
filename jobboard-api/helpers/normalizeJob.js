function defaultImage() {
  return {
    url: process.env.DEFAULT_JOB_IMAGE_URL || '',
    alt: 'Job listing image',
  };
}

function normalizeJob(input = {}, { keepSystemFields = false } = {}) {
  const image = input.image || {};
  const salary = input.salary || {};
  const hasImageUrl = Boolean(image.url && String(image.url).trim());

  const job = {
    title: String(input.title || '').trim(),
    company: String(input.company || '').trim(),
    description: String(input.description || '').trim(),
    category: String(input.category || '').trim(),
    location: String(input.location || '').trim(),
    jobType: String(input.jobType || '').trim(),
    experienceLevel: String(input.experienceLevel || input.experience || '').trim(),
    salary: {
      min: Number(salary.min),
      max: Number(salary.max),
    },
    phone: String(input.phone || input.contact?.phone || '').trim(),
    email: String(input.email || input.contact?.email || '').trim().toLowerCase(),
    applyLink: String(input.applyLink || input.applicationUrl || '').trim(),
    image: hasImageUrl
      ? {
          url: String(image.url).trim(),
          alt: String(image.alt || input.company || 'Job listing image').trim(),
        }
      : defaultImage(),
  };

  if (keepSystemFields) {
    if (input.recruiterId) job.recruiterId = input.recruiterId;
    if (input.savedBy) job.savedBy = input.savedBy;
    if (input.jobNumber) job.jobNumber = input.jobNumber;
  }

  return job;
}

function serializeJob(job) {
  const plain = typeof job.toObject === 'function' ? job.toObject() : { ...job };
  const recruiterId = plain.recruiterId ? String(plain.recruiterId) : undefined;

  return {
    ...plain,
    recruiterId,
    recruiter_id: recruiterId,
    savedBy: Array.isArray(plain.savedBy) ? plain.savedBy.map((id) => String(id)) : [],
    applicationUrl: plain.applyLink || plain.applicationUrl || '',
    contact: {
      phone: plain.phone,
      email: plain.email,
    },
  };
}

module.exports = { normalizeJob, serializeJob, defaultImage };
