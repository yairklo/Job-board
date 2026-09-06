const JobService = require('../services/JobService');

async function getAll(req, res, next) {
  try {
    const result = await JobService.listJobs(req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function getMyJobs(req, res, next) {
  try {
    const jobs = await JobService.listMyJobs(req.user, req.query);
    res.status(200).json(jobs);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const job = await JobService.getById(req.params.id);
    res.status(200).json(job);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const job = await JobService.createJob(req.body, req.user);
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const job = await JobService.updateJob(req.params.id, req.body, req.user);
    res.status(200).json(job);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await JobService.deleteJob(req.params.id, req.user);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    next(err);
  }
}

async function toggleSaved(req, res, next) {
  try {
    const job = await JobService.toggleSaved(req.params.id, req.user);
    res.status(200).json(job);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getMyJobs,
  getById,
  create,
  update,
  remove,
  toggleSaved,
};
