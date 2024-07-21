import SidebarButton from "./sidebarButton";
import { BsMusicPlayerFill } from "react-icons/bs";
import { PiPlaylistFill } from "react-icons/pi";
import { SlLogin } from "react-icons/sl";
import { useState, useEffect } from "react";
import apiClient from "../../spotify";
import "./sidebar.css";

function Sidebar() {

    // State variables for URL of user's profile IMG and username
    const [image, setImage] = useState(
        "https://picsum.photos/id/237/200/300" // Default IMG
    );
    const [username, setUsername] = useState(""); // State variable for username

    const handleLogout = () => {
        window.localStorage.removeItem("token"); // Remove token from storage
        window.location.href = "/"; // Redirect to home
    }

    useEffect(() => {
        // Get request to Spotify API for user profile data
        apiClient.get("me").then((response) => {
            setImage(response.data.images[0].url); // Extract profile IMG URL and update State
            setUsername(response.data.display_name); // Extract username and update State
        });
    }, []);

    return (
        <>
            <div className="sidebar-container">
                <img
                    src={image}
                    className="profile-img"
                    alt="Profile"
                />
                <div className="welcome-text">
                    Welcome, {username}!
                </div>
                <div>
                    <SidebarButton title="Player" to="/player" icon={<BsMusicPlayerFill />}/>
                    <SidebarButton title="Playlists" to="/playlists" icon={<PiPlaylistFill />}/>
                </div>
                <SidebarButton title="Log Out" icon={<SlLogin />} onClick={handleLogout} />
            </div>
        </>
    )
}

export default Sidebar;
