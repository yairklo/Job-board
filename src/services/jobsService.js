import apiClient, { jobsFeedClient } from './apiClient';
import { normalizeWhatsAppJob } from '../utils/whatsappJob';
import { findCachedJobById, setCachedJobs } from './jobsCache';

const DEFAULT_RECENT_LIMIT = 200;

const normalizeRecentResponse = (data) => {
  const rawJobs = Array.isArray(data) ? data : data?.jobs || data?.docs || [];
  const jobs = rawJobs.map(normalizeWhatsAppJob);
  setCachedJobs(jobs);
  return {
    jobs,
    total: data?.total ?? jobs.length,
    source: data?.source,
    mongo: data?.mongo,
  };
};

export const getRecentJobs = async (params = {}) => {
  const { data } = await jobsFeedClient.get('/api/jobs/recent', {
    params: { limit: params.limit ?? DEFAULT_RECENT_LIMIT, ...params },
  });
  return normalizeRecentResponse(data);
};

export const getAllJobs = async (params) => {
  const { jobs } = await getRecentJobs(params);
  return jobs;
};

export const getJobById = async (jobId) => {
  const cached = findCachedJobById(jobId);
  if (cached) return cached;

  const { jobs } = await getRecentJobs({ limit: DEFAULT_RECENT_LIMIT });
  const found = jobs.find((job) => job._id === jobId || job.id === jobId);
  if (!found) {
    const error = new Error('Job not found');
    error.status = 404;
    throw error;
  }
  return found;
};

export const getMyJobs = async (params) => {
  const { data } = await apiClient.get('/jobs/my-jobs', { params });
  return data;
};

export const createJob = async (jobData) => {
  const { data } = await apiClient.post('/jobs', jobData);
  return data;
};

export const updateJob = async (jobId, jobData) => {
  const { data } = await apiClient.put(`/jobs/${jobId}`, jobData);
  return data;
};

export const deleteJob = async (jobId) => {
  const { data } = await apiClient.delete(`/jobs/${jobId}`);
  return data;
};

export const toggleSaveJob = async (jobId) => {
  const { data } = await apiClient.patch(`/jobs/${jobId}`);
  return data;
};
