// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const user = jwtDecode(token);
            const expiresAt = user.exp ? user.exp * 1000 : 0;
            if (expiresAt && expiresAt < Date.now()) {
                localStorage.removeItem('token');
                return <Navigate to="/login" replace />;
            }
            if ((user.role || '').toLowerCase() === 'admin') {
                return children; // If user is admin, show the page
            }
        } catch (error) {
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }
    }

    // If user is not an admin or not logged in, redirect them
    return <Navigate to="/books" replace />;
};

export default ProtectedRoute;