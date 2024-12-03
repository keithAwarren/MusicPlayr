import { useEffect, useState } from "react";
import apiClient from "../../spotify";
import WidgetCard from "./widgetCard";
import "./widgets.css";

function Widgets({ artistID, onPlaylistClick, onArtistClick, onAlbumClick }) {
  const [topTracks, setTopTracks] = useState([]); // State to hold top tracks
  const [curatedPlaylists, setCuratedPlaylists] = useState([]); // State to hold curated playlists
  const [newRelease, setNewRelease] = useState([]); // State to hold new releases

  // Effect to fetch data when the artistID changes
  useEffect(() => {
    if (artistID) {
      // Fetch top tracks for the artist
      apiClient
        .get(`/artists/${artistID}/top-tracks?market=US`)
        .then((res) => {
          const a = res.data?.tracks.slice(0, 3); // Get the top 3 tracks
          setTopTracks(a); // Update the top tracks state
        })
        .catch((err) => console.error(err)); // Log any errors
    }

    // Fetch user playlists as curated playlists
    apiClient
      .get(`/me/playlists`)
      .then((res) => {
        const a = res.data?.items.slice(0, 3); // Get the top 3 user playlists
        setCuratedPlaylists(a); // Update the curated playlists state
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
  }, [artistID]); // Dependency array ensures this effect runs when artistID changes

  return (
    <div className="widgets-body">
      {/* Render top tracks widget */}
      <WidgetCard
        title="Top Tracks"
        items={topTracks}
        onItemClick={(track) => console.log("Selected track:", track)}
      />
      {/* Render curated playlists widget */}
      <WidgetCard
        title="Curated Playlists"
        items={curatedPlaylists}
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