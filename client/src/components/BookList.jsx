import React, { useState, useEffect } from 'react';
import api from '../api.js';
import { jwtDecode } from 'jwt-decode'; // ✅ 1. Import jwt-decode
import './BookList.css';

function BookList() {
    const [books, setBooks] = useState([]);
    const [userRole, setUserRole] = useState(null); // ✅ 2. Add state for user's role

    // Function to fetch and refresh the book list
    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    // This effect runs once when the component first loads
    useEffect(() => {
        // ✅ 3. Get token and decode it to find the user's role
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                // Based on your database, the role is 'admin' (lowercase)
                setUserRole(decodedUser.role); 
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }

        fetchBooks();
    }, []); // This effect still only runs once on load

    // Function to handle deleting a book
    const handleDelete = async (isbn) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await api.delete(`/books/${isbn}`);
                alert('Book deleted successfully!');
                fetchBooks(); // Refresh the list of books after deletion
            } catch (error) {
                console.error("Error deleting book:", error);
                alert(`Failed to delete book. ${error.response?.data || ''}`);
            }
        }
    };

    return (
        <div className="book-list-container">
            {/* The title can be dynamic based on role */}
            <h2>{userRole === 'admin' ? 'Manage Books' : 'Browse Books'}</h2>
            <table>
                <thead>
                    <tr>
                        <th>ISBN</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Price</th>
                        <th>Availability</th>
                        
                        {/* ✅ 4. Conditionally render the 'Actions' header */}
                        {userRole === 'admin' && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.ISBN}>
                            <td>{book.ISBN}</td>
                            <td>{book.Title}</td>
                            <td>{book.Author}</td>
                            <td>₹{book.Price}</td>
                            {/* Availability check was inverted, 1 is Available */}
                            <td>{book.Availability === 1 ? 'Available' : 'Issued'}</td>
                            
                            {/* ✅ 5. Conditionally render the delete button cell */}
                            {userRole === 'admin' && (
                                <td>
                                    <button
                                        onClick={() => handleDelete(book.ISBN)}
                                        className="delete-button"
                                    >
                                        Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BookList;