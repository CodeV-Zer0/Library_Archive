import axios from 'axios';

// Create a new Axios instance
const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

// This is an interceptor. It runs before every request is sent.
api.interceptors.request.use(config => {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    
    // If a token exists, add it to the Authorization header
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config; // Send the request with the new header
}, error => {
    return Promise.reject(error);
});

export default api;