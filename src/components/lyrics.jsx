import { useState, useEffect } from 'react';
import axios from 'axios';

function Lyrics({ trackName, artistName }) {
  const [lyrics, setLyrics] = useState(''); // State to store lyrics
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/lyrics`, {
          params: {
            trackName,
            artistName,
          },
        });
        setLyrics(response.data.lyrics);
      } catch (error) {
        console.error('Error fetching lyrics:', error);
        setLyrics('Lyrics not available.');
      } finally {
        setLoading(false);
      }
    };

    if (trackName && artistName) {
      fetchLyrics();
    }
  }, [trackName, artistName]);

  return (
    <div className="lyrics-container">
      <h2>Lyrics</h2>
      {loading ? <p>Loading...</p> : <pre>{lyrics}</pre>}
    </div>
  );
}

export default Lyrics;