import { useEffect, useRef, useState } from "react";
import "../screens/player.css";
import Controls from "./controls";

function AudioPlayer({ currentTrack, total, setCurrentIndex, currentIndex }) {

    const [isPlaying, setIsPlaying] = useState(true);
    const audioSrc = total[currentIndex]?.track.preview_url;
    const audioRef = useRef(new Audio(audioSrc));
    const intervalRef = useRef();
    const isReady = useRef(false);

    // Collect artists names for current track
    const artists = [];
    currentTrack?.album?.artists.forEach((artist) => {
        artists.push(artist.name);
    });

    // Play or pause audio based on the isPlaying state
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch((error) => console.error("Audio play error: ", error));
        } else {
            clearInterval(intervalRef.current);
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Effect to handle when the audio source changes
    useEffect(() => {
        if (isReady.current) {
            audioRef.current.pause();
            audioRef.current = new Audio(audioSrc);
            if (isPlaying) {
                audioRef.current.play().catch((error) => console.error("Audio play error: ", error));
            }
        } else {
            isReady.current = true;
        }
    }, [audioSrc]);

    // Effect to pause audio and clear intervals when the component unmounts
    useEffect(() => {
        return () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        };
    }, []);

    // Function to handle playing the next track
    const handleNext = () => {
        if (currentIndex < total.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    // Function to handle playing the previous track
    const handlePrev = () => {
        if (currentIndex - 1 < 0) {
            setCurrentIndex(total.length - 1);
        } else {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="audioPlayer-body flex">
            <div className="audioPlayer-left-body">
                <p>LYRICS</p>
            </div>
            <div className="audioPlayer-right-body flex">
                <p className="song-title">{currentTrack?.name}</p>
                <p className="song-artist">{artists.join(" | ")}</p>
                <Controls 
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    total={total}
                />
            </div>
        </div>
    );
}

export default AudioPlayer;
