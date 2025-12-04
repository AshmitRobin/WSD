import React, { useState } from "react";

const ArtistsModule = ({ artists, setArtists }) => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    debutYear: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let err = {};

    if (!formData.name.trim()) err.name = "Name is required";
    if (formData.name.length < 2) err.name = "Name must be at least 2 chars";

    if (!formData.bio.trim()) err.bio = "Bio is required";

    if (!/^\d{4}$/.test(formData.debutYear))
      err.debutYear = "Enter a valid year (YYYY)";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setArtists([
      ...artists,
      {
        id: Date.now(),
        ...formData,
      },
    ]);

    setFormData({ name: "", bio: "", debutYear: "" });
    setErrors({});
    alert("Artist added!");
  };

  return (
    <div className="module">
      <h2>Artists</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Artist Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={errors.name ? "error" : ""}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}

        <textarea
          placeholder="Biography"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className={errors.bio ? "error" : ""}
        />
        {errors.bio && <span className="error-text">{errors.bio}</span>}

        <input
          type="text"
          placeholder="Debut Year (YYYY)"
          value={formData.debutYear}
          onChange={(e) =>
            setFormData({ ...formData, debutYear: e.target.value })
          }
          className={errors.debutYear ? "error" : ""}
        />
        {errors.debutYear && (
          <span className="error-text">{errors.debutYear}</span>
        )}

        <button type="submit">Add Artist</button>
      </form>

      <div className="records">
        {artists.map((a) => (
          <div key={a.id} className="record-card">
            <h3>{a.name}</h3>
            <p>{a.bio}</p>
            <p>Debut Year: {a.debutYear}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistsModule;
