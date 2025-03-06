import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
  const [token, setToken] = useState(localStorage.getItem("spotify_access_token") || "");
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("spotify_refresh_token") || "");
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Handle "code" received from Spotify first
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      console.log("Received code from Spotify:", code);
      window.location.replace(`https://playrbackend.onrender.com/auth/callback?code=${code}`);
      return;
    }
  }, []);

  // Extract and store tokens
  useEffect(() => {
    const hash = window.location.hash;
    console.log("Raw URL hash:", hash);

    if (hash.startsWith("#")) {
      const query = new URLSearchParams(hash.substring(1)); // Remove #
      const accessToken = query.get("access_token");
      const refreshTokenFromUrl = query.get("refresh_token");
      const jwtToken = query.get("jwt");

      console.log("Parsed accessToken:", accessToken);
      console.log("Parsed refreshToken:", refreshTokenFromUrl);
      console.log("Parsed JWT:", jwtToken);

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
    }, 3500 * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, isLoading]);

  console.log("Rendering with token:", token);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="main-body">
        {token && location.pathname !== "/login" && <Sidebar />}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/player" element={<Player />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Index;