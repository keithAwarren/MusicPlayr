import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import apiClient from "../spotify";
import SongCard from "../components/songCard";
import Queue from "../components/queue";
import "./player.css";
import AudioPlayer from "../components/audioPlayer";

function Player() {

    const location = useLocation();
    const [tracks, setTracks] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (location.state) {
            apiClient
            .get("playlists/" + location.state?.id + "/tracks")
            .then((res) => {
                setTracks(res.data.items);
                setCurrentTrack(res.data?.items[0]?.track);
            });
        }
    }, [location.state]);

    useEffect(() => {
        setCurrentTrack(tracks[currentIndex]?.track);
    }, [currentIndex, tracks]);

    return (
        <div className="screen-container flex">
            <div className="left-player-body">
                <AudioPlayer 
                    currentTrack={currentTrack} 
                    total={tracks}
                    currentIndex={currentIndex} 
                    setCurrentIndex={setCurrentIndex}
                />
            </div>
            <div className="right-player-body">
                {currentTrack && currentTrack.album ? (
                <SongCard album={currentTrack.album} />
                ) : (
                    <div>Loading...</div>
                )}
                <Queue tracks={tracks} setCurrentIndex={setCurrentIndex}/>
            </div>
        </div>
    )
}

export default Player