import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../spotify";
import "./playlists.css";

function Playlists() {
    
    // State to hold playlists data
    const [playlists, setPlaylists] = useState(null);

    useEffect(() => {
        // Fetch user's playlists from Spotify API
        apiClient.get("me/playlists").then(function (response) {
            // Update state with the playlists
            setPlaylists(response.data.items);
            console.log(response.data.items);
        });
    }, []); // Empty dependency array ensures this runs once upon mounting component

    const navigate = useNavigate();

    // Navigate to the /player route and pass the playlist ID as part of the state
    const playPlaylist = (id) => {
        navigate("/player", { state: { id: id } });
    };

    return (
        <div className="screen-container">
            <div className="library-body">
                {/* Map through playlists and display each as a card */}
                {playlists?.map((playlist) => (
                    <div 
                        className="playlist-card"
                        key={playlist.id}
                        onClick={() => playPlaylist(playlist.id)}
                    >
                        <img
                            src={playlist.images?.[0]?.url}
                            className="playlist-image" 
                        />
                        <p className="playlist-title">{playlist.name}</p>
                        {/* Number of songs in playlist */}
                        <p className="playlist-subtitle">{playlist.tracks.total} Song(s)</p>
                        <div className="playlist-select">
                            <p>Select Playlist</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Playlists;