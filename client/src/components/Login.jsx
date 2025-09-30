import React, { useState } from 'react';
import api from '../api.js';
import { Link } from 'react-router-dom';
import './Login.css'; // This will now correctly link to the CSS file below

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('http://localhost:3001/api/users/login', formData);
            localStorage.setItem('token', res.data.token);
            window.location.href = '/books'; // Redirect to the main dashboard
        } catch (err) {
            setMessage(err.response?.data || 'Login failed.');
        }
    };

    return (
        <div className="login-page-full">
            <div className="bookshelf-bg"></div> {/* <-- Add this div for the background image */}
            <header className="app-main-header">
                <h1>Library Archive</h1>
            </header>
            <div className="login-container-full">
                <h2>Student Login</h2> {/* Changed from User Login */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input id="username" name="username" onChange={handleChange} placeholder="Enter your username" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" onChange={handleChange} placeholder="Enter your password" required />
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
