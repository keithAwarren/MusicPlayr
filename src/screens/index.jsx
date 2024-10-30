import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "../components/sidebar/sidebar";
import Playlists from "./Playlists";
import Player from "./player";
import Login from "./login";
import { useEffect, useState } from "react";
import { setClientToken } from "../spotify";

function Index() {
  const [token, setToken] = useState(""); // State variable to hold the auth token

  useEffect(() => {
    const token = window.localStorage.getItem("spotify_access_token"); // Get token from local storage
    const hash = window.location.hash; // Get URL hash containing Spotify token
    window.location.hash = ""; // Clear hash from the URL

    if (!token && hash) {
      // Extract token using URLSearchParams for robustness
      const params = new URLSearchParams(hash.substring(1));
      const _token = params.get("access_token");

      window.localStorage.setItem("spotify_access_token", _token); // Save token in local storage
      setToken(_token); // Update the state with new token
      setClientToken(_token); // Set token for the API client
    } else if (token) {
      // If there is already a token in local storage
      setToken(token); // Update the state with the token
      setClientToken(token); // Set the token for the API client
    }
  }, []);

  // Render Login component if there's no token, otherwise render the main App
  return !token ? (
    <Login /> // Render the Login component if user is not authenticated
  ) : (
    <Router>
      <div className="main-body">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/playlists" />} />{" "}
          {/* Redirect root to /playlists */}
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/player" element={<Player />} />
          <Route path="*" element={<Navigate to="/playlists" />} />{" "}
          {/* Redirect any undefined routes to /playlists */}
        </Routes>
      </div>
    </Router>
  );
}

export default Index;