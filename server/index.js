// --- Imports ---
const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, isAdmin } = require('./middleware');

// --- Constants ---
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors({
    origin: [
        'http://localhost:5173',                    // Local development
        'http://127.0.0.1:5173',                    // Alternative localhost
        'https://library-archive-client.onrender.com' // ← Your Render frontend URL
    ],
    credentials: true
}));

app.use(express.json());

// --- User & Authentication Routes ---
app.post('/api/users/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO Users (username, password, role) VALUES (?, ?, ?)';
        await db.query(sql, [username, hashedPassword, role || 'student']);
        res.status(201).send('User registered successfully.');
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).send('Username already exists.');
        }
        res.status(500).send('Database error during registration.');
    }
});

app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const sql = 'SELECT * FROM Users WHERE username = ?';
        const [users] = await db.query(sql, [username]);
        if (users.length === 0) return res.status(404).send('User not found.');

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send('Invalid credentials.');

        let registerNumber = null;
        if (user.role === 'student') {
            const [studentRows] = await db.query(
                'SELECT Register_Number FROM Student WHERE Register_Number = ? OR Name = ?',
                [user.username, user.username]
            );
            if (studentRows.length > 0) {
                registerNumber = studentRows[0].Register_Number;
            }
        }

        const tokenPayload = { id: user.id, role: user.role, username: user.username, registerNumber };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ token, role: user.role });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).send('Server error during login.');
    }
});

// --- Book Routes ---
app.get('/api/books', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Books');
        res.json(rows);
    } catch (err) {
        res.status(500).send("Database error");
    }
});

app.get('/api/books/:isbn', authenticateToken, async (req, res) => {
    try {
        const { isbn } = req.params;
        const [rows] = await db.query('SELECT * FROM Books WHERE ISBN = ?', [isbn]);
        if (rows.length === 0) {
            return res.status(404).send('Book not found');
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).send("Database error");
    }
});

app.post('/api/books', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { ISBN, Title, Author, Price, Category, Publisher_Id } = req.body;
        const sql = 'INSERT INTO Books (ISBN, Title, Author, Price, Category, Publisher_Id) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(sql, [ISBN, Title, Author, Price, Category, Publisher_Id]);
        res.status(201).send('Book created successfully');
    } catch (err) {
        res.status(500).send("Database error");
    }
});

app.put('/api/books/:isbn', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { isbn } = req.params;
        const { Title, Author, Price, Category, Publisher_Id } = req.body;
        const sql = `UPDATE Books SET Title = ?, Author = ?, Price = ?, Category = ?, Publisher_Id = ? WHERE ISBN = ?`;
        const [result] = await db.query(sql, [Title, Author, Price, Category, Publisher_Id, isbn]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Book not found');
        }
        res.send('Book updated successfully');
    } catch (err) {
        res.status(500).send("Database error");
    }
});

app.delete('/api/books/:isbn', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { isbn } = req.params;
        const sql = 'DELETE FROM Books WHERE ISBN = ?';
        const [result] = await db.query(sql, [isbn]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Book not found');
        }
        res.send('Book deleted successfully');
    } catch (err) {
        res.status(500).send("Database error");
    }
});

// --- Student Routes ---
app.get('/api/students', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Student');
        res.json(rows);
    } catch (err) {
        res.status(500).send("Database error");
    }
});

app.post('/api/students', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { Register_Number, Name, Email, Ph_No } = req.body;
        const sql = 'INSERT INTO Student (Register_Number, Name, Email, Ph_No) VALUES (?, ?, ?, ?)';
        await db.query(sql, [Register_Number, Name, Email, Ph_No]);
        res.status(201).send('Student created successfully');
    } catch (err) {
        res.status(500).send("Database error");
    }
});

app.put('/api/students/:register_number', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { register_number } = req.params;
        const { Name, Email, Ph_No } = req.body;
        const sql = 'UPDATE Student SET Name = ?, Email = ?, Ph_No = ? WHERE Register_Number = ?';
        const [result] = await db.query(sql, [Name, Email, Ph_No, register_number]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Student not found');
        }
        res.send('Student updated successfully');
    } catch (err) {
        res.status(500).send("Database error");
    }
});

app.delete('/api/students/:register_number', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { register_number } = req.params;
        const sql = 'DELETE FROM Student WHERE Register_Number = ?';
        const [result] = await db.query(sql, [register_number]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Student not found');
        }
        res.send('Student deleted successfully');
    } catch (err) {
        res.status(500).send("Database error");
    }
});

// --- Transaction & Receipt Routes ---
app.get('/api/transactions/active', authenticateToken, isAdmin, async (req, res) => {
    try {
        const sql = "SELECT * FROM Book_Transaction WHERE Status = 'Issued' ORDER BY Issue_Date DESC";
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).send("Database error");
    }
});

app.get('/api/my-transactions', authenticateToken, async (req, res) => {
    try {
        const { registerNumber } = req.user;
        if (!registerNumber) return res.json([]);
        const sql = "SELECT * FROM Book_Transaction WHERE Register_Number = ? AND Status = 'Issued'";
        const [transactionRows] = await db.query(sql, [registerNumber]);
        res.json(transactionRows);
    } catch (err) {
        res.status(500).send("Database error");
    }
});

app.post('/api/transactions', authenticateToken, isAdmin, async (req, res) => {
    const { ISBN, Register_Number } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        const transactionSql = 'INSERT INTO Book_Transaction (ISBN, Register_Number, Issue_Date, Status) VALUES (?, ?, CURDATE(), ?)';
        const [insertResult] = await connection.query(transactionSql, [ISBN, Register_Number, 'Issued']);
        const newTransactionId = insertResult.insertId;
        const updateBookSql = 'UPDATE Books SET Availability = 0 WHERE ISBN = ? AND Availability = 1';
        const [updateResult] = await connection.query(updateBookSql, [ISBN]);
        if (updateResult.affectedRows === 0) {
            throw new Error('Book is not available or does not exist.');
        }
        await connection.commit();
        const scannerId = 1;
        await db.query('INSERT INTO Receipt (Scanner_Id, Transaction_Id) VALUES (?, ?)', [scannerId, newTransactionId]);
        res.status(201).send('Book issued successfully.');
    } catch (err) {
        if (connection) await connection.rollback();
        res.status(500).send(err.message || "Database error during transaction.");
    } finally {
        if (connection) connection.release();
    }
});

app.put('/api/transactions/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        const [rows] = await connection.query('SELECT ISBN FROM Book_Transaction WHERE Transaction_Id = ?', [id]);
        if (rows.length === 0) {
            throw new Error('Transaction not found.');
        }
        const { ISBN } = rows[0];
        const updateTransactionSql = 'UPDATE Book_Transaction SET Return_Date = CURDATE(), Status = ? WHERE Transaction_Id = ?';
        await connection.query(updateTransactionSql, ['Returned', id]);
        const updateBookSql = 'UPDATE Books SET Availability = 1 WHERE ISBN = ?';
        await connection.query(updateBookSql, [ISBN]);
        await connection.commit();
        res.send('Book returned successfully.');
    } catch (err) {
        if (connection) await connection.rollback();
        res.status(500).send(err.message || "Database error during return transaction.");
    } finally {
        if (connection) connection.release();
    }
});

app.put('/api/transactions/:id/pay', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'UPDATE Book_Transaction SET Fine = 0.00 WHERE Transaction_Id = ?';
        const [result] = await db.query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Transaction not found.');
        }
        res.send('Fine paid successfully.');
    } catch (err) {
        res.status(500).send("Database error.");
    }
});

app.get('/api/receipts', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Receipt ORDER BY Generated_time DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).send("Database error");
    }
});

// --- Search Routes ---
app.get('/api/books/search', authenticateToken, async (req, res) => {
    try {
        const { q } = req.query;
        const searchQuery = `%${q}%`;
        const sql = 'SELECT * FROM Books WHERE Title LIKE ? OR Author LIKE ?';
        const [rows] = await db.query(sql, [searchQuery, searchQuery]);
        res.json(rows);
    } catch (err) {
        console.error("Error searching books:", err);
        res.status(500).send("Database error during search.");
    }
});

app.get('/api/students/search', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { q } = req.query;
        console.log(`Received search term: "${q}"`);
        const searchQuery = `%${q}%`;
        const sql = 'SELECT * FROM Student WHERE LOWER(Name) LIKE LOWER(?) OR LOWER(Register_Number) LIKE LOWER(?)';
        console.log('Executing SQL Query:', db.format(sql, [searchQuery, searchQuery]));
        const [rows] = await db.query(sql, [searchQuery, searchQuery]);
        res.json(rows);
    } catch (err) {
        console.error("Error searching students:", err);
        res.status(500).send("Database error during search.");
    }
});

// --- Start Server --- (MUST be at the very end)
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});