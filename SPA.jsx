import React, { useState } from "react";

export default function MusicSPA() {
  /* ACTIVE MODULE */
  const [activeModule, setActiveModule] = useState("artists");

  /* MAIN DATA */
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [genres, setGenres] = useState([]);

  /* INPUT STATES */
  const [input, setInput] = useState("");

  /* ERROR */
  const [error, setError] = useState("");

  const validate = (val) => val.trim().length >= 3;

  const addItem = (list, setList, label) => {
    if (!validate(input)) {
      setError(`${label} must be at least 3 characters`);
      return;
    }
    setList([...list, input]);
    setInput("");
    setError("");
  };

  const removeItem = (list, setList, index) => {
    setList(list.filter((_, i) => i !== index));
  };

  /* RENDER MODULE CONTENT */
  const renderModule = () => {
    switch (activeModule) {
      case "artists":
        return renderSection("Artists", artists, setArtists);
      case "songs":
        return renderSection("Songs", songs, setSongs);
      case "albums":
        return renderSection("Albums", albums, setAlbums);
      case "genres":
        return renderSection("Genres", genres, setGenres);
      default:
        return null;
    }
  };

  const renderSection = (title, list, setList) => (
    <section className="module-box">
      <h1>{title}</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addItem(list, setList, title.slice(0, -1));
        }}
      >
        <input
          type="text"
          placeholder={`Enter ${title.slice(0, -1)} name`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button>Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      {list.length === 0 && <p>No {title.toLowerCase()} added yet</p>}

      <ul>
        {list.map((item, i) => (
          <li key={i}>
            {item}
            <button onClick={() => removeItem(list, setList, i)}>❌</button>
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <div className="container">
      <nav className="top-nav">
        <h2>🎵 Music Manager</h2>

        <div className="nav-buttons">
          <button onClick={() => setActiveModule("artists")}>Artists</button>
          <button onClick={() => setActiveModule("songs")}>Songs</button>
          <button onClick={() => setActiveModule("albums")}>Albums</button>
          <button onClick={() => setActiveModule("genres")}>Genres</button>
        </div>
      </nav>

      <p className="stats">
        Artists: {artists.length} | Songs: {songs.length} | Albums:{" "}
        {albums.length} | Genres: {genres.length}
      </p>

      {renderModule()}
    </div>
  );
}
