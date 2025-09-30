// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header.jsx';
import StudentSidebar from './components/StudentSidebar.jsx';
import AdminSidebar from './components/AdminSidebar.jsx'; // We will create this
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Prevents flicker
  }

  if (!user) {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        {/* Show a different sidebar based on user role */}
        {user.role === 'admin' ? <AdminSidebar /> : <StudentSidebar />}
        <main style={{ flexGrow: 1, padding: '1rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;