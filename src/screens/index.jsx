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
  const [token, setToken] = useState("");

  useEffect(() => {
    // Check if access_token exists in URL hash
    const hash = window.location.hash;
    const storedToken = localStorage.getItem("spotify_access_token");

    if (!storedToken && hash) {
      const query = new URLSearchParams(hash.substring(1));
      const accessToken = query.get("access_token");

      if (accessToken) {
        // Store token in localStorage and set in state
        localStorage.setItem("spotify_access_token", accessToken);
        setToken(accessToken);
        setClientToken(accessToken);
        window.location.hash = ""; // Clear hash to avoid re-processing
      } else {
        console.error("Access token not found in URL");
      }
    } else if (storedToken) {
      setToken(storedToken);
      setClientToken(storedToken);
    }
  }, []);

  return !token ? (
    <Login /> // Render the Login component if user is not authenticated
  ) : (
    <Router>
      <div className="main-body">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/playlists" />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/player" element={<Player />} />
          <Route path="*" element={<Navigate to="/playlists" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Index;