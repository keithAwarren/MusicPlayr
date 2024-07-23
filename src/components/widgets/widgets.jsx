import { useEffect, useState } from "react";
import apiClient from "../../spotify";
import WidgetCard from "./widgetCard";
import "./widgets.css";

function Widgets({ artistID, onPlaylistClick, onArtistClick, onAlbumClick }) {
  const [similar, setSimilar] = useState([]); // State to hold similar artists
  const [featured, setFeatured] = useState([]); // State to hold featured playlists
  const [newRelease, setNewRelease] = useState([]); // State to hold new releases

  // Effect to fetch data when the artistID changes
  useEffect(() => {
    if (artistID) {
      // Fetch related artists
      apiClient
        .get(`/artists/${artistID}/related-artists`)
        .then((res) => {
          const a = res.data?.artists.slice(0, 3); // Get the top 3 related artists
          setSimilar(a); // Update the similar artists state
        })
        .catch((err) => console.error(err)); // Log any errors

      // Fetch featured playlists
      apiClient
        .get(`/browse/featured-playlists`)
        .then((res) => {
          const a = res.data?.playlists.items.slice(0, 3); // Get the top 3 featured playlists
          setFeatured(a); // Update the featured playlists state
        })
        .catch((err) => console.error(err)); // Log any errors

      // Fetch new releases
      apiClient
        .get(`/browse/new-releases`)
        .then((res) => {
          const a = res.data?.albums.items.slice(0, 3); // Get the top 3 new releases
          setNewRelease(a); // Update the new releases state
        })
        .catch((err) => console.error(err)); // Log any errors
    }
  }, [artistID]); // Dependency array ensures this effect runs when artistID changes

  return (
    <div className="widgets-body">
      {/* Render similar artists widget */}
      <WidgetCard
        title="Similar Artists"
        items={similar}
        onItemClick={onArtistClick}
      />
      {/* Render featured playlists widget */}
      <WidgetCard
        title="Made For You"
        items={featured}
        onItemClick={onPlaylistClick}
      />
      {/* Render new releases widget */}
      <WidgetCard
        title="New Releases"
        items={newRelease}
        onItemClick={onAlbumClick}
      />
    </div>
  );
}

export default Widgets;