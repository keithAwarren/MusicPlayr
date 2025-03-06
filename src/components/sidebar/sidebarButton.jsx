import { Link, useLocation } from "react-router-dom";
import { IconContext } from "react-icons";
import "./sidebarButton.css";

function SidebarButton({ to, title, icon, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  const btnClass = isActive ? "btn-body active" : "btn-body";

  return to ? (
    <Link to={to}>
      <div className={btnClass}>
        <IconContext.Provider value={{ size: "30px", className: "btn-icon" }}>
          {icon}
          <p className="btn-title">{title}</p>
        </IconContext.Provider>
      </div>
    </Link>
  ) : (
    <div className={btnClass} onClick={onClick}>
      <IconContext.Provider value={{ size: "30px", className: "btn-icon" }}>
        {icon}
      </IconContext.Provider>
      <p className="btn-title">{title}</p>
    </div>
  );
}

export default SidebarButton;