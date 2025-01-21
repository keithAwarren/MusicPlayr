import "./widgets.css";

function WidgetContext({ title, subtitle, image }) {
  // Fetch title, subtitle and album image for widgets
  return (
    <div className="context-body flex">
      <img src={image} alt={title} className="context-image" />
      <div className="context-right-body flex">
        <p className="context-title">{title}</p>
        <p className="context-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

export default WidgetContext;