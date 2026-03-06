require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // To serve index.html

// ================= DATABASE CONNECTION =================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error(" Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL Database");
    connection.release();
  }
});

// ================= VALIDATION FUNCTIONS =================
const isValidYear = (year) =>
  year >= 1900 && year <= new Date().getFullYear();

const isNonEmpty = (value) =>
  value && value.trim().length > 0;

// ================= HOME ROUTE =================
app.get('/', (req, res) => {
  res.send(' Music Records API is running successfully!');
});

// ================= ARTISTS =================

// Add Artist
app.post('/artists', (req, res) => {
  const { name, country, debut_year } = req.body;

  if (!isNonEmpty(name) || !isValidYear(debut_year)) {
    return res.status(400).json({ message: "Invalid artist data" });
  }

  const sql = 'INSERT INTO artists (name, country, debut_year) VALUES (?, ?, ?)';

  db.query(sql, [name, country, debut_year], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      message: "Artist added successfully",
      id: result.insertId
    });
  });
});

// Get All Artists
app.get('/artists', (req, res) => {
  db.query('SELECT * FROM artists', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Delete Artist
app.delete('/artists/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM artists WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Artist not found" });

    res.json({ message: "Artist deleted successfully" });
  });
});

// ================= GENRES =================

app.post('/genres', (req, res) => {
  const { name } = req.body;

  if (!isNonEmpty(name))
    return res.status(400).json({ message: "Genre name required" });

  db.query('INSERT INTO genres (name) VALUES (?)',
    [name],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Genre added", id: result.insertId });
    });
});

app.get('/genres', (req, res) => {
  db.query('SELECT * FROM genres', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ================= LABELS =================

app.post('/labels', (req, res) => {
  const { name, headquarters } = req.body;

  if (!isNonEmpty(name))
    return res.status(400).json({ message: "Label name required" });

  db.query(
    'INSERT INTO labels (name, headquarters) VALUES (?, ?)',
    [name, headquarters],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Label added", id: result.insertId });
    }
  );
});

app.get('/labels', (req, res) => {
  db.query('SELECT * FROM labels', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ================= ALBUMS =================

app.post('/albums', (req, res) => {
  const { title, artist_id, genre_id, label_id, release_year } = req.body;

  if (!isNonEmpty(title) || !isValidYear(release_year))
    return res.status(400).json({ message: "Invalid album data" });

  db.query(
    'INSERT INTO albums (title, artist_id, genre_id, label_id, release_year) VALUES (?, ?, ?, ?, ?)',
    [title, artist_id, genre_id, label_id, release_year],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Album added", id: result.insertId });
    }
  );
});

app.get('/albums', (req, res) => {
  const sql = `
    SELECT albums.*, artists.name AS artist_name
    FROM albums
    JOIN artists ON albums.artist_id = artists.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ================= SONGS =================

app.post('/songs', (req, res) => {
  const { title, album_id, duration } = req.body;

  if (!isNonEmpty(title) || duration <= 0)
    return res.status(400).json({ message: "Invalid song data" });

  db.query(
    'INSERT INTO songs (title, album_id, duration) VALUES (?, ?, ?)',
    [title, album_id, duration],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Song added", id: result.insertId });
    }
  );
});

app.get('/songs', (req, res) => {
  const sql = `
    SELECT songs.*, albums.title AS album_title
    FROM songs
    JOIN albums ON songs.album_id = albums.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ================= PLAYLISTS =================

app.post('/playlists', (req, res) => {
  const { name } = req.body;

  if (!isNonEmpty(name))
    return res.status(400).json({ message: "Playlist name required" });

  db.query('INSERT INTO playlists (name) VALUES (?)',
    [name],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Playlist created", id: result.insertId });
    });
});

app.get('/playlists', (req, res) => {
  db.query('SELECT * FROM playlists', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ================= AWARDS =================

app.post('/awards', (req, res) => {
  const { artist_id, award_name, year } = req.body;

  if (!isNonEmpty(award_name) || !isValidYear(year))
    return res.status(400).json({ message: "Invalid award data" });

  db.query(
    'INSERT INTO awards (artist_id, award_name, year) VALUES (?, ?, ?)',
    [artist_id, award_name, year],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Award added", id: result.insertId });
    }
  );
});

app.get('/awards', (req, res) => {
  db.query('SELECT * FROM awards', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
