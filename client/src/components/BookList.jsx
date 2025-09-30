import React, { useState, useEffect } from 'react';
import api from '../api.js';
import './BookList.css'; // Optional: for styling

function BookList() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // This function runs once when the component is loaded
        const fetchBooks = async () => {
            try {
                // Make a GET request to your back-end API endpoint for books
                const response = await api.get('http://localhost:3001/api/books');
                setBooks(response.data); // Store the array of books in our state
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchBooks();
    }, []); // The empty array [] means this effect runs only one time

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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BookList;