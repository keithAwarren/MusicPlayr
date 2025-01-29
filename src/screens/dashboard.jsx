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

  useEffect(() => {
    fetchUserData();
    fetchRecentlyPlayed();
    fetchTopTracks();
    fetchTopArtists();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get("me");
      setUsername(response.data.display_name || "User");
      setProfileImage(response.data.images?.[0]?.url || profileImage);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
            {recentlyPlayed.length > 0 ? (
              recentlyPlayed.map((track) => (
                <li key={track.track.id}>
                  <img
                    src={track.track.album.images[0].url}
                    alt={track.track.name}
                  />
                  <p>{track.track.name}</p>
                </li>
              ))
            ) : (
              <p>No recent tracks available.</p>
            )}
          </ul>
        </div>

        <div className="widget-card">
          <h4>Top Tracks</h4>
          <button onClick={fetchTopTracks} className="widget-button">
            Refresh
          </button>
          <ul>
            {topTracks.length > 0 ? (
              topTracks.map((track) => (
                <li key={track.id}>
                  <img src={track.album.images[0].url} alt={track.name} />
                  <p>{track.name}</p>
                </li>
              ))
            ) : (
              <p>No top tracks available.</p>
            )}
          </ul>
        </div>

        <div className="widget-card">
          <h4>Top Artists</h4>
          <button onClick={fetchTopArtists} className="widget-button">
            Refresh
          </button>
          <ul>
            {topArtists.length > 0 ? (
              topArtists.map((artist) => (
                <li key={artist.id}>
                  <img src={artist.images[0].url} alt={artist.name} />
                  <p>{artist.name}</p>
                </li>
              ))
            ) : (
              <p>No top artists available.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;