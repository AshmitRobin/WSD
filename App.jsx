import React, { useState } from "react";
import "./App.css";

import ArtistsModule from "./ArtistsModule";
import AlbumModule from "./AlbumModule";
import SongModule from "./SongModule";

function App() {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);

  return (
    <div className="app-container">
      <h1 className="title">Music Manager</h1>

      <div className="modules-wrapper">
        <ArtistsModule artists={artists} setArtists={setArtists} />

        <AlbumModule
          albums={albums}
          setAlbums={setAlbums}
          artists={artists}
        />

        <SongModule songs={songs} setSongs={setSongs} albums={albums} />
      </div>
    </div>
  );
}

export default App;
