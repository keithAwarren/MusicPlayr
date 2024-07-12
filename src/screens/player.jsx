import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import apiClient from "../spotify";
import SongCard from "../components/songCard";
import Queue from "../components/queue";
import "./player.css";

function Player() {

    const location = useLocation();
    const [tracks, setTracks] = useState([]);
    const [currentTrack, setCurrentTrack] = useState({});

    useEffect(() => {
        if (location.state) {
            apiClient
            .get("playlists/" + location.state?.id + "/tracks")
            .then((res) => {
                setTracks(res.data.items);
                setCurrentTrack(res.data.items[0].track);
            });
        }
    }, [location.state]);

    return (
        <div className="screen-container flex">
            <div className="left-player-body"></div>
            <div className="right-player-body">
                <SongCard />
                <Queue />
            </div>
        </div>
    )
}

export default Player