require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

app.use(express.static("public"));

/* ================= DATABASE CONNECTION ================= */
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "musicrecordsdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error(" Database connection failed:", err.message);
  } else {
    console.log(" Connected to MySQL Database");
    connection.release();
  }
});

/* ================= HOME ROUTE ================= */
app.get("/", (req, res) => {
  res.send(" Music Records API is running ");
});

/* =========================================================
   ===================== ARTISTS ============================
   ========================================================= */

// Add Artist
app.post("/artists", (req, res) => {
  const { name, country, debut_year } = req.body;

  if (!name || !country || !debut_year)
    return res.status(400).json({ message: "All fields required" });

  db.query(
    "INSERT INTO artists (name, country, debut_year) VALUES (?, ?, ?)",
    [name, country, debut_year],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({
        message: "Artist added successfully",
        id: result.insertId
      });
    }
  );
});

// Get All Artists
app.get("/artists", (req, res) => {
  db.query("SELECT * FROM artists", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Delete Artist
app.delete("/artists/:id", (req, res) => {
  db.query(
    "DELETE FROM artists WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Artist deleted" });
    }
  );
});

/* ===================== GENRES ===================== */

app.post("/genres", (req, res) => {
  if (!req.body.name)
    return res.status(400).json({ message: "Genre name required" });

  db.query(
    "INSERT INTO genres (name) VALUES (?)",
    [req.body.name],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Genre added", id: result.insertId });
    }
  );
});

app.get("/genres", (req, res) => {
  db.query("SELECT * FROM genres", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ===================== LABELS ===================== */

app.post("/labels", (req, res) => {
  const { name, headquarters } = req.body;

  db.query(
    "INSERT INTO labels (name, headquarters) VALUES (?, ?)",
    [name, headquarters],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Label added", id: result.insertId });
    }
  );
});

app.get("/labels", (req, res) => {
  db.query("SELECT * FROM labels", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ===================== ALBUMS ===================== */

app.post("/albums", (req, res) => {
  const { title, artist_id, genre_id, label_id, release_year } = req.body;

  db.query(
    "INSERT INTO albums (title, artist_id, genre_id, label_id, release_year) VALUES (?, ?, ?, ?, ?)",
    [title, artist_id, genre_id, label_id, release_year],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Album added", id: result.insertId });
    }
  );
});

app.get("/albums", (req, res) => {
  db.query("SELECT * FROM albums", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ===================== SONGS ===================== */

app.post("/songs", (req, res) => {
  const { title, album_id, duration } = req.body;

  db.query(
    "INSERT INTO songs (title, album_id, duration) VALUES (?, ?, ?)",
    [title, album_id, duration],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Song added", id: result.insertId });
    }
  );
});

app.get("/songs", (req, res) => {
  db.query("SELECT * FROM songs", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ===================== PLAYLISTS ===================== */

app.post("/playlists", (req, res) => {
  db.query(
    "INSERT INTO playlists (name) VALUES (?)",
    [req.body.name],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Playlist added", id: result.insertId });
    }
  );
});

app.get("/playlists", (req, res) => {
  db.query("SELECT * FROM playlists", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ===================== AWARDS ===================== */

app.post("/awards", (req, res) => {
  const { artist_id, award_name, year } = req.body;

  db.query(
    "INSERT INTO awards (artist_id, award_name, year) VALUES (?, ?, ?)",
    [artist_id, award_name, year],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Award added", id: result.insertId });
    }
  );
});

app.get("/awards", (req, res) => {
  db.query("SELECT * FROM awards", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ===================== START SERVER ===================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
