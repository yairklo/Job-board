import apiClient from './apiClient';

export const registerUser = async (userData) => {
  const { data } = await apiClient.post('/users', userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await apiClient.post('/users/login', credentials);
  return data;
};

export const getUserProfile = async (userId) => {
  const { data } = await apiClient.get(`/users/${userId}`);
  return data;
};

export const updateUserProfile = async (userId, userData) => {
  const { data } = await apiClient.put(`/users/${userId}`, userData);
  return data;
};

export const toggleRecruiterRole = async (userId, isRecruiter) => {
  const { data } = await apiClient.patch(`/users/${userId}`, { isRecruiter });
  return data;
};

export const getAllUsers = async (params) => {
  const { data } = await apiClient.get('/users', { params });
  return data;
};

export const deleteUser = async (userId) => {
  const { data } = await apiClient.delete(`/users/${userId}`);
  return data;
};
