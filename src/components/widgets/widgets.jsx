import { useEffect, useState } from "react";
import apiClient from "../../spotify";
import WidgetCard from "./widgetCard";
import "./widgets.css";

function Widgets({ artistID, onPlaylistClick, onArtistClick, onAlbumClick }) {
    const [similar, setSimilar] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [newRelease, setNewRelease] = useState([]);

    useEffect(() => {
        if (artistID) {
            apiClient.get(`/artists/${artistID}/related-artists`)
                .then((res) => {
                    const a = res.data?.artists.slice(0, 3);
                    setSimilar(a);
                }).catch((err) => console.error(err));

            apiClient.get(`/browse/featured-playlists`)
                .then((res) => {
                    const a = res.data?.playlists.items.slice(0, 3);
                    setFeatured(a);
                }).catch((err) => console.error(err));

            apiClient.get(`/browse/new-releases`)
                .then((res) => {
                    const a = res.data?.albums.items.slice(0, 3);
                    setNewRelease(a);
                }).catch((err) => console.error(err));
        }
    }, [artistID]);

    return (
        <div className="widgets-body">
            <WidgetCard title="Similar Artists" items={similar} onItemClick={onArtistClick} />
            <WidgetCard title="Made For You" items={featured} onItemClick={onPlaylistClick} />
            <WidgetCard title="New Releases" items={newRelease} onItemClick={onAlbumClick} />
        </div>
    );
}

export default Widgets;