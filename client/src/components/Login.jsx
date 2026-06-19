import React, { useState } from 'react';
import api from '../api.js'; // You are correctly importing this
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // ✅ FIX 1: Use 'api.post', which you imported
            // ✅ FIX 2: Call the '/users/login' endpoint (your api.js file adds the '/api' prefix)
            const res = await api.post('/users/login', formData);
            
            localStorage.setItem('token', res.data.token);
            window.location.href = '/books'; // Redirect to the main dashboard
        } catch (err) {
            // This will now show the correct error from the backend (e.g., "User not found")
            setMessage(err.response?.data || 'Login failed.');
        }
    };

    return (
        <div className="login-page-full">
            <div className="bookshelf-bg"></div>
            <header className="app-main-header">
                <h1>Library Archive</h1>
            </header>
            <div className="login-container-full">
                <h2>Student Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        {/* ✅ FIX 3: Added 'value' prop */}
                        <input 
                            id="username" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            placeholder="Enter your username" 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        {/* ✅ FIX 3: Added 'value' prop */}
                        <input 
                            id="password" 
                            name="password" 
                            type="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="Enter your password" 
                            required 
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {message && <p className="response-message">{message}</p>}
                <p className="register-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
                <p className="admin-link">
                    <Link to="/admin-login">Login as Admin</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;