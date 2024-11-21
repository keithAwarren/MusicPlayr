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

  useEffect(() => {
    // Get the URL hash (e.g., #access_token=...)
    const hash = window.location.hash;
    console.log("Raw URL hash:", hash);

    if (hash) {
      // Parse the hash (remove the '#' and extract parameters)
      const query = new URLSearchParams(hash.substring(1));
      const accessToken = query.get("access_token");

      console.log("Parsed accessToken:", accessToken);

      if (accessToken) {
        localStorage.setItem("spotify_access_token", accessToken);
        setToken(accessToken);
        setClientToken(accessToken);
      }

      // Clear the hash to prevent re-parsing on refresh
      window.history.replaceState(null, null, "/MusicPlayr/dashboard");
    } else {
      // Use stored token if hash is not present
      const storedToken = localStorage.getItem("spotify_access_token");

      if (storedToken) {
        setToken(storedToken);
        setClientToken(storedToken);
      }
    }
  }, []);

  console.log("Rendering with token:", token);

  return !token ? (
    <Login /> // Show the login screen if no token is found
  ) : (
    <Router>
      <div className="main-body">
        <Sidebar />
        <Routes>
          <Route
            path="/MusicPlayr/"
            element={<Navigate to="MusicPlayr/login" />}
          />
          <Route
            path="/MusicPlayr/playlists"
            element={<Playlists />}
          />
          <Route
            path="MusicPlayr/player"
            element={<Player />}
          />
          <Route
            path="MusicPlayr/dashboard"
            element={<Dashboard />}
          />
          <Route path="*" element={<Navigate to="/MusicPlayr/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Index;