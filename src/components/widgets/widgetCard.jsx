import WidgetContext from "./widgetContext";
import "./widgets.css";

function WidgetCard({ title, items, onItemClick }) {
    return (
        <div className="widgetCard-body">
            <p className="widget-title">{title}</p>
            {items.map((item, index) => (
                <div key={index} onClick={() => onItemClick(item)}>
                    <WidgetContext
                        title={item?.name}
                        subtitle={title === "Similar Artists" ? item?.followers?.total + " followers" : title === "Made For You" ? item?.tracks?.total + " songs" : item?.artists[0]?.name}
                        image={item?.images?.[0]?.url || item?.images?.[1]?.url || item?.images?.[2]?.url || ""}
                    />
                </div>
            ))}
        </div>
    );
}

export default WidgetCard;