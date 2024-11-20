import React, { useState } from "react";
import "./dashboard.css";

function Dashboard() {
  const [filter, setFilter] = useState("tracks"); // Default filter to tracks

  return (
    <div className="screen-container dashboard-container">
      <h1>User Dashboard</h1>
      <div className="filters">
        <button
          className={filter === "tracks" ? "active" : ""}
          onClick={() => setFilter("tracks")}
        >
          Tracks
        </button>
        <button
          className={filter === "playlists" ? "active" : ""}
          onClick={() => setFilter("playlists")}
        >
          Playlists
        </button>
        <button
          className={filter === "lyrics" ? "active" : ""}
          onClick={() => setFilter("lyrics")}
        >
          Lyrics
        </button>
      </div>
      <div className="favorites-list">
        <p>
          Showing {filter === "tracks"
            ? "Tracks"
            : filter === "playlists"
            ? "Playlists"
            : "Lyrics"}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;