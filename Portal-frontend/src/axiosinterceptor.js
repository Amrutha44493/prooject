import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api/projects', 
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.token = token;
  }
  return config;
}, (error) => Promise.reject(error));

export default axiosInstance;

   