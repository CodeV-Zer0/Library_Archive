import React, { useState, useEffect } from 'react';
import api from '../api.js';

function ReceiptList() {
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await api.get('http://localhost:3001/api/receipts');
                setReceipts(response.data);
            } catch (error) {
                console.error("Error fetching receipts:", error);
            }
        };
        fetchReceipts();
    }, []);

    return (
        <div>
            <h2>Transaction Receipts</h2>
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

export default ReceiptList;