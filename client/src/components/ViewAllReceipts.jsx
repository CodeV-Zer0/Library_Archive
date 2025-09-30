import React, { useState, useEffect } from 'react';
import api from '../api.js';

function ViewAllReceipts() {
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        const fetchAllReceipts = async () => {
            try {
                const response = await api.get('/receipts');
                setReceipts(response.data);
            } catch (error) {
                console.error("Error fetching all receipts:", error);
            }
        };
        fetchAllReceipts();
    }, []);

    return (
        <div>
            <h2>All Transaction Receipts</h2>
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
        </div>
    );
}

export default ViewAllReceipts;