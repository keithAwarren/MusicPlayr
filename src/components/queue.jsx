import "../screens/player.css";

function Queue({ tracks, setCurrentIndex }) {
  // Display list of upcoming tracks and allow selection
  return (
    <div className="queue-container flex">
      <div className="queue flex">
        <p className="up-next">Up Next</p>
        <div className="queue-list">
          {tracks?.map((track, index) => (
            <div
              key={track?.track?.id || index}
              className="queue-item flex"
              onClick={() => setCurrentIndex(index)}
            >
              <p className="track-name">{track?.track?.name}</p>
              <p>0:30</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Queue;
