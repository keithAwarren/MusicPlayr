import "../screens/player.css"
import AlbumImage from "./albumImage"
import AlbumInfo from "./albumInfo"

function SongCard({album}) {
    return (
        <div className="songCard-body flex">
            <AlbumImage url={album?.images[0]?.url} />
            <AlbumInfo album={album} />
        </div>
    )
}

export default SongCard