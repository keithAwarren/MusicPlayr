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
      const jwtToken = query.get("jwt");  // Extract JWT token from the URL

      console.log("Parsed accessToken:", accessToken);
      console.log("Parsed refreshToken:", refreshTokenFromUrl);
      console.log("Parsed JWT:", jwtToken);  // Log the JWT for debugging

      if (accessToken) {
        localStorage.setItem("spotify_access_token", accessToken);
        setToken(accessToken);
        setClientToken(accessToken);
      }

      if (refreshTokenFromUrl) {
        localStorage.setItem("spotify_refresh_token", refreshTokenFromUrl);
        setRefreshToken(refreshTokenFromUrl);
      }

      if (jwtToken) {
        localStorage.setItem("jwt_token", jwtToken);  // Store JWT in localStorage
      }

      // Clear the hash from the URL after extracting tokens
      window.history.replaceState(null, null, "/MusicPlayr/dashboard");
    } else {
      // Use stored values if no tokens are in the URL
      const storedToken = localStorage.getItem("spotify_access_token");
      const storedRefreshToken = localStorage.getItem("spotify_refresh_token");
      const storedJwtToken = localStorage.getItem("jwt_token");  // Retrieve stored JWT

      if (storedToken) {
        setToken(storedToken);
        setClientToken(storedToken);
      }

      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }

      if (storedJwtToken) {
        console.log("Retrieved JWT:", storedJwtToken);  // Debug log for JWT retrieval
      }
    }
  }, []);

  // Automatically refresh the access token when it expires
  useEffect(() => {
    const refreshAccessToken = async () => {
      const jwtToken = localStorage.getItem("jwt_token");  // Retrieve JWT token for authorization

      try {
        const response = await axios.post(
          "http://localhost:8080/auth/refresh",
          { refresh_token: refreshToken },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,  // Include JWT in request headers
            },
          }
        );

        const { access_token } = response.data;
        console.log("New access token:", access_token);

        if (access_token) {
          localStorage.setItem("spotify_access_token", access_token);
          setToken(access_token);
          setClientToken(access_token);
        }
      } catch (error) {
        console.error("Error refreshing access token:", error);

        if (error.response && error.response.status === 401) {
          // Clear tokens and redirect to login if JWT is invalid or expired
          localStorage.removeItem("spotify_access_token");
          localStorage.removeItem("spotify_refresh_token");
          localStorage.removeItem("jwt_token");
          setToken("");
          setRefreshToken("");
          window.location.href = "/MusicPlayr/login";
        }
      }
    };

    if (refreshToken) {
      const interval = setInterval(() => {
        console.log("Refreshing access token...");
        refreshAccessToken();
      }, 3500 * 1000); // Refresh every 3500 seconds (slightly before token expiration)

      return () => clearInterval(interval); // Clean up interval on component unmount
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
          <Route path="/MusicPlayr/player" element={<Player />} />
          <Route path="/MusicPlayr/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/MusicPlayr/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Index;