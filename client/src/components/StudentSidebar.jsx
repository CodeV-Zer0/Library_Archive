// client/src/components/StudentSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Reuse the same styles

function StudentSidebar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <aside className="app-sidebar">
      <nav>
        <ul>
          <li><Link to="/books">Browse Books</Link></li>
          <li><Link to="/my-transactions">Return a Book</Link></li>
          <li><Link to="/my-receipts">View My Receipts</Link></li>
          <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
        </ul>
      </nav>
    </aside>
  );
}

export default StudentSidebar;  