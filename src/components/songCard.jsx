import React, { useState, useEffect } from "react";
import "../screens/player.css";
import AlbumImage from "./albumImage";
import AlbumInfo from "./albumInfo";
import axios from "axios";

function SongCard({ track }) {
  const [isFavorited, setIsFavorited] = useState(false);

  // Check if the track is already favorited
  useEffect(() => {
    const checkIfFavorited = async () => {
      if (!track || !track.id) return;

      try {
        const jwtToken = localStorage.getItem("jwt_token");
        if (!jwtToken) return;

        const response = await axios.get(
          `https://playrbackend.onrender.com/api/favorites/track/${track.id}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        setIsFavorited(response.data.isFavorite);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    setIsFavorited(false);
    if (track) checkIfFavorited();
  }, [track]);

  // Toggle favorite
  const handleFavoriteClick = async () => {
    const jwtToken = localStorage.getItem("jwt_token");
    if (!track?.id || !jwtToken) return;

    try {
      if (isFavorited) {
        // REMOVE from favorites
        await axios.delete(
          `https://playrbackend.onrender.com/api/favorites/track/${track.id}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setIsFavorited(false);
      } else {
        // ADD to favorites
        await axios.post(
          "https://playrbackend.onrender.com/api/favorites",
          {
            itemType: "track",
            itemId: track.id,
            itemName: track.name,
            itemArtist: track.artists?.[0]?.name || "Unknown Artist",
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (!track || !track.album) return null;

  return (
    <div className="songCard-body flex">
      <AlbumImage
        url={track.album.images?.[0]?.url || "https://via.placeholder.com/150"}
      />
      <AlbumInfo album={track.album} />
      <button
        onClick={handleFavoriteClick}
        className={`favorite-button ${isFavorited ? "favorited" : ""}`}
      >
        {isFavorited ? "Favorited" : "Add to Favorites"}
      </button>
    </div>
  );
}

export default SongCard;
