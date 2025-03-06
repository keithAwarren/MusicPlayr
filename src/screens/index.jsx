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

  // Handle code from Spotify and exchange for tokens
  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");

    if (code) {
      console.log("Received code from Spotify:", code);
      window.location.replace(
        `https://playrbackend.onrender.com/auth/callback?code=${code}`
      );
      return;
    }
  }, []);

  // Extract & store tokens on first load
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
    }
    setIsLoading(false);
  }, []);

  // Ensure stored tokens persist on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");
    const storedJwtToken = localStorage.getItem("jwt_token");
    const storedRefreshToken = localStorage.getItem("spotify_refresh_token");

    if (storedToken && storedJwtToken) {
      setToken(storedToken);
      setClientToken(storedToken);
      setRefreshToken(storedRefreshToken || "");
    } else {
      console.error("Stored tokens missing, redirecting to login.");
      window.location.replace("https://playrofficial.netlify.app/#/login");
    }
    setIsLoading(false);
  }, []);

  // Auto-refresh access token when it expires
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
    }, 3500 * 1000); // Refresh every ~58 minutes

    return () => clearInterval(interval);
  }, [refreshToken, isLoading]);

  console.log("Rendering with token:", token);

  // Prevent UI flickering while checking tokens
  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("Is Dashboard imported?", typeof Dashboard);
  console.log("Is Sidebar imported?", typeof Sidebar);
  console.log("Is Playlists imported?", typeof Playlists);
  console.log("Is Player imported?", typeof Player);
  console.log("Is Login imported?", typeof Login);

  return (
  <>
    {isLoading ? (
      <div>Loading...</div>
    ) : !token ? (
      <Login />
    ) : (
      <Router>
        <div className="main-body">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Navigate to="/dashboard" />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/player" element={<Player />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    )}
  </>
);

}

export default Index;