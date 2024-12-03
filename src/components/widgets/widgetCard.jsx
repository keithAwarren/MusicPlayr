import WidgetContext from "./widgetContext";
import "./widgets.css";

function WidgetCard({ title, items, onItemClick }) {
  return (
    <div className="widgetCard-body">
      <p className="widget-title">{title}</p>
      {items.map((item, index) => (
        <div key={index} onClick={() => onItemClick(item)}>
          <WidgetContext
            // Set the title based on the widget type
            title={
              title === "Top Tracks"
                ? item?.name // Track name for top tracks
                : item?.name // General name for other items
            }
            // Set the subtitle dynamically
            subtitle={
              title === "Top Tracks"
                ? item?.artists?.map((artist) => artist.name).join(", ") // Artist(s) for top tracks
                : title === "Curated Playlists"
                ? `${item?.tracks?.total || 0} songs` // Playlist song count
                : item?.artists?.[0]?.name // General case
            }
            // Set the image URL dynamically
            image={
              title === "Top Tracks"
                ? item?.album?.images?.[0]?.url // Album cover for top tracks
                : item?.images?.[0]?.url || "" // General image
            }
          />
        </div>
      ))}
    </div>
  );
}

export default WidgetCard;