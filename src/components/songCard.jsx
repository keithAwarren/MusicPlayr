import "../screens/player.css";
import AlbumImage from "./albumImage";
import AlbumInfo from "./albumInfo";
import { useState, useEffect } from "react";
import axios from "axios";

function SongCard({ track, userId }) {
    console.log("SongCard received props:", { track, userId }); // Debugging log to check props

    const [isFavorited, setIsFavorited] = useState(false);

    // Check if the track is already favorited when the component mounts or track/userId changes
    useEffect(() => {
        const checkIfFavorited = async () => {
            if (!track?.id || !userId) return;

            try {
                const response = await axios.get(`http://localhost:8080/api/favorites/${userId}/track/${track.id}`);
                setIsFavorited(response.data.isFavorite);
            } catch (error) {
                console.error("Error checking favorite status:", error);
            }
        };

        // Reset favorite status and re-check on track/userId change
        setIsFavorited(false);
        if (track) checkIfFavorited();
    }, [track, userId]);

    // Handle adding the track to favorites
    const handleFavoriteClick = async () => {
        try {
            await axios.post("http://localhost:8080/api/favorites", {
                userId,
                itemType: "track",
                itemId: track.id,
                itemName: track.name,
                itemArtist: track.artists[0].name,
            });
            setIsFavorited(true);
        } catch (error) {
            console.error("Error adding favorite:", error);
        }
    };

    // Only render if track and album data are available
    if (!track || !track.album) return null;

    return (
        <div className="songCard-body flex">
            <AlbumImage url={track.album.images[0].url || "https://via.placeholder.com/150"} />
            <AlbumInfo album={track.album} />
            <button onClick={handleFavoriteClick} disabled={isFavorited} className="favorite-button">
                {isFavorited ? "Favorited" : "Add to Favorites"}
            </button>
        </div>
    );
}

export default SongCard;