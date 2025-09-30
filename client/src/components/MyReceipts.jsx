import React, { useState, useEffect } from 'react';
import api from '../api.js'; // Use our authenticated api helper

function MyReceipts() {
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        const fetchMyReceipts = async () => {
            try {
                // This calls the specific endpoint for the logged-in user's receipts
                const response = await api.get('/my-receipts');
                setReceipts(response.data);
            } catch (error) {
                console.error("Error fetching my receipts:", error);
            }
        };

        fetchMyReceipts();
    }, []);

    return (
        <div>
            <h2>My Transaction Receipts</h2>
            {receipts.length === 0 ? (
                <p>You have no receipts to display.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Receipt ID</th>
                            <th>Scanner ID</th>
                            <th>Generated Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receipts.map(receipt => (
                            <tr key={receipt.Receipt_Id}>
                                <td>{receipt.Receipt_Id}</td>
                                <td>{receipt.Scanner_Id}</td>
                                <td>{new Date(receipt.Generated_time).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MyReceipts;