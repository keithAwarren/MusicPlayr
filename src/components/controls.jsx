import { IconContext } from "react-icons";
import { FaPause, FaVolumeUp, FaVolumeDown } from "react-icons/fa";
import { IoPlaySkipBack, IoPlaySkipForward, IoPlay } from "react-icons/io5";

function Controls({ isPlaying, setIsPlaying, handleNext, handlePrev, volume, setVolume }) {

    // Determine the appropriate volume icon
    const getVolumeIcon = () => {
        if (volume <= 0.5) {
            return <FaVolumeDown />;
        } else {
            return <FaVolumeUp />;
        }
    };

    // Display playback buttons and controls for audio player
    return (
        <IconContext.Provider value={{ size: "30px", color: "rgba(0, 0, 0, 0.6)"}}>
            <div className="controls flex">
                <div className="action-btn flex" onClick={handlePrev}>
                    <IoPlaySkipBack />
                </div>
                <div className={isPlaying ? "play-pause-btn flex active" : "play-pause-btn flex"} onClick={() => setIsPlaying(!isPlaying)}>
                    { isPlaying ? <FaPause /> : <IoPlay /> }
                </div>
                <div className="action-btn flex" onClick={handleNext}>
                    <IoPlaySkipForward />
                </div>
                <div className="volume-control flex">
                    {getVolumeIcon()}
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        volume={volume} 
                        onChange={(e) => setVolume(e.target.value)} 
                    />
                </div>
            </div>
        </IconContext.Provider>
    );
}

export default Controls;