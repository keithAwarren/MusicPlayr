import { useEffect, useState } from "react";
import apiClient from "../spotify"
import "./playlists.css"

function Playlists() {
    // State to hold playlists data
    const [playlists, setPlaylists] = useState(null);

    useEffect(() => {
        // Fetch usere's playlists from Spotify API
        apiClient.get("me/playlists").then(function (response) {
            // Update state with the playlists
            setPlaylists(response.data.items);
            console.log(response.data.items);
        });
    }, []); // Empty dependency array ensures this runs once upon mounting component

    return (
        <div className="screen-container">
            <div className="library-body">
                {/* Map througfh playlists and display each as a card */}
                {playlists?.map((playlist) => (
                    <div className="playlist-card">{playlist.name}
                        <img
                            src={playlist.images[0].url}
                            className="playlist-image" 
                        />
                        <p>{playlist.name}</p>
                        {/* Number of songs in playlist */}
                        <p className="playlist-text">{playlist.tracks.total} Songs</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Playlists