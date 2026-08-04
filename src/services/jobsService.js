import apiClient from './apiClient';

export const getAllJobs = async (params) => {
  const { data } = await apiClient.get('/jobs', { params });
  return data;
};

export const getJobById = async (jobId) => {
  const { data } = await apiClient.get(`/jobs/${jobId}`);
  return data;
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
