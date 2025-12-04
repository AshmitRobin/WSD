import React, { useState } from "react";

const AlbumModule = ({ albums, setAlbums, artists }) => {
  const [formData, setFormData] = useState({
    title: "",
    artistId: "",
    year: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let err = {};

    if (!formData.title.trim()) err.title = "Album title required";
    if (!formData.artistId) err.artistId = "Select an artist";

    if (!/^\d{4}$/.test(formData.year)) err.year = "Valid year required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const artistName =
      artists.find((a) => a.id === parseInt(formData.artistId))?.name || "";

    setAlbums([
      ...albums,
      {
        id: Date.now(),
        title: formData.title,
        artistId: formData.artistId,
        artist: artistName,
        year: formData.year,
      },
    ]);

    setFormData({ title: "", artistId: "", year: "" });
    alert("Album added!");
  };

  return (
    <div className="module">
      <h2>Albums</h2>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Album Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={errors.title ? "error" : ""}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}

        <select
          value={formData.artistId}
          onChange={(e) =>
            setFormData({ ...formData, artistId: e.target.value })
          }
          className={errors.artistId ? "error" : ""}
        >
          <option value="">Select Artist</option>
          {artists.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        {errors.artistId && (
          <span className="error-text">{errors.artistId}</span>
        )}

        <input
          type="text"
          placeholder="Release Year (YYYY)"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className={errors.year ? "error" : ""}
        />
        {errors.year && <span className="error-text">{errors.year}</span>}

        <button type="submit">Add Album</button>
      </form>

      <div className="records">
        {albums.map((al) => (
          <div key={al.id} className="record-card">
            <h3>{al.title}</h3>
            <p>Artist: {al.artist}</p>
            <p>Year: {al.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumModule;
