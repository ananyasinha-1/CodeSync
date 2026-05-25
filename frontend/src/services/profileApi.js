import api from './api';

export const getProfile = () => api.get('/api/auth/profile').then(r => r.data);

export const updateProfile = (data) => api.patch('/api/auth/profile', data).then(r => r.data);
