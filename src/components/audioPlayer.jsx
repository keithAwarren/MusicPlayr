import "../screens/player.css"

function AudioPlayer({ currentTrack }) {

    const artists = [];
    currentTrack?.album?.artists.forEach((artist) => {
        artists.push(artist.name);
    });

    return (
        <div className="audioPlayer-body flex">
            <div className="aduioPlayer-left-body">
                <p>LEFT</p>
            </div>
            <div className="audioPlayer-right-body flex">
                <p className="song-title">{currentTrack?.name}</p>
                <p className="song-artist">{artists.join(" | ")}</p>
            </div>
        </div>
    );
}

export default AudioPlayer