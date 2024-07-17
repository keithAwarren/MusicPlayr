import { useEffect, useRef, useState } from "react";
import Controls from "./controls";
import "../screens/player.css";

function AudioPlayer({ currentTrack, total, setCurrentIndex, currentIndex }) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const audioSrc = total[currentIndex]?.track.preview_url;
    const audioRef = useRef(new Audio(audioSrc));
    const intervalRef = useRef();
    const isReady = useRef(false);

    // Collect artists names for current track
    const artists = [];
    currentTrack?.album?.artists.forEach((artist) => {
        artists.push(artist.name); // Add each name to the array
    });

    // Play or pause audio based on the isPlaying state
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play() // Play audio
                .catch((error) => console.error("Audio play error: ", error));
        } else {
            clearInterval(intervalRef.current); // Clear existing intervals
            audioRef.current.pause(); // Pause audio
        }
    }, [isPlaying]);

    // Effect to handle when the audio source changes
    useEffect(() => {
        if (isReady.current) {
            audioRef.current.pause(); // Pause current audio
            audioRef.current = new Audio(audioSrc); // Create new Audio object for new src
            setCurrentTime(0); // Reset current time when track changes
            if (isPlaying) {
                audioRef.current.play() // Play audio
                    .catch((error) => console.error("Audio play error: ", error));
            }
        } else {
            isReady.current = true;
        }
    }, [audioSrc]);

    // Effect to update current time and setup interval for updating time
    useEffect(() => {
        const handleTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);

        if (isPlaying) {
            intervalRef.current = setInterval(handleTimeUpdate, 1000);
            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        }

        return () => {
            clearInterval(intervalRef.current);
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [isPlaying]);

    // Effect to pause audio and clear intervals when the component unmounts
    useEffect(() => {
        return () => {
            audioRef.current.pause(); // Pause audio
            clearInterval(intervalRef.current); // Clear existing intervals
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

    // Format time in mm:ss format
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="audioPlayer-body flex">
            <div className="audioPlayer-left-body">
                <p>LYRICS</p>
            </div>
            <div className="audioPlayer-right-body flex">
                <p className="song-title">{currentTrack?.name}</p>
                <p className="song-artist">{artists.join(" | ")}</p>
                <div className="audioPlayer-right-bottom flex">
                    <div className="song-duration flex">
                        <p className="duration">{formatTime(currentTime)}</p>
                        <p className="duration">0:30</p>
                    </div>
                    <Controls
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        total={total}
                    />
                </div>
            </div>
        </div>
    );
}

export default AudioPlayer;