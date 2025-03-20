import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import axios from "axios";
import apiClient from "../spotify";

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [profileImage, setProfileImage] = useState("https://picsum.photos/id/237/200/300");
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  // Get JWT token from local storage
  const jwtToken = localStorage.getItem("jwt_token");

  useEffect(() => {
    if (!jwtToken) {
      console.error("No JWT token found, redirecting to login...");
      navigate("/login"); // Redirect to login if no token
      return;
    }

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
    fetchRecentlyPlayed();
    fetchTopTracks();
    fetchTopArtists();
  }, []);

  // Helper function to make authorized API requests
  const makeAuthorizedRequest = async (endpoint, setterFunction) => {
    try {
      const response = await axios.get(`https://playrbackend.onrender.com/api/analytics/${endpoint}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setterFunction(response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      if (error.response?.status === 401) {
        console.error("Unauthorized - clearing tokens and redirecting to login");
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("spotify_refresh_token");
        navigate("/login");
      }
    }
  };

  const fetchRecentlyPlayed = () => makeAuthorizedRequest("recently-played", setRecentlyPlayed);
  const fetchTopTracks = () => makeAuthorizedRequest("top-tracks", setTopTracks);
  const fetchTopArtists = () => makeAuthorizedRequest("top-artists", setTopArtists);

  const playTrack = (trackUri) => {
    navigate("/MusicPlayr/player", { state: { uri: trackUri } });
  };

  return (
    <div className="screen-container">
      {/* Profile Section */}
      <div className="dashboard-header">
        <img src={profileImage} alt="Profile" className="dashboard-profile-img" />
        <h1 className="dashboard-title">{username}'s Dashboard</h1>
      </div>

      {/* Widgets */}
      <div className="widgets-container">
        {/* Recently Played */}
        <div className="widget-card">
          <div className="widget-header">
            <h4>Recently Played</h4>
            <button onClick={fetchRecentlyPlayed} className="widget-button">Refresh</button>
          </div>
          <div className="widget-content">
            <ul>
              {recentlyPlayed.length > 0 ? (
                recentlyPlayed.map((track) => (
                  <li key={track.track.id} onClick={() => playTrack(track.track.uri)}>
                    <img src={track.track.album.images[0].url} alt={track.track.name} />
                    <span className="track-info">
                      <p className="track-title">{track.track.name}</p>
                      <p className="track-artist">{track.track.artists.map(artist => artist.name).join(", ")}</p>
                    </span>
                  </li>
                ))
              ) : (
                <p>No recent tracks available.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Top Tracks */}
        <div className="widget-card">
          <div className="widget-header">
            <h4>Top Tracks</h4>
            <button onClick={fetchTopTracks} className="widget-button">Refresh</button>
          </div>
          <div className="widget-content">
            <ul>
              {topTracks.length > 0 ? (
                topTracks.map((track) => (
                  <li key={track.id} onClick={() => playTrack(track.uri)}>
                    <img src={track.album.images[0].url} alt={track.name} />
                    <span className="track-info">
                      <p className="track-title">{track.name}</p>
                      <p className="track-artist">{track.artists.map(artist => artist.name).join(", ")}</p>
                    </span>
                  </li>
                ))
              ) : (
                <p>No top tracks available.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Top Artists */}
        <div className="widget-card">
          <div className="widget-header">
            <h4>Top Artists</h4>
            <button onClick={fetchTopArtists} className="widget-button">Refresh</button>
          </div>
          <div className="widget-content">
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
    </div>
  );
}

export default Dashboard;