import "../screens/player.css";

function AlbumInfo({ album }) {
    // Empty array to hold names of artists
    const artists = []; 

    // Check if album and its artists exist, then iterate over each artist to extract their name
    album?.artists?.forEach((element) => {
        artists.push(element.name || 'Unknown Artist');
    });

    return (
        <div className="album-info-card">
            <div className="album-name-container">
                <div className="marquee">
                    <p>{album?.name || 'Unknown Album'} - {artists.length > 0 ? artists.join(", ") : 'Unknown Artist'}</p>
                </div>
            </div>
            <div className="album-info">
                <p>{`${album?.name || 'Head to the Playlist page and choose a playlist :)'} ${album?.album_type || ''} ${artists.length > 0 ? artists.join(", ") : ''} ${album?.total_tracks || ''} `}</p>
            </div>
            <div className="album-release">
                <p>Release Date: {album?.release_date || 'Unknown Release Date'}</p>
            </div>
        </div>
    );
}

export default AlbumInfo;
