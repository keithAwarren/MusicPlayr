import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import axios from "axios";
import apiClient from "../spotify";

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [profileImage, setProfileImage] = useState(
    "https://picsum.photos/id/237/200/300"
  );
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [favoritedTracks, setFavoritedTracks] = useState([]);

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
    fetchRecentlyPlayed();
    fetchTopTracks();
    fetchFavoritedTracks();
  }, []);

  const fetchRecentlyPlayed = async () => {
    try {
      const jwtToken = localStorage.getItem("jwt_token");
      const accessToken = localStorage.getItem("spotify_access_token");

      const response = await axios.get(
        "https://playrbackend.onrender.com/api/analytics/recently-played",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "spotify-access-token": accessToken,
          },
        }
      );
      setRecentlyPlayed(response.data);
    } catch (error) {
      console.error("Error fetching recently played tracks:", error);
      if (error.response?.status === 401) {
        console.warn("Unauthorized - clearing tokens and redirecting...");
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const fetchTopTracks = async () => {
    try {
      const jwtToken = localStorage.getItem("jwt_token");
      const accessToken = localStorage.getItem("spotify_access_token");

      const response = await axios.get(
        "https://playrbackend.onrender.com/api/analytics/top-tracks",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "spotify-access-token": accessToken,
          },
        }
      );
      setTopTracks(response.data);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
  };

  const fetchFavoritedTracks = async () => {
    try {
      const jwtToken = localStorage.getItem("jwt_token");
      const accessToken = localStorage.getItem("spotify_access_token");

      const response = await axios.get(
        "https://playrbackend.onrender.com/api/favorites/track",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "spotify-access-token": accessToken,
          },
        }
      );

      const trackPromises = response.data.map(async (fav) => {
        const trackDetails = await apiClient.get(`/tracks/${fav.item_id}`);
        return {
          id: fav.item_id,
          name: trackDetails.data.name,
          uri: trackDetails.data.uri,
          artist: trackDetails.data.artists.map((a) => a.name).join(", "),
          image: trackDetails.data.album.images?.[0]?.url,
        };
      });

      const enrichedTracks = await Promise.all(trackPromises);
      setFavoritedTracks(enrichedTracks);
    } catch (error) {
      console.error("Error fetching favorited tracks:", error);
    }
  };

  const playTrack = (trackUri) => {
    navigate("/player", { state: { uri: trackUri } });
  };

  return (
    <div className="screen-container flex">
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
        {/* Recently Played */}
        <div className="widget-card">
          <div className="widget-header">
            <h4>Recently Played</h4>
            <button onClick={fetchRecentlyPlayed} className="widget-button">
              Refresh
            </button>
          </div>
          <div className="widget-content">
            <ul>
              {recentlyPlayed.length > 0 ? (
                recentlyPlayed.map((track) => (
                  <li
                    key={track.track.id}
                    onClick={() => playTrack(track.track.uri)}
                  >
                    <img
                      src={track.track.album.images[0].url}
                      alt={track.track.name}
                    />
                    <span className="track-info">
                      <p className="track-title">{track.track.name}</p>
                      <p className="track-artist">
                        {track.track.artists.map((artist) => artist.name).join(", ")}
                      </p>
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
            <button onClick={fetchTopTracks} className="widget-button">
              Refresh
            </button>
          </div>
          <div className="widget-content">
            <ul>
              {topTracks.length > 0 ? (
                topTracks.map((track) => (
                  <li key={track.id} onClick={() => playTrack(track.uri)}>
                    <img src={track.album.images[0].url} alt={track.name} />
                    <span className="track-info">
                      <p className="track-title">{track.name}</p>
                      <p className="track-artist">
                        {track.artists.map((artist) => artist.name).join(", ")}
                      </p>
                    </span>
                  </li>
                ))
              ) : (
                <p>No top tracks available.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Favorited Tracks */}
        <div className="widget-card">
          <div className="widget-header">
            <h4>Favorites</h4>
            <button onClick={fetchFavoritedTracks} className="widget-button">
              Refresh
            </button>
          </div>
          <div className="widget-content">
            <ul>
              {favoritedTracks.length > 0 ? (
                favoritedTracks.map((track) => (
                  <li key={track.id} onClick={() => playTrack(track.uri)}>
                    <img src={track.image} alt={track.name} />
                    <span className="track-info">
                      <p className="track-title">{track.name}</p>
                      <p className="track-artist">{track.artist}</p>
                    </span>
                  </li>
                ))
              ) : (
                <p>No favorited tracks available.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;