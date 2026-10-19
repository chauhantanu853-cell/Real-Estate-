import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://real-estate-mz3h.onrender.com/api',
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Properties
export const getProperties = (params) => API.get('/properties', { params });
export const getProperty = (id) => API.get(`/properties/${id}`);
export const createProperty = (data) => API.post('/properties', data);
export const updateProperty = (id, data) => API.put(`/properties/${id}`, data);
export const deleteProperty = (id) => API.delete(`/properties/${id}`);
export const getMyProperties = () => API.get('/properties/seller/my');
export const approveProperty = (id, data) => API.put(`/properties/${id}/approve`, data);

// Favorites
export const getFavorites = () => API.get('/favorites');
export const toggleFavorite = (propertyId) => API.post(`/favorites/${propertyId}`);

// AI
export const aiSearch = (query) => API.post('/ai/search', { query });
export const aiDescription = (data) => API.post('/ai/description', data);
export const aiPriceEstimate = (data) => API.post('/ai/price-estimate', data);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const getAdminSellers = () => API.get('/admin/sellers');
export const getAdminProperties = () => API.get('/admin/properties');
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

export default API;
