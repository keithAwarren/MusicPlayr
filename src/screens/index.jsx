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

function Index() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const hash = window.location.hash; // Get the URL hash (e.g., #access_token=...&user_id=...)
    const storedToken = localStorage.getItem("spotify_access_token");
    const storedUserId = localStorage.getItem("userId");

    if (!storedToken && !storedUserId && hash) {
      const query = new URLSearchParams(hash.substring(1)); // Parse the hash (removing #)
      const accessToken = query.get("access_token");
      const user_id = query.get("user_id");

      console.log("Access Token from URL:", accessToken);
      console.log("User ID from URL:", user_id);

      if (accessToken) {
        // Save the token to localStorage and state
        localStorage.setItem("spotify_access_token", accessToken);
        setToken(accessToken);
        setClientToken(accessToken);
      }

      if (user_id) {
        // Save the userId to localStorage and state
        localStorage.setItem("userId", user_id);
        setUserId(user_id);
      }

      // Redirect to the /playlists route and clean the URL
      //window.history.replaceState(null, null, "/MusicPlayr/playlists");
    } else {
      // If tokens are already stored, use them
      if (storedToken) {
        setToken(storedToken);
        setClientToken(storedToken);
      }
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);

  console.log("Rendering with token:", token, "and userId:", userId);

  return !token ? (
    <Login /> // Show the login screen if no token is found
  ) : (
    <Router>
      <div className="main-body">
        <Sidebar userId={userId} />
        <Routes>
          <Route path="/MusicPlayr/" element={<Navigate to="MusicPlayr/playlists" />} />
          <Route path="/MusicPlayr/playlists" element={<Playlists userId={userId} />} />
          <Route path="MusicPlayr/player" element={<Player userId={userId} />} />
          <Route path="MusicPlayr/dashboard" element={<Dashboard userId={userId} />} />
          <Route path="*" element={<Navigate to="/MusicPlayr/playlists" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Index;