import React, { useState } from 'react';
import api from '../api.js';
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
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const res = await axios.post(`${apiUrl}/api/users/register`, formData);
            const token = res.data.token;
            
            const decodedUser = jwtDecode(token);

            if (decodedUser.role !== 'admin') {
                setMessage('Access Denied. You are not an admin.');
                return;
            }

            localStorage.setItem('token', token);
            window.location.href = '/books';
        } catch (err) {
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
                        <input id="username" name="username" onChange={handleChange} placeholder="Enter admin username" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" onChange={handleChange} placeholder="Enter password" required />
                    </div>
                    <button type="submit">Login as Admin</button>
                </form>
                {message && <p className="response-message">{message}</p>}
                <p className="login-link">
                    Not an admin? <Link to="/login">Go to Student Login</Link>
                </p>
            </div>
        </div>
    );
}

export default AdminLogin;