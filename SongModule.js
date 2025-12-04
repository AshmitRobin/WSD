import React, { useState } from "react";

const SongModule = ({ songs, setSongs, albums }) => {
  const [formData, setFormData] = useState({
    title: "",
    albumId: "",
    duration: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let err = {};

    if (!formData.title.trim()) err.title = "Song title required";
    if (!formData.albumId) err.albumId = "Album required";
    if (!/^[0-9]{1,2}:[0-5][0-9]$/.test(formData.duration))
      err.duration = "Duration must be mm:ss";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const albumName =
      albums.find((al) => al.id === parseInt(formData.albumId))?.title || "";

    setSongs([
      ...songs,
      {
        id: Date.now(),
        title: formData.title,
        duration: formData.duration,
        album: albumName,
      },
    ]);

    setFormData({ title: "", albumId: "", duration: "" });
    alert("Song added!");
  };

  return (
    <div className="module">
      <h2>Songs</h2>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Song Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={errors.title ? "error" : ""}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}

        <select
          value={formData.albumId}
          onChange={(e) =>
            setFormData({ ...formData, albumId: e.target.value })
          }
          className={errors.albumId ? "error" : ""}
        >
          <option value="">Select Album</option>
          {albums.map((al) => (
            <option key={al.id} value={al.id}>
              {al.title}
            </option>
          ))}
        </select>
        {errors.albumId && (
          <span className="error-text">{errors.albumId}</span>
        )}

        <input
          type="text"
          placeholder="Duration (mm:ss)"
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: e.target.value })
          }
          className={errors.duration ? "error" : ""}
        />
        {errors.duration && (
          <span className="error-text">{errors.duration}</span>
        )}

        <button type="submit">Add Song</button>
      </form>

      <div className="records">
        {songs.map((s) => (
          <div key={s.id} className="record-card">
            <h3>{s.title}</h3>
            <p>Album: {s.album}</p>
            <p>Duration: {s.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongModule;
