import { useState, useEffect } from "react";
import axios from "axios";
import "../screens/player.css";

function Queue({ tracks, setCurrentIndex, currentTrack }) {
  const [activeTab, setActiveTab] = useState("queue"); // State to toggle between queue and lyrics
  const [lyrics, setLyrics] = useState(""); // State to store lyrics
  const [loading, setLoading] = useState(false); // State to handle loading

  // Fetch lyrics when "Lyrics" tab is active
  useEffect(() => {
    if (activeTab === "lyrics" && currentTrack) {
      const fetchLyrics = async () => {
        try {
          setLoading(true);

          const jwtToken = localStorage.getItem("jwt_token");

          if (!jwtToken) {
            console.warn("Missing JWT token");
            setLyrics("Authorization error.");
            return;
          }

          const response = await axios.get(
            "https://playrbackend.onrender.com/api/lyrics",
            {
              params: {
                trackName: currentTrack.name,
                artistName: currentTrack.artists[0]?.name,
              },
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
          setLyrics(response.data.lyrics || "Lyrics not available.");
        } catch (error) {
          console.error("Error fetching lyrics:", error);
          setLyrics("Lyrics Unavailable.");
        } finally {
          setLoading(false);
        }
      };
      fetchLyrics();
    }
  }, [activeTab, currentTrack]);

  return (
    <div className="queue-container flex">
      <div className="queue flex">
        {/* Tabs for toggling */}
        <p className="up-next">
          <span
            className={activeTab === "queue" ? "active-tab" : ""}
            onClick={() => setActiveTab("queue")}
          >
            Up Next
          </span>{" "}
          /{" "}
          <span
            className={activeTab === "lyrics" ? "active-tab" : ""}
            onClick={() => setActiveTab("lyrics")}
          >
            Lyrics
          </span>
        </p>

        {/* Conditional Rendering for Queue and Lyrics */}
        <div className="queue-list">
          {activeTab === "queue" ? (
            tracks?.map((track, index) => (
              <div
                key={track?.track?.id || index}
                className="queue-item flex"
                onClick={() => setCurrentIndex(index)}
              >
                <p className="track-name">{track?.track?.name}</p>
                <p>0:30</p>
              </div>
            ))
          ) : loading ? (
            <p>Loading lyrics...</p>
          ) : (
            <pre>{lyrics}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default Queue;
