import {
  HashRouter as Router,
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let hash = window.location.hash;
    console.log("Raw URL hash:", hash);

    if (hash.startsWith("#")) {
      hash = hash.substring(1); // Remove #
    }

    const query = new URLSearchParams(hash);
    const accessToken = query.get("access_token");
    const refreshTokenFromUrl = query.get("refresh_token");
    const jwtToken = query.get("jwt");

    console.log("Parsed accessToken:", accessToken);
    console.log("Parsed refreshToken:", refreshTokenFromUrl);
    console.log("Parsed JWT:", jwtToken);

    // Ensure tokens are stored before redirecting
    if (accessToken && jwtToken) {
      try {
        localStorage.setItem("spotify_access_token", accessToken);
        localStorage.setItem("jwt_token", jwtToken);
        setToken(accessToken);
        setClientToken(accessToken);

        if (refreshTokenFromUrl) {
          localStorage.setItem("spotify_refresh_token", refreshTokenFromUrl);
          setRefreshToken(refreshTokenFromUrl);
        }

        // Wait before redirecting to avoid race conditions
        setTimeout(() => {
          window.location.replace("https://playrofficial.netlify.app/#/dashboard");
        }, 100);
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    } else {
      console.error("Missing tokens, staying on login page.");
      setIsLoading(false);
      return;
    }
  }, []);

  // Automatically refresh access token when it expires
  useEffect(() => {
    if (!refreshToken || isLoading) return;

    const refreshAccessToken = async () => {
      const jwtToken = localStorage.getItem("jwt_token");

      if (!jwtToken) {
        console.error("Missing JWT token, cannot refresh access token.");
        return;
      }

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
          window.location.replace("https://playrofficial.netlify.app/#/login");
        }
      }
    };

    const interval = setInterval(() => {
      console.log("Refreshing access token...");
      refreshAccessToken();
    }, 3500 * 1000); // Refresh every 3500 seconds (slightly before token expiration)

    return () => clearInterval(interval); // Cleanup on unmount
  }, [refreshToken, isLoading]);

  console.log("Rendering with token:", token);

  if (isLoading) {
    return <div>Loading...</div>; // Prevents UI flickering while processing tokens
  }

  return !token ? (
    <Login />
  ) : (
    <Router>
      <div className="main-body">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
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