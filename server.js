import express from "express";
const app = express();





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
