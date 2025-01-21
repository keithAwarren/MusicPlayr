import React, { useState, useEffect } from "react";
import "./dashboard.css";
import axios from "axios";
import apiClient from "../spotify";

function Dashboard() {
  const [username, setUsername] = useState("User");
  const [profileImage, setProfileImage] = useState(
    "https://picsum.photos/id/237/200/300"
  );
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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

  const fetchRecentlyPlayed = async () => {
    try {
      const accessToken = localStorage.getItem("spotify_access_token");
      const response = await axios.get(
        "http://localhost:8080/api/analytics/recently-played",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setRecentlyPlayed(response.data);
    } catch (error) {
      console.error("Error fetching recently played tracks:", error);
    }
  };

  const fetchTopTracks = async () => {
    try {
      const accessToken = localStorage.getItem("spotify_access_token");
      const response = await axios.get(
        "http://localhost:8080/api/analytics/top-tracks",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setTopTracks(response.data);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
  };

  const fetchTopArtists = async () => {
    try {
      const accessToken = localStorage.getItem("spotify_access_token");
      const response = await axios.get(
        "http://localhost:8080/api/analytics/top-artists",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setTopArtists(response.data);
    } catch (error) {
      console.error("Error fetching top artists:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

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

  return (
    <div className="screen-container">
      {/* Profile Section */}
      <div className="dashboard-header">
        <img
          src={profileImage}
          alt="Profile"
          className="dashboard-profile-img"
        />
        <h1 className="dashboard-title">{username}'s Dashboard</h1>
      </div>

      {/* Widgets */}
      <div className="widgets-container">
        <div className="widget-card">
          <h4>Recently Played</h4>
          <button onClick={fetchRecentlyPlayed} className="widget-button">
            Refresh
          </button>
          <ul>
            {recentlyPlayed.map((track) => (
              <li key={track.track.id}>
                <img src={track.track.album.images[0].url} alt={track.track.name} />
                <p>{track.track.name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="widget-card">
          <h4>Top Tracks</h4>
          <button onClick={fetchTopTracks} className="widget-button">
            Refresh
          </button>
          <ul>
            {topTracks.map((track) => (
              <li key={track.id}>
                <img src={track.album.images[0].url} alt={track.name} />
                <p>{track.name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="widget-card">
          <h4>Top Artists</h4>
          <button onClick={fetchTopArtists} className="widget-button">
            Refresh
          </button>
          <ul>
            {topArtists.map((artist) => (
              <li key={artist.id}>
                <img src={artist.images[0].url} alt={artist.name} />
                <p>{artist.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;