import React, { useState } from 'react';
import api from '../api.js';
import { Link } from 'react-router-dom';
import './Register.css'; // This will now correctly link to the CSS file below

function Register() {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'student' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('http://localhost:3001/api/users/register', formData);
            setMessage(res.data);
        } catch (err) {
            setMessage(err.response.data || 'Registration failed.');
        }
    };

    return (
        <div className="register-page">
            <div className="bookshelf-bg"></div> {/* <-- Add this div for the background image */}
            <header className="app-main-header">
                <h1>Library Archive</h1>
            </header>
            <div className="register-container">
                <h2>Register New User</h2> {/* Changed from User */}
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
