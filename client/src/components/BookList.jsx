import React, { useState, useEffect } from 'react';
import api from '../api.js';
import './BookList.css';

function BookList() {
    const [books, setBooks] = useState([]);

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
        fetchBooks();
    }, []);

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
            <h2>Manage Books</h2>
            <table>
                <thead>
                    <tr>
                        <th>ISBN</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.ISBN}>
                            <td>{book.ISBN}</td>
                            <td>{book.Title}</td>
                            <td>{book.Author}</td>
                            <td>₹{book.Price}</td>
                            <td>{book.Availability ? 'Available' : 'Issued'}</td>
                            <td>
                                <button
                                    onClick={() => handleDelete(book.ISBN)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BookList;