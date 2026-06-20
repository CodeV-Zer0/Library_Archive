// server/middleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'; // MUST match index.js

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Auth header received:', authHeader ? '[present]' : '[missing]');
    if (token == null) {
        console.log('No token provided with request.');
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('JWT verification failed:', err.message);
            return res.status(403).json({ error: 'Forbidden', reason: err.message }); 
        }
        console.log('JWT verified successfully for user:', user.username || user.id);
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if ((req.user.role || '').toLowerCase() !== 'admin') {
        return res.status(403).send('Access denied. Admins only.');
    }
    next();
};

module.exports = { authenticateToken, isAdmin };