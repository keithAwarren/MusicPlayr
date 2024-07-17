import { IconContext } from "react-icons";
import { FaPause } from "react-icons/fa";
import { IoPlaySkipBack, IoPlaySkipForward, IoPlay } from "react-icons/io5";

function Controls({ isPlaying, setIsPlaying, handleNext, handlePrev, total }) {
    
    // Display playback buttons and controls for audio player
    return (
        <IconContext.Provider value={{ size: "40px", color: "rgba(0, 0, 0, 0.6)"}}>
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
        </div>
        </IconContext.Provider>
    );
}

export default Controls;
