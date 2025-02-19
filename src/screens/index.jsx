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
    const queryString = window.location.search;
    console.log("Raw URL query string:", queryString);

    if (queryString) {
      const query = new URLSearchParams(queryString);
      const accessToken = query.get("access_token");
      const refreshTokenFromUrl = query.get("refresh_token");
      const jwtToken = query.get("jwt");

      console.log("Parsed accessToken:", accessToken);
      console.log("Parsed refreshToken:", refreshTokenFromUrl);
      console.log("Parsed JWT:", jwtToken);

      if (accessToken && jwtToken) {
        localStorage.setItem("spotify_access_token", accessToken);
        localStorage.setItem("jwt_token", jwtToken);
        setToken(accessToken);
        setClientToken(accessToken);
      } else {
        console.error("Missing tokens, not redirecting");
      }

      if (refreshTokenFromUrl) {
        localStorage.setItem("spotify_refresh_token", refreshTokenFromUrl);
        setRefreshToken(refreshTokenFromUrl);
      }

      // Remove query parameters after extraction
      window.history.replaceState(null, null, "./dashboard");
    } else {
      // Retrieve stored values
      const storedToken = localStorage.getItem("spotify_access_token");
      const storedJwtToken = localStorage.getItem("jwt_token");

      if (storedToken && storedJwtToken) {
        setToken(storedToken);
        setClientToken(storedToken);
      } else {
        console.error("Stored tokens missing or invalid, redirecting to login");
        window.location.href = "/MusicPlayr/login";
      }
    }
  }, []);

  // Automatically refresh the access token when it expires
  useEffect(() => {
    const refreshAccessToken = async () => {
      const jwtToken = localStorage.getItem("jwt_token");

      try {
        const response = await axios.post(
          "https://playrbackend.onrender.com/auth/refresh",
          { refresh_token: refreshToken },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
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
    <Login />
  ) : (
    <Router>
      <div className="main-body">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/player" element={<Player />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Index;