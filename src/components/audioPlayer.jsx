import { useEffect, useRef, useState } from 'react';
import Controls from './controls';
import '../screens/player.css';

function AudioPlayer({ currentTrack, total, setCurrentIndex, currentIndex }) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const audioSrc = total[currentIndex]?.track.preview_url;
    const audioRef = useRef(new Audio());
    const intervalRef = useRef();
    const isReady = useRef(false);

    // Collect artists names for the current track
    const artists = [];
    currentTrack?.album?.artists.forEach((artist) => {
        artists.push(artist.name);
    });

    // Handle audio source changes
    useEffect(() => {
        if (audioSrc) {
            audioRef.current.src = audioSrc;
            audioRef.current.load();
        }
    }, [audioSrc]);

    // Play or pause the audio
    useEffect(() => {
        const handlePlayPause = async () => {
            try {
                if (isPlaying) {
                    await audioRef.current.play();
                } else {
                    audioRef.current.pause();
                }
            } catch (error) {
                console.error("Audio play error: ", error);
            }
        };

        handlePlayPause();

        return () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        };
    }, [isPlaying]);

    // Update current time and setup interval
    useEffect(() => {
        const handleTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);

        if (isPlaying) {
            intervalRef.current = setInterval(handleTimeUpdate, 1000);
            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => {
            clearInterval(intervalRef.current);
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [isPlaying]);

    // Handle track change
    useEffect(() => {
        if (isReady.current) {
            audioRef.current.pause();
            audioRef.current = new Audio(audioSrc);
            audioRef.current.volume = volume; // Set initial volume
            setCurrentTime(0);
            if (isPlaying) {
                audioRef.current.play()
                    .catch((error) => console.error("Audio play error: ", error));
            }
        } else {
            isReady.current = true;
        }
    }, [audioSrc]);

    // Handle volume change
    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    // Handle next and previous track
    const handleNext = () => {
        if (currentIndex < total.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    };

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
            <p className="song-title">{currentTrack?.name}</p>
            <p className="song-artist">{artists.join(" | ")}</p>
            <div className="audioPlayer-bottom flex">
                <div className="song-duration flex">
                    <p className="duration">{formatTime(currentTime)}</p>
                    <div className={`wave ${isPlaying ? 'wave-active' : ''}`}></div>
                    <p className="duration">0:30</p>
                </div>
                <Controls
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    volume={volume}
                    setVolume={setVolume}
                    total={total}
                />
            </div>
        </div>
    );
}

export default AudioPlayer;
