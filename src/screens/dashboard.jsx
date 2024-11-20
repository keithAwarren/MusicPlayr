import React, { useState, useEffect } from "react";
import "./dashboard.css";
import apiClient from "../spotify"; // Assuming you have an API client for Spotify

function Dashboard() {
  const [filter, setFilter] = useState("tracks"); // Default filter to tracks
  const [username, setUsername] = useState("User"); // Placeholder username
  const [profileImage, setProfileImage] = useState(
    "https://picsum.photos/id/237/200/300" // Placeholder image
  );

  useEffect(() => {
    // Fetch user data from Spotify
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("me");
        setUsername(response.data.display_name || "User"); // Update username
        setProfileImage(response.data.images?.[0]?.url || profileImage); // Update profile image
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="screen-container dashboard-container">
      {/* Profile Section */}
      <div className="dashboard-header">
        <img
          src={profileImage}
          alt="Profile"
          className="dashboard-profile-img"
        />
        <h1 className="dashboard-title">{username}'s Dashboard</h1>
      </div>

      {/* Filters Section */}
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

      {/* Favorites Section */}
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