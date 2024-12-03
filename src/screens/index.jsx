import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "../components/sidebar/sidebar";
import Dashboard from "./dashboard";
import Playlists from "./Playlists";
import Player from "./player";
import Login from "./login";
import { useEffect, useState } from "react";
import { setClientToken } from "../spotify";
import axios from "axios";

function Index() {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    console.log("Raw URL hash:", hash);

    if (hash) {
      const query = new URLSearchParams(hash.substring(1));
      const accessToken = query.get("access_token");
      const refreshTokenFromUrl = query.get("refresh_token");

      console.log("Parsed accessToken:", accessToken);
      console.log("Parsed refreshToken:", refreshTokenFromUrl);

      if (accessToken) {
        localStorage.setItem("spotify_access_token", accessToken);
        setToken(accessToken);
        setClientToken(accessToken);
      }

      if (refreshTokenFromUrl) {
        localStorage.setItem("spotify_refresh_token", refreshTokenFromUrl);
        setRefreshToken(refreshTokenFromUrl);
      }

      // Clear the hash from the URL
      window.history.replaceState(null, null, "/MusicPlayr/dashboard");
    } else {
      // Use stored values if hash is not present
      const storedToken = localStorage.getItem("spotify_access_token");
      const storedRefreshToken = localStorage.getItem("spotify_refresh_token");

      if (storedToken) {
        setToken(storedToken);
        setClientToken(storedToken);
      }

      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }
    }
  }, []);

  // Automatically refresh token when it expires
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await axios.post("http://localhost:8080/auth/refresh", {
          refresh_token: refreshToken,
        });
        const { access_token } = response.data;

        console.log("New access token:", access_token);

        if (access_token) {
          localStorage.setItem("spotify_access_token", access_token);
          setToken(access_token);
          setClientToken(access_token);
        }
      } catch (error) {
        console.error("Error refreshing access token:", error);
      }
    };

    if (refreshToken) {
      const interval = setInterval(() => {
        console.log("Refreshing access token...");
        refreshAccessToken();
      }, 3500 * 1000); // Refresh every 3500 seconds (slightly before token expiration).

      return () => clearInterval(interval); // Clean up interval on component unmount.
    }
  }, [refreshToken]);

  console.log("Rendering with token:", token);

  return !token ? (
    <Login /> // Show the login screen if no token is found
  ) : (
    <Router>
      <div className="main-body">
        <Sidebar />
        <Routes>
          <Route path="/MusicPlayr/" element={<Navigate to="/MusicPlayr/login" />} />
          <Route path="/MusicPlayr/playlists" element={<Playlists />} />
          <Route path="MusicPlayr/player" element={<Player />} />
          <Route path="MusicPlayr/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/MusicPlayr/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Index;