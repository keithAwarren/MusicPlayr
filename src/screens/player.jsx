import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import apiClient from "../spotify";
import SongCard from "../components/songCard";
import Queue from "../components/queue";
import AudioPlayer from "../components/audioPlayer";
import "./player.css";
import Widgets from "../components/widgets/widgets";

function Player() {
  const location = useLocation(); // Get the current location object from React Router
  const [tracks, setTracks] = useState([]); // State to hold the list of tracks
  const [currentTrack, setCurrentTrack] = useState(null); // State to hold the current track being played
  const [currentIndex, setCurrentIndex] = useState(0); // State to hold the index of the current track

  // Effect to fetch playlist tracks when the component mounts or the location state changes
  useEffect(() => {
    if (location.state) {
      const { id } = location.state; // Extract playlist ID from location state
      apiClient.get(`playlists/${id}/tracks`).then((res) => {
        const newTracks = res.data.items; // Extract the tracks from the response
        setTracks(newTracks); // Update the tracks state
        setCurrentIndex(0); // Reset the current index to 0
        setCurrentTrack(newTracks[0]?.track); // Set the first track as the current track
      });
    }
  }, [location.state]);

  // Effect to update the current track when the current index or tracks change
  useEffect(() => {
    setCurrentTrack(tracks[currentIndex]?.track); // Set the current track based on the current index
  }, [currentIndex, tracks]);

  // Functions to handle playlist, artist and album click and fetch tracks from the selected widget
  const handlePlaylistClick = (playlist) => {
    apiClient.get(`/playlists/${playlist.id}/tracks`).then((res) => {
      const newTracks = res.data.items; // Extract the tracks from the response
      setTracks(newTracks); // Update the tracks state
      setCurrentIndex(0); // Reset the current index to 0
    });
  };

  const handleArtistClick = (artist) => {
    apiClient.get(`/artists/${artist.id}/top-tracks?market=US`).then((res) => {
      const newTracks = res.data.tracks.map((track) => ({ track }));
      setTracks(newTracks);
      setCurrentIndex(0);
    });
  };

  const handleAlbumClick = (album) => {
    apiClient.get(`/albums/${album.id}/tracks`).then((res) => {
      const newTracks = res.data.items.map((track) => ({ track }));
      setTracks(newTracks);
      setCurrentIndex(0);
    });
  };

  return (
    <div className="screen-container flex player-mobile">
      <div className="left-player-body audioPlayer-mobile">
        <AudioPlayer
          currentTrack={currentTrack}
          total={tracks}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
        <Widgets
          artistID={currentTrack?.album?.artists[0]?.id}
          onPlaylistClick={handlePlaylistClick}
          onArtistClick={handleArtistClick}
          onAlbumClick={handleAlbumClick}
        />
      </div>
      <div className="right-player-body songCard-mobile">
        {currentTrack && currentTrack.album ? (
          <SongCard album={currentTrack.album} /> // Render the SongCard component with the current track's album
        ) : (
          <SongCard /> // Render an empty SongCard component if there's no current track
        )}
        <Queue tracks={tracks} setCurrentIndex={setCurrentIndex} />
      </div>
    </div>
  );
}

export default Player;
