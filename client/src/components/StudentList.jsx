import React, { useState, useEffect } from 'react';
import api from '../api.js';

function StudentList() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get('/students');
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };
        fetchStudents();
    }, []);

    return (
        <div>
            <h2>Manage Students</h2>
            <table>
                <thead>
                    <tr>
                        <th>Register Number</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone No</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.Register_Number}>
                            <td>{student.Register_Number}</td>
                            <td>{student.Name}</td>
                            <td>{student.Email}</td>
                            <td>{student.Ph_No}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentList;