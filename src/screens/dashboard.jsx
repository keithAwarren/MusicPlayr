import React, { useState, useEffect } from "react";
import "./dashboard.css";
import axios from "axios"; // Import axios for making API requests
import apiClient from "../spotify"; // Assuming you have an API client for Spotify

function Dashboard() {
  const [username, setUsername] = useState("User"); // Placeholder username
  const [profileImage, setProfileImage] = useState(
    "https://picsum.photos/id/237/200/300" // Placeholder image
  );
  const [favoritedTracks, setFavoritedTracks] = useState([]); // State to hold favorited tracks
  const [showFavorites, setShowFavorites] = useState(false); // Toggle to show/hide favorited tracks

  // Fetch user data from Spotify
  useEffect(() => {
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

  // Fetch favorited tracks from the backend
  const fetchFavoritedTracks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/favorites/track"); // Adjust the endpoint if needed
      setFavoritedTracks(response.data); // Update the favorited tracks state
      setShowFavorites(true); // Show the favorited tracks section
    } catch (error) {
      console.error("Error fetching favorited tracks:", error);
    }
  };

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

      {/* Favorited Tracks Button */}
      <div className="filters">
        <button onClick={fetchFavoritedTracks}>
          Show Favorited Tracks
        </button>
      </div>

      {/* Favorited Tracks Section */}
      {showFavorites && (
        <div className="favorites-list">
          {favoritedTracks.length > 0 ? (
            favoritedTracks.map((track) => (
              <div key={track.item_id} className="favorite-item">
                <h3>{track.item_name}</h3>
                <p>by {track.item_artist}</p>
              </div>
            ))
          ) : (
            <p>No favorited tracks found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;