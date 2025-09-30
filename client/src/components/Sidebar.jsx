import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="app-sidebar">
      <nav>
        <ul>
          <li><Link to="/books">Manage Books</Link></li>
          <li><Link to="/students">Manage Students</Link></li>
          <li><Link to="/issue">Issue a Book</Link></li>
          <li><Link to="/receipts">View Receipts</Link></li>
          <li><Link to="/transactions">Return a Book</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;