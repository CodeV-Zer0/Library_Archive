// client/src/components/AddBookForm.jsx
import React, { useState } from 'react';
import api from '../api.js';

function AddBookForm() {
    const [formData, setFormData] = useState({
        ISBN: '',
        Title: '',
        Author: '',
        Price: '',
        Publisher_Id: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/books', formData); // Use the protected endpoint
            setMessage('Book added successfully!');
            // Clear the form
            setFormData({ ISBN: '', Title: '', Author: '', Price: '', Publisher_Id: '' });
        } catch (error) {
            console.error('Error adding book:', error);
            setMessage(error.response?.data || 'Failed to add book.');
        }
    };

    return (
        <div>
            <h2>Add a New Book</h2>
            <form onSubmit={handleSubmit}>
                <input name="ISBN" value={formData.ISBN} onChange={handleChange} placeholder="ISBN" required />
                <input name="Title" value={formData.Title} onChange={handleChange} placeholder="Title" required />
                <input name="Author" value={formData.Author} onChange={handleChange} placeholder="Author" />
                <input name="Price" type="number" step="0.01" value={formData.Price} onChange={handleChange} placeholder="Price" />
                <input name="Publisher_Id" type="number" value={formData.Publisher_Id} onChange={handleChange} placeholder="Publisher ID" />
                <button type="submit">Add Book</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AddBookForm;