import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';   // ← This line is missing!

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'student'
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await api.post('/users/register', formData);
        setMessage(res.data || 'Registration successful!');
        // Auto redirect to login after success
        setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
        console.error(err);
        setMessage(err.response?.data || 'Registration failed.');
    }
};

    // ... rest of your component (return JSX) stays the same
    return (
        <div className="register-page">
            <header className="app-main-header">
                <h1>Library Management System</h1>
            </header>
            <div className="register-container">
                <h2>Register New User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input id="username" name="username" onChange={handleChange} placeholder="Enter a username" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" onChange={handleChange} placeholder="Enter a password" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select id="role" name="role" onChange={handleChange} value={formData.role}>
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit">Register</button>
                </form>
                {message && <p className="response-message">{message}</p>}
                <p className="login-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;