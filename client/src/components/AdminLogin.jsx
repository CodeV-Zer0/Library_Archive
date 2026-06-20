import React, { useState } from 'react';
import api from '../api.js'; // You are correctly importing this
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './AdminLogin.css';

function AdminLogin() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // ✅ FIX 1: Use 'api.post', which you imported
            // ✅ FIX 2: Call the '/api/users/login' endpoint
            const res = await api.post('/users/login', formData);
            
            const token = res.data.token;
            
            // Check if token exists before decoding
            if (!token) {
                setMessage('Login failed: No token received.');
                return;
            }

            const decodedUser = jwtDecode(token);

            if ((decodedUser.role || '').toLowerCase() !== 'admin') {
                setMessage('Access Denied. You are not an admin.');
                return;
            }

            // Success
            localStorage.setItem('token', token);
            window.location.href = '/books'; // Redirect to a protected route
        } catch (err) {
            // This will now correctly show errors from the server, 
            // like "User not found" or "Invalid credentials"
            setMessage(err.response?.data || 'Login failed.');
        }
    };

    return (
        <div className="admin-login-page">
            <div className="bookshelf-bg"></div>
            <header className="app-main-header">
                <h1>Library Archive</h1>
            </header>
            <div className="login-container-full">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Admin Username</label>
                        <input id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Enter admin username" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter password" required />
                    </div>
                    <button type="submit">Login as Admin</button>
                </form>
                {/* This will now show the correct error message from the backend */}
                {message && <p className="response-message">{message}</p>}
                <p className="login-link">
                    Not an admin? <Link to="/login">Go to Student Login</Link>
                </p>
            </div>
        </div>
    );
}

export default AdminLogin;