import React, { useState, useEffect } from 'react';
import api from '../api.js';

function MyTransactions() {
    const [transactions, setTransactions] = useState([]);

    const fetchMyTransactions = async () => {
        try {
            const response = await api.get('/my-transactions');
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        fetchMyTransactions();
    }, []);

    const handleReturn = async (transactionId) => {
        try {
            await api.put(`/transactions/${transactionId}`);
            alert('Book returned successfully!');
            fetchMyTransactions(); // This line is crucial for refreshing the list
        } catch (error) {
            console.error('Error returning book:', error);
            alert('Failed to return book.');
        }
    };

    return (
        <div>
            <h2>My Borrowed Books</h2>
            <table>
                <thead>
                    <tr>
                        <th>Book ISBN</th>
                        <th>Issue Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(t => (
                        <tr key={t.Transaction_Id}>
                            <td>{t.ISBN}</td>
                            <td>{new Date(t.Issue_Date).toLocaleDateString()}</td>
                            <td>{t.Status}</td>
                            <td>
                                {t.Status === 'Issued' && (
                                    <button onClick={() => handleReturn(t.Transaction_Id)}>
                                        Return
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyTransactions;