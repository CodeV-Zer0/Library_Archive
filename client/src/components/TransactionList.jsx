import React, { useState, useEffect } from 'react';
import api from '../api.js';

function TransactionList() {
    const [transactions, setTransactions] = useState([]);

    const fetchTransactions = async () => {
        try {
            // You will need to create this GET endpoint in your back-end
            const response = await api.get('http://localhost:3001/api/transactions/active');
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleReturn = async (transactionId) => {
        try {
            await api.put(`http://localhost:3001/api/transactions/${transactionId}`);
            alert('Book returned!');
            fetchTransactions(); // Refresh the list
        } catch (error) {
            console.error('Error returning book:', error);
            alert('Failed to return book.');
        }
    };
    const handlePayFine = async (transactionId) => {
    try {
        await api.put(`http://localhost:3001/api/transactions/${transactionId}/pay`);
        alert('Fine Paid!');
        fetchTransactions(); // Refresh the list
    } catch (error) {
        alert('Failed to pay fine.');
    }
};

    return (
        <div>
            <h2>Issued Books</h2>
            <table>
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Book ISBN</th>
                        <th>Student ID</th>
                        <th>Issue Date</th>
                        <th>Fine</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(t => (
                        <tr key={t.Transaction_Id}>
                            <td>{t.Transaction_Id}</td>
                            <td>{t.ISBN}</td>
                            <td>{t.Register_Number}</td>
                            <td>{new Date(t.Issue_Date).toLocaleDateString()}</td>
                            <td>${t.Fine}</td>
                            <td>
                                {t.Fine > 0 && (
                                    <button onClick={() => handlePayFine(t.Transaction_Id)}>
                                        Pay Fine
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

export default TransactionList;