import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import Login from './components/Login.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import Register from './components/Register.jsx';
import BookList from './components/BookList.jsx';
import StudentList from './components/StudentList.jsx';
import AddBookForm from './components/AddBookForm.jsx';
import IssueBookForm from './components/IssueBookForm.jsx';
import TransactionList from './components/TransactionList.jsx';
import MyReceipts from './components/MyReceipts.jsx';
import ViewAllReceipts from './components/ViewAllReceipts.jsx'; // <-- Import
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MyTransactions from './components/MyTransactions.jsx';
import './index.css';

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/admin-login", element: <AdminLogin /> },
  { path: "/register", element: <Register /> },
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <BookList /> },
      { path: "books", element: <BookList /> },
      { path: "my-receipts", element: <MyReceipts /> },
      {
        path: "students",
        element: (<ProtectedRoute><StudentList /></ProtectedRoute>),
      },
      {
        path: "add-book",
        element: (<ProtectedRoute><AddBookForm /></ProtectedRoute>),
      },
      {
        path: "issue",
        element: (<ProtectedRoute><IssueBookForm /></ProtectedRoute>),
      },
      {
        path: "transactions",
        element: (<ProtectedRoute><TransactionList /></ProtectedRoute>),
      },
      {
        path: "all-receipts", // <-- Add new admin route
        element: (<ProtectedRoute><ViewAllReceipts /></ProtectedRoute>),
      },
      
       {
        path: "my-transactions", // <-- 2. Add the new route path
        element: <MyTransactions />,   // <-- 3. Tell it which component to show
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);