import React, { useState, useEffect } from "react";
import "./dashboard.css";
import axios from "axios";
import apiClient from "../spotify";

function Dashboard() {
  const [username, setUsername] = useState("User");
  const [profileImage, setProfileImage] = useState(
    "https://picsum.photos/id/237/200/300"
  );
  const [favoritedTracks, setFavoritedTracks] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("me");
        setUsername(response.data.display_name || "User");
        setProfileImage(response.data.images?.[0]?.url || profileImage);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const toggleFavorites = async () => {
    if (showFavorites) {
      setShowFavorites(false);
    } else {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/favorites/track"
        );
        setFavoritedTracks(response.data);
        setShowFavorites(true);
      } catch (error) {
        console.error("Error fetching favorited tracks:", error);
      }
    }
  };

  const toggleRecentlyPlayed = async () => {
    if (showRecentlyPlayed) {
      setShowRecentlyPlayed(false);
    } else {
      try {
        const accessToken = localStorage.getItem("spotify_access_token");
        if (!accessToken) {
          throw new Error("Access token is missing.");
        }

        const response = await axios.get(
          "http://localhost:8080/api/analytics/recently-played",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const items = response.data || [];
        if (items.length === 0) {
          console.warn("No recently played tracks found.");
          setRecentlyPlayed([]);
          setShowRecentlyPlayed(true);
          return;
        }

        const tracks = items.map((item) => ({
          id: item.track?.id || item.played_at,
          name: item.track?.name || "Unknown Song",
          album: item.track?.album?.images?.[0]?.url || null,
          artists: item.track?.artists
            ?.map((artist) => artist.name)
            .join(", ") || "Unknown Artist",
          playedAt: new Date(item.played_at).toLocaleString(),
        }));

        setRecentlyPlayed(tracks);
        setShowRecentlyPlayed(true);
      } catch (error) {
        console.error("Error fetching recently played tracks:", error);
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const accessToken = localStorage.getItem("spotify_access_token");
      const response = await axios.get("http://localhost:8080/api/search", {
        params: { q: searchTerm, type: "track,artist,album", limit: 50 },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSearchResults(response.data.tracks?.items || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="screen-container dashboard-container">
      <div className="dashboard-header">
        <img
          src={profileImage}
          alt="Profile"
          className="dashboard-profile-img"
        />
        <h1 className="dashboard-title">{username}'s Dashboard</h1>
      </div>

      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for tracks, artists, or albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
          {isSearching && (
            <button
              type="button"
              onClick={clearSearch}
              className="clear-search-button"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {isSearching && (
        <div className="search-results scrollable-container">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div key={result.id} className="search-result-item">
                <img
                  src={
                    result.album?.images[0]?.url ||
                    "https://via.placeholder.com/150"
                  }
                  alt={result.name}
                  className="search-result-img"
                />
                <div className="search-result-info">
                  <p className="search-result-title">{result.name}</p>
                  <p className="search-result-subtitle">
                    {result.artists?.map((artist) => artist.name).join(", ")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No results found for "{searchTerm}".</p>
          )}
        </div>
      )}

      <div className="filters">
        <button onClick={toggleFavorites}>
          {showFavorites ? "Hide Favorited Tracks" : "Show Favorited Tracks"}
        </button>
        <button onClick={toggleRecentlyPlayed}>
          {showRecentlyPlayed
            ? "Hide Recently Played Tracks"
            : "Show Recently Played Tracks"}
        </button>
      </div>

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

      {showRecentlyPlayed && (
        <div className="recently-played-list">
          {recentlyPlayed.length > 0 ? (
            recentlyPlayed.map((track) => (
              <div key={track.id} className="recently-played-item">
                <img
                  src={track.album || "https://via.placeholder.com/150"}
                  alt={track.name}
                  className="recently-played-img"
                />
                <div>
                  <p className="track-name">{track.name}</p>
                  <p className="track-artists">{track.artists}</p>
                  <p className="played-at">Played At: {track.playedAt}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No recently played tracks available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;