import "../screens/player.css";
import AlbumImage from "./albumImage";
import AlbumInfo from "./albumInfo";
import { useState, useEffect } from "react";
import axios from "axios";

function SongCard({ track, userId }) {
    const [isFavorited, setIsFavorited] = useState(false);

    // Check if the track is already a favorite when it loads
    useEffect(() => {
        const checkIfFavorited = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/favorites/${userId}/track`);
                const favorites = response.data;
                // Check if the current track ID is in the list of favorites
                const isAlreadyFavorited = favorites.some(fav => fav.item_id === track.id);
                setIsFavorited(isAlreadyFavorited);
            } catch (error) {
                console.error("Error checking favorite status:", error);
            }
        };

        if (userId && track?.id) {
            checkIfFavorited();
        }
    }, [track, userId]);

    const handleFavoriteClick = async () => {
        try {
            await axios.post("http://localhost:8080/api/favorites", {
                userId,
                itemType: "track",
                itemId: track.id,
                itemName: track.name,
                itemArtist: track.artists[0].name
            });
            setIsFavorited(true);
        } catch (error) {
            console.error("Error adding favorite:", error);
        }
    };

    return (
        <div className="songCard-body flex">
            <AlbumImage url={track?.album?.images[0]?.url} />
            <AlbumInfo album={track.album} />
            <button onClick={handleFavoriteClick} disabled={isFavorited} className="favorite-button">
                {isFavorited ? "Favorited" : "Add to Favorites"}
            </button>
        </div>
    );
}

export default SongCard;