import axios from 'axios';

const api = axios.create({
    baseURL: 'https://library-archive-server.onrender.com/api',   // ← Your actual backend URL
    withCredentials: true
});

// Automatically add token to every request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;