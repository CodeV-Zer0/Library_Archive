// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (token) {
        const user = jwtDecode(token);
        if (user.role === 'admin') {
            return children; // If user is admin, show the page
        }
    }

    // If user is not an admin or not logged in, redirect them
    return <Navigate to="/books" replace />;
};

export default ProtectedRoute;