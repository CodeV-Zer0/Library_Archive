import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function AdminSidebar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <aside className="app-sidebar">
      <nav>
        <ul>
          <li><Link to="/books">Manage Books</Link></li>
          <li><Link to="/students">Manage Students</Link></li>
          <li><Link to="/add-book">Add a Book</Link></li>
          <li><Link to="/issue">Issue a Book</Link></li>
          <li><Link to="/transactions">Borrowed Books</Link></li>
          <li><Link to="/all-receipts">View Receipts</Link></li> {/* <-- Update this link */}
          <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
        </ul>
      </nav>
    </aside>
  );
}

export default AdminSidebar;