function Controls({ isPlaying, setIsPlaying, handleNext, handlePrev, total }) {
    
    // Display playback buttons and controls for audio player
    return (
        <div className="controls">
            <button onClick={handlePrev}>Previous</button>
            <button onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={handleNext}>Next</button>
        </div>
    );
}

export default Controls;
