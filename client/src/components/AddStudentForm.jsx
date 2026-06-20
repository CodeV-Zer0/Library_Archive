import React, { useState } from 'react';
import api from '../api.js';

function AddStudentForm({ onStudentAdded }) {
    const [formData, setFormData] = useState({
        Register_Number: '',
        Name: '',
        Email: '',
        Ph_No: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/students', formData);
            alert('Student added successfully!');
            onStudentAdded(); // This function will refresh the student list
            // Clear the form
            setFormData({ Register_Number: '', Name: '', Email: '', Ph_No: '' });
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Failed to add student.');
        }
    };

    return (
        <div>
            <h2>Add New Student</h2>
            <form onSubmit={handleSubmit}>
                <input name="Register_Number" value={formData.Register_Number} onChange={handleChange} placeholder="Register Number" required />
                <input name="Name" value={formData.Name} onChange={handleChange} placeholder="Name" required />
                <input name="Email" type="email" value={formData.Email} onChange={handleChange} placeholder="Email" />
                <input name="Ph_No" value={formData.Ph_No} onChange={handleChange} placeholder="Phone Number" />
                <button type="submit">Add Student</button>
            </form>
        </div>
    );
}

export default AddStudentForm;