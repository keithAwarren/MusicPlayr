import "../screens/player.css";

function AlbumInfo({ album }) {
  // Empty array to hold names of artists
  const artists = [];

  // Check if album and its artists exist, then iterate over each artist to extract their name
  album?.artists?.forEach((element) => {
    artists.push(element.name || "Unknown Artist");
  });

  // Conditional rendering message
  const renderAlbumInfo = () => {
    if (!album) {
      return "Head to the Playlist page and choose a playlist :)";
    }

    return `${album.name || "Unknown Album"} is an ${
      album.album_type || ""
    } by ${artists.length > 0 ? artists.join(", ") : "Unknown Artist"} with ${
      album.total_tracks || 0
    } track(s)`;
  };

  return (
    <div className="album-info-card">
      <div className="album-name-container">
        <div className="marquee">
          <p>
            {album
              ? `${album.name || "Unknown Album"} - ${
                  artists.length > 0 ? artists.join(", ") : "Unknown Artist"
                }`
              : "Head to the Playlist page and choose a playlist :)"}
          </p>
        </div>
      </div>
      <div className="album-info">
        <p>{renderAlbumInfo()}</p>
      </div>
      <div className="album-release">
        <p>Release Date: {album?.release_date || "Unknown Release Date"}</p>
      </div>
    </div>
  );
}

export default AlbumInfo;
