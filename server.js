import express from "express";
import sqlite3Module from "sqlite3";
import cors from "cors";

const sqlite3 = sqlite3Module.verbose();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/assets', express.static('assets'));

const db = new sqlite3.Database("./cards.db", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to the cards database.");
});

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT)",
  );
  db.run("DELETE FROM cards", () => {
    db.get("SELECT count(*) as count FROM cards", (err, row) => {
      if (err) {
        console.error("Error counting cards:", err.message);
        return;
      }
      if (row.count === 0) {
        const initialCards = ["AKMN.jpg", "DTMP.jpg", "DYNS.jpeg", "KJUN.webp", "MTFN.jpg", "NMDI.jpeg", "VPTN.jpg", "XIJP.jpg"];
        const stmt = db.prepare("INSERT INTO cards (value) VALUES (?)");
        initialCards.forEach((card) => stmt.run(card));
        stmt.finalize();
        console.log("Database seeded with initial cards.");
      }
    });
  });
});

app.get("/api/cards", (req, res) => {
  db.all("SELECT value FROM cards", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const cards = rows.map((row) => row.value);
    res.json(cards);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
