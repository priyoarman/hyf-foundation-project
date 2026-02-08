const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());

// Setup MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change as needed
    password: '', // Change as needed
    database: 'memory_game' // Create this DB in DBeaver
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// API endpoint to get cards
app.get('/api/cards', (req, res) => {
    db.query('SELECT * FROM cards', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
