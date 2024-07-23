import WidgetContext from "./widgetContext";
import "./widgets.css";

function WidgetCard({ title, items, onItemClick }) {
  return (
    <div className="widgetCard-body">
      <p className="widget-title">{title}</p>
      {items.map((item, index) => (
        <div key={index} onClick={() => onItemClick(item)}>
          <WidgetContext
            // Set the title of the widget context to the item's name
            title={item?.name}
            // Set the subtitle based on the widget type
            subtitle={
              title === "Similar Artists"
                ? item?.followers?.total + " followers"
                : title === "Made For You"
                ? item?.tracks?.total + " songs"
                : item?.artists[0]?.name
            }
            // Set the image URL for the widget context
            image={
              item?.images?.[0]?.url ||
              item?.images?.[1]?.url ||
              item?.images?.[2]?.url ||
              ""
            }
          />
        </div>
      ))}
    </div>
  );
}

export default WidgetCard;