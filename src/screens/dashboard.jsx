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
  const [topTracks, setTopTracks] = useState([]);
  const [showTopTracks, setShowTopTracks] = useState(false);
  const [topArtists, setTopArtists] = useState([]);
  const [showTopArtists, setShowTopArtists] = useState(false);

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
        const response = await axios.get(
          "http://localhost:8080/api/analytics/recently-played",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (response.data.length > 0) {
          setRecentlyPlayed(response.data);
          setShowRecentlyPlayed(true);
        } else {
          console.log("No recently played tracks found.");
        }
      } catch (error) {
        console.error("Error fetching recently played tracks:", error);
      }
    }
  };

  const toggleTopTracks = async () => {
    if (showTopTracks) {
      setShowTopTracks(false);
    } else {
      try {
        const accessToken = localStorage.getItem("spotify_access_token");
        const response = await axios.get(
          "http://localhost:8080/api/analytics/top-tracks",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setTopTracks(response.data);
        setShowTopTracks(true);
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    }
  };

  const toggleTopArtists = async () => {
    if (showTopArtists) {
      setShowTopArtists(false);
    } else {
      try {
        const accessToken = localStorage.getItem("spotify_access_token");
        const response = await axios.get(
          "http://localhost:8080/api/analytics/top-artists",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setTopArtists(response.data);
        setShowTopArtists(true);
      } catch (error) {
        console.error("Error fetching top artists:", error);
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

      <div className="filters">
        <button onClick={toggleFavorites}>
          {showFavorites ? "Hide Favorited Tracks" : "Show Favorited Tracks"}
        </button>
        <button onClick={toggleRecentlyPlayed}>
          {showRecentlyPlayed
            ? "Hide Recently Played Tracks"
            : "Show Recently Played Tracks"}
        </button>
        <button onClick={toggleTopTracks}>
          {showTopTracks ? "Hide Top Tracks" : "Show Top Tracks"}
        </button>
        <button onClick={toggleTopArtists}>
          {showTopArtists ? "Hide Top Artists" : "Show Top Artists"}
        </button>
      </div>

      {showFavorites && (
        <div className="favorites-list">
          <h2>Favorited Tracks</h2>
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
          <h2>Recently Played Tracks</h2>
          {recentlyPlayed.map((item) => (
            <div key={item.track.id} className="recently-played-item">
              <img
                src={item.track.album?.images[0]?.url || ""}
                alt={item.track.name}
                className="track-img"
              />
              <div>
                <p>{item.track.name}</p>
                <p>by {item.track.artists.map((artist) => artist.name).join(", ")}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showTopTracks && (
        <div className="top-tracks-list">
          <h2>Top Tracks</h2>
          {topTracks.map((track) => (
            <div key={track.id} className="top-track-item">
              <img
                src={track.album?.images[0]?.url || ""}
                alt={track.name}
                className="track-img"
              />
              <div>
                <p>{track.name}</p>
                <p>by {track.artists.map((artist) => artist.name).join(", ")}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showTopArtists && (
        <div className="top-artists-list">
          <h2>Top Artists</h2>
          {topArtists.map((artist) => (
            <div key={artist.id} className="top-artist-item">
              <img
                src={artist.images[0]?.url || ""}
                alt={artist.name}
                className="artist-img"
              />
              <div>
                <p>{artist.name}</p>
                <p>Genres: {artist.genres.join(", ")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;