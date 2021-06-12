import axios from 'axios';
import config from '../../env.js';
console.log(config);

export const axiosInstance = axios.create({
  baseURL: config.backendurl || 'http://localhost:3001',
  withCredentials: true
});
