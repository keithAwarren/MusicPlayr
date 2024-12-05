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
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [isSearching, setIsSearching] = useState(false); // Toggle to show/hide search results

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

  // Toggle visibility of favorited tracks
  const toggleFavorites = async () => {
    if (showFavorites) {
      setShowFavorites(false); // Hide favorited tracks
    } else {
      try {
        const response = await axios.get("http://localhost:8080/api/favorites/track");
        setFavoritedTracks(response.data); // Update the favorited tracks state
        setShowFavorites(true); // Show the favorited tracks section
      } catch (error) {
        console.error("Error fetching favorited tracks:", error);
      }
    }
  };

  // Handle search functionality
  const handleSearch = async () => {
    if (!searchTerm) return;
    setIsSearching(true); // Show search results
    try {
      const response = await apiClient.get(`/search`, {
        params: {
          q: searchTerm,
          type: "track,artist,album",
          limit: 10,
        },
      });
      setSearchResults(response.data.tracks?.items || []); // Use tracks as default
    } catch (error) {
      console.error("Error fetching search results:", error);
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

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for tracks, artists, or albums..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Search Results Section */}
      {isSearching && (
        <div className="search-results">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div key={result.id} className="search-result-item">
                <img src={result.album?.images[0]?.url} alt={result.name} />
                <div>
                  <p>{result.name}</p>
                  <p>{result.artists?.[0]?.name}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}

      {/* Favorited Tracks Toggle Button */}
      <div className="filters">
        <button onClick={toggleFavorites}>
          {showFavorites ? "Hide Favorited Tracks" : "Show Favorited Tracks"}
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