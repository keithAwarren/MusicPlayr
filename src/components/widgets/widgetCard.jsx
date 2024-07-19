import WidgetContext from "./widgetContext";
import "./widgets.css";

function WidgetCard({ title, similar, featured, newRelease }) {
    return (
        <div className="widgetCard-body">
            <p className="widget-title">{title}</p>
            {similar && similar.map((artist) => (
                <WidgetContext
                    key={artist.id}
                    title={artist?.name}
                    subtitle={`${artist?.followers?.total} followers`}
                    image={artist?.images[2]?.url}
                />
            ))}
            {featured && featured.map((playlist) => (
                <WidgetContext
                    key={playlist.id}
                    title={playlist?.name}
                    subtitle={`${playlist?.tracks?.total} songs`}
                    image={playlist?.images[0]?.url}
                />
            ))}
            {newRelease && newRelease.map((album) => (
                <WidgetContext
                    key={album.id}
                    title={album?.name}
                    subtitle={album?.artists[0]?.name}
                    image={album?.images[0]?.url}
                />
            ))}
        </div>
    );
}

export default WidgetCard;
