import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../spotify";
import SongCard from "../components/songCard";
import Queue from "../components/queue";
import AudioPlayer from "../components/audioPlayer";
import Widgets from "../components/widgets/widgets";
import "./player.css";

function Player() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]); // Stores the playlist tracks OR single track
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (location.state) {
      if (location.state.id) {
        // If an ID is provided, fetch playlist tracks
        apiClient.get(`playlists/${location.state.id}/tracks`).then((res) => {
          const newTracks = res.data.items;
          setTracks(newTracks);
          setCurrentIndex(0);
          setCurrentTrack(newTracks[0]?.track);
        });
      } else if (location.state.uri) {
        // If a track URI is provided, fetch single track details
        apiClient.get(`tracks/${location.state.uri.split(":").pop()}`).then((res) => {
          setTracks([{ track: res.data }]); // Store single track in array format
          setCurrentIndex(0);
          setCurrentTrack(res.data);
        });
      }
    }
  }, [location.state]);

  useEffect(() => {
    setCurrentTrack(tracks[currentIndex]?.track);
  }, [currentIndex, tracks]);

  console.log("Tracks loaded:", tracks);
  console.log("Current Track:", currentTrack);

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
          onPlaylistClick={(playlist) =>
            navigate("/player", { state: { id: playlist.id } })
          }
          onArtistClick={() => {}}
          onAlbumClick={(album) =>
            navigate("/player", { state: { id: album.id } })
          }
          onTrackClick={(track) =>
            navigate("/player", { state: { uri: track.uri } })
          }
        />
      </div>
      <div className="right-player-body songCard-mobile">
        {currentTrack && currentTrack.album ? (
          <SongCard track={currentTrack} />
        ) : (
          <p>Track data is unavailable</p>
        )}
        <Queue
          tracks={tracks}
          setCurrentIndex={setCurrentIndex}
          currentTrack={currentTrack}
        />
      </div>
    </div>
  );
}

export default Player;