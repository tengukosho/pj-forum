import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Token attached to request:', token.substring(0, 20) + '...');
  } else {
    console.warn('⚠️ No token found in localStorage');
  }
  return config;
}, error => {
  console.error('❌ Request interceptor error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  error => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.warn('🚫 Unauthorized - clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (username, email, password) => api.post('/auth/register', { username, email, password }),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};

export const threadsAPI = {
  getAll: (params = {}) => api.get('/threads', { params }),
  getById: (id) => api.get(`/threads/${id}`),
  create: (data) => api.post('/threads', data),
  update: (id, data) => api.put(`/threads/${id}`, data),
  delete: (id) => api.delete(`/threads/${id}`),
};

export const repliesAPI = {
  getByThread: (threadId) => api.get(`/threads/${threadId}/replies`),
  create: (threadId, content) => api.post(`/threads/${threadId}/replies`, { content }),
};

export const usersAPI = {
  getById: (id) => api.get(`/users/${id}`),
  getCurrent: () => api.get('/users/me'),
  update: (id, data) => api.put(`/users/${id}`, data),
  ban: (id) => api.put(`/users/${id}/ban`),
  unban: (id) => api.put(`/users/${id}/unban`),
};

export default api;