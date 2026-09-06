let cachedJobs = [];

export const setCachedJobs = (jobs) => {
  cachedJobs = Array.isArray(jobs) ? jobs : [];
  return cachedJobs;
};

export const getCachedJobs = () => cachedJobs;

export const findCachedJobById = (jobId) => {
  if (!jobId) return undefined;
  return cachedJobs.find((job) => job._id === jobId || job.id === jobId);
};

export const clearCachedJobs = () => {
  cachedJobs = [];
};
