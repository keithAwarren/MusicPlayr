import React, { useState, useEffect } from "react";
import "../screens/player.css";
import AlbumImage from "./albumImage";
import AlbumInfo from "./albumInfo";
import axios from "axios";

function SongCard({ track }) {
    console.log("SongCard received props:", { track }); // Debugging log to check props

    const [isFavorited, setIsFavorited] = useState(false);

    // Check if the track is already favorited
    useEffect(() => {
        const checkIfFavorited = async () => {
            if (!track || !track.id) return; // Ensure track and track.id exist

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/favorites/track/${track.id}`
                );
                setIsFavorited(response.data.isFavorite);
            } catch (error) {
                console.error("Error checking favorite status:", error);
            }
        };

        setIsFavorited(false);
        if (track) checkIfFavorited();
    }, [track]);

    // Handle adding the track to favorites
    const handleFavoriteClick = async () => {
        if (!track || !track.id) return; // Ensure track and track.id exist

        try {
            await axios.post("http://localhost:8080/api/favorites", {
                itemType: "track",
                itemId: track.id,
                itemName: track.name,
                itemArtist: track.artists?.[0]?.name || "Unknown Artist",
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
            <AlbumImage
                url={track.album.images?.[0]?.url || "https://via.placeholder.com/150"}
            />
            <AlbumInfo album={track.album} />
            <button
                onClick={handleFavoriteClick}
                disabled={isFavorited}
                className="favorite-button"
            >
                {isFavorited ? "Favorited" : "Add to Favorites"}
            </button>
        </div>
    );
}

export default SongCard;