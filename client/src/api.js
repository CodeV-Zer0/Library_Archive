import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://library-archive-server.onrender.com/api',
    withCredentials: true
});

// Add JWT token to every request automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('No JWT token found in localStorage for request:', config.url);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;