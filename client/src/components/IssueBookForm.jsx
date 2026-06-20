import React, { useState } from 'react';
import api from '../api.js';
import './IssueBookForm.css'; // Optional: for styling

function IssueBookForm() {
    const [formData, setFormData] = useState({
        ISBN: '',
        Register_Number: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        try {
            await api.post('/transactions', formData);
            setMessage('Book issued successfully!');
            // Clear the form
            setFormData({ ISBN: '', Register_Number: '' });
        } catch (error) {
            console.error('Error issuing book:', error);
            setMessage(`Failed to issue book. ${error.response?.data || ''}`);
        }
    };

    return (
        <div>
            <h2>Issue a New Book</h2>
            <form onSubmit={handleSubmit} className="issue-form">
                <div className="form-group">
                    <label htmlFor="ISBN">Book ISBN</label>
                    <input 
                        id="ISBN"
                        name="ISBN" 
                        value={formData.ISBN} 
                        onChange={handleChange} 
                        placeholder="Enter book ISBN" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Register_Number">Student Register Number</label>
                    <input 
                        id="Register_Number"
                        name="Register_Number" 
                        value={formData.Register_Number} 
                        onChange={handleChange} 
                        placeholder="Enter student's number" 
                        required 
                    />
                </div>
                <button type="submit">Issue Book</button>
            </form>
            {message && <p className="response-message">{message}</p>}
        </div>
    );
}

export default IssueBookForm;