import { useEffect, useRef, useState } from 'react';
import Controls from './controls';
import '../screens/player.css';

function AudioPlayer({ currentTrack, total, setCurrentIndex, currentIndex }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef(new Audio());
    const intervalRef = useRef();

    // Collect artists names for the current track
    const artists = currentTrack?.album?.artists.map(artist => artist.name).join(" | ") || "";

    // Handle audio source changes
    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.src = total[currentIndex]?.track.preview_url || '';
            audioElement.volume = volume;
            audioElement.load();  // Reload the audio source if necessary
            setCurrentTime(0);  // Reset current time to start of the new track

            if (isPlaying) {
                audioElement.play().catch(error => console.error("Audio play error: ", error));
            }
        }
    }, [currentIndex, total, isPlaying]);  // Only reload the source when currentIndex or isPlaying changes

    // Handle play or pause
    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            if (isPlaying) {
                audioElement.play().catch(error => console.error("Audio play error: ", error));
            } else {
                audioElement.pause();
            }
        }

        return () => {
            audioElement.pause();
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
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            setCurrentIndex(total.length - 1);
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
            <div className="album-art-container">
                {currentTrack?.album?.images[0]?.url && (
                    <img 
                        src={currentTrack.album.images[0].url} 
                        alt="Album Art" 
                        className="album-art"
                    />
                )}
            </div>
            <p className="song-title">{currentTrack?.name}</p>
            <p className="song-artist">{artists}</p>
            <div className="audioPlayer-bottom flex">
                <div className="song-duration flex">
                    <p className="duration">{formatTime(currentTime)}</p>
                    <div className={`wave ${isPlaying ? 'wave-active' : ''}`}></div>
                    <p className="duration">{formatTime(audioRef.current.duration || 0)}</p>
                </div>
                <Controls
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    volume={volume}
                    setVolume={setVolume}
                />
            </div>
        </div>
    );
}

export default AudioPlayer;