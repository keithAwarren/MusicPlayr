import React from "react";
import "../components/recentlyPlayed.css";

function RecentlyPlayed({ tracks, onToggle }) {
  return (
    <div className="recently-played">
      <h2>Recently Played Tracks</h2>
      <button onClick={onToggle}>Hide Recently Played</button>
      <div className="recently-played-list">
        {tracks.map((item) => (
          <div key={item.track.id} className="recently-played-item">
            <img
              src={item.track.album?.images[0]?.url || ""}
              alt={item.track.name}
              className="track-img"
            />
            <div>
              <p className="track-title">{item.track.name}</p>
              <p className="track-artists">
                {item.track.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentlyPlayed;