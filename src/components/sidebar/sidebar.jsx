import SidebarButton from "./sidebarButton";
import { BsMusicPlayerFill } from "react-icons/bs";
import { PiPlaylistFill } from "react-icons/pi";
import { SlLogin } from "react-icons/sl";
import { MdDashboard } from "react-icons/md"; // Import Dashboard icon
import { useState, useEffect } from "react";
import apiClient from "../../spotify";
import "./sidebar.css";

function Sidebar() {
  const [image, setImage] = useState("https://picsum.photos/id/237/200/300");
  const [username, setUsername] = useState("");

  const handleLogout = () => {
    window.localStorage.removeItem("spotify_access_token");
    window.localStorage.removeItem("spotify_refresh_token");
    window.localStorage.removeItem("jwt_token");
    window.location.replace("/#/login");
  };

  useEffect(() => {
    apiClient.get("me").then((response) => {
      setImage(response.data.images[0]?.url || "https://picsum.photos/id/237/200/300");
      setUsername(response.data.display_name || "User");
    });
  }, []);

  return (
    <>
      <div className="sidebar-container">
        <img src={image} className="profile-img" alt="Profile" />
        <div className="welcome-text">Welcome, {username}!</div>
        <div className="mobile-btn flex">
          <SidebarButton title="Dashboard" to="/dashboard" icon={<MdDashboard />} />
          <SidebarButton title="Playlists" to="/playlists" icon={<PiPlaylistFill />} />
          <SidebarButton title="Player" to="/player" icon={<BsMusicPlayerFill />} />
        </div>
        <SidebarButton title="Log Out" icon={<SlLogin />} onClick={handleLogout} />
      </div>
    </>
  );
}

export default Sidebar;