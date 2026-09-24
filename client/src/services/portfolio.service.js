import api from './api';

export const portfolioService = {
  getProfile: () => api.get('/profile').then((res) => res.data[0]),
  getSkills: () => api.get('/skills').then((res) => res.data),
  getProjects: () => api.get('/projects').then((res) => res.data),
  getCertifications: () => api.get('/certifications').then((res) => res.data),
  getExperiences: () => api.get('/experiences').then((res) => res.data),
  getEducation: () => api.get('/education').then((res) => res.data),
  getSocialLinks: () => api.get('/social-links').then((res) => res.data),
  getLanguages: () => api.get('/languages').then((res) => res.data),
  sendMessage: (payload) => api.post('/messages', payload).then((res) => res.data),
};