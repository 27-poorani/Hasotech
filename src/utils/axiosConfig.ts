import axios from 'axios';

const baseURL = 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

export default axiosInstance; 