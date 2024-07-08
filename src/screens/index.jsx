// Imports
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "../components/sidebar/sidebar";
import Playlists from "./Playlists";
import Player from "./player";
import Home from "./home";
import Login from "./login";
import "./home.css";
import { useEffect, useState } from "react";
import { setClientToken } from "../spotify";

function Index() {
    // State variable to hold the auth token
    const [token, setToken] = useState("");

    useEffect(() => {
        const token = window.localStorage.getItem("token") // Get token from local storage
        const hash = window.location.hash; // Get URL hash containing Spotify token
        window.location.hash = ""; // Clear hash from the URL

        if (!token && hash) {
            const _token = hash.split("&")[0].split("=")[1]; // Extract token from the hash
            window.localStorage.setItem("token", _token); // Save token in local storage
            setToken(_token); // Update the state with new token
            setClientToken(_token); // Set token for the API client
        } else {
            // If there is already a token in local storage
            setToken(token); // Update the state with the token
            setClientToken(token); // Set the token for the API client
        }
    }, []);

    // Render Login component if there's no token, otherwise render the main App
    return !token ? (
        <Login /> // Render the Login componenet if user is not authenticated
    ) : (
        <Router>
            <div className="main-body">
                <Sidebar />
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/playlists" element={<Playlists/>}/>
                    <Route path="/player" element={<Player />}/>
                </Routes>
            </div>
        </Router>
    )
}

export default Index