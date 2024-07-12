import "../screens/player.css"

function AlbumImage({ url }) {
    return (
            <div className="album-image flex">
                <img src={url} className="album-image-art"/>
            </div>
    );
}

export default AlbumImage;