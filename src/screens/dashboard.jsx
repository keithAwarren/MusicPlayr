import React, { useState, useEffect } from "react";
import "./dashboard.css";
import axios from "axios";
import apiClient from "../spotify";
import RecentlyPlayed from "../components/recentlyPlayed";
import TopArtistsTracks from "../components/topArtistsTracks";

function Dashboard() {
  const [username, setUsername] = useState("User");
  const [profileImage, setProfileImage] = useState(
    "https://picsum.photos/id/237/200/300"
  );
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(false);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [showTopContent, setShowTopContent] = useState(false);

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
      setShowRecentlyPlayed(true);
    } catch (error) {
      console.error("Error fetching recently played tracks:", error);
    }
  };

  const fetchTopTracksAndArtists = async () => {
    try {
      const accessToken = localStorage.getItem("spotify_access_token");

      const [tracksResponse, artistsResponse] = await Promise.all([
        axios.get("http://localhost:8080/api/analytics/top-tracks", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get("http://localhost:8080/api/analytics/top-artists", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);

      setTopTracks(tracksResponse.data);
      setTopArtists(artistsResponse.data);
      setShowTopContent(true);
    } catch (error) {
      console.error("Error fetching top tracks and artists:", error);
    }
  };

  return (
    <div className="screen-container">
      {/* Profile Header */}
      <div className="dashboard-header">
        <img
          src={profileImage}
          alt="Profile"
          className="dashboard-profile-img"
        />
        <h1 className="dashboard-title">{username}'s Dashboard</h1>
      </div>

      {/* Filters for Recently Played and Top Tracks & Artists */}
      {!showRecentlyPlayed && !showTopContent && (
        <div className="filters">
          <button onClick={fetchRecentlyPlayed}>Show Recently Played</button>
          <button onClick={fetchTopTracksAndArtists}>
            Show Top Tracks & Artists
          </button>
        </div>
      )}

      {/* Recently Played Component */}
      {showRecentlyPlayed && (
        <RecentlyPlayed
          tracks={recentlyPlayed}
          onToggle={() => setShowRecentlyPlayed(false)}
        />
      )}

      {/* Top Artists & Tracks Component */}
      {showTopContent && (
        <TopArtistsTracks
          tracks={topTracks}
          artists={topArtists}
          onToggle={() => setShowTopContent(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;