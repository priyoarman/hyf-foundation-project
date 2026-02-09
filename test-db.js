
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./memory_game', (err) => {
    if (err) {
        console.error('Connection failed:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
    db.close();
});