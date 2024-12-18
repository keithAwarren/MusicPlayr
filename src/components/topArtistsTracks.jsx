import React from "react";
import "../components/topArtistsTracks.css";

function TopArtistsTracks({ tracks, artists, onToggle }) {
  return (
    <div className="top-content">
      <button onClick={onToggle} className="back-button">
        Back to Dashboard
      </button>
      <div className="top-section">
        <h2>Top Tracks</h2>
        <div className="top-tracks">
          {tracks.map((track) => (
            <div key={track.id} className="top-item">
              <img
                src={track.album?.images[0]?.url || ""}
                alt={track.name}
                className="top-img"
              />
              <div>
                <p className="track-title">{track.name}</p>
                <p className="track-artists">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="top-section">
        <h2>Top Artists</h2>
        <div className="top-artists">
          {artists.map((artist) => (
            <div key={artist.id} className="top-item">
              <img
                src={artist.images?.[0]?.url || ""}
                alt={artist.name}
                className="top-img"
              />
              <p className="artist-name">{artist.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopArtistsTracks;