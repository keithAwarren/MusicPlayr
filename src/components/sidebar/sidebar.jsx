import SidebarButton from "./sidebarButton";
import { IoHomeSharp } from "react-icons/io5";
import { BsMusicPlayerFill } from "react-icons/bs";
import { PiPlaylistFill } from "react-icons/pi";
import { SlLogin } from "react-icons/sl";
import { useState, useEffect } from "react";
import apiClient from "../../spotify";
import "./sidebar.css";

function Sidebar() {

    // State variable for URL of user's profile IMG
    const [image, setImage] = useState(
        "https://picsum.photos/id/237/200/300" // Default IMG
    );

    const handleLogout = () => {
        window.localStorage.removeItem("token"); // Remove token from storage
        window.location.href = "/"; // Redirecrt to home
    }

    useEffect(() => {
        // Get request to Spotify API for user profile data
        apiClient.get("me").then((response) => {
            setImage(response.data.images[0].url); // Extract profile IMG URL and update State
        });
    }, []);

    return (
        <>
            <div className="sidebar-container">
                <img
                    src={image}
                    className="profile-img"
                />
            <div>
                <SidebarButton title="Home" to="/" icon={<IoHomeSharp />}/>
                <SidebarButton title="Player" to="/player" icon={<BsMusicPlayerFill />}/>
                <SidebarButton title="Playlists" to="/playlists" icon={<PiPlaylistFill />}/>
            </div>
            <SidebarButton title="Log Out" icon={<SlLogin />} onClick={handleLogout} />
            </div>
        </>
    )
}

export default Sidebar