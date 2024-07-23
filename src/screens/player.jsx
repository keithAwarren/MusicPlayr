import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import apiClient from "../spotify";
import SongCard from "../components/songCard";
import Queue from "../components/queue";
import AudioPlayer from "../components/audioPlayer";
import "./player.css";
import Widgets from "../components/widgets/widgets";

function Player() {
  const location = useLocation();
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (location.state) {
      const { id } = location.state;
      apiClient.get(`playlists/${id}/tracks`).then((res) => {
        const newTracks = res.data.items;
        setTracks(newTracks);
        setCurrentIndex(0);
        setCurrentTrack(newTracks[0]?.track);
      });
    }
  }, [location.state]);

  useEffect(() => {
    setCurrentTrack(tracks[currentIndex]?.track);
  }, [currentIndex, tracks]);

  const handlePlaylistClick = (playlist) => {
    apiClient.get(`/playlists/${playlist.id}/tracks`).then((res) => {
      const newTracks = res.data.items;
      setTracks(newTracks);
      setCurrentIndex(0);
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
          <SongCard album={currentTrack.album} />
        ) : (
          <SongCard />
        )}
        <Queue tracks={tracks} setCurrentIndex={setCurrentIndex} />
      </div>
    </div>
  );
}

export default Player;
