import { Link, useLocation } from "react-router-dom";
import { IconContext } from "react-icons";
import "./sidebarButton.css";

function SidebarButton({to, title, icon, onClick}) {
    
    // Access current URL
    const location = useLocation();

    // Check if current URL matches button's URL
    const isActive = location.pathname === to;

    // Decide CSS class depending on whether the button is active
    const btnClass = isActive ? "btn-body active": "btn-body";

    return to ? (
        <Link to={to}>
            <div className={btnClass}>
                <IconContext.Provider value={{ size: "30px", className: "btn-icon"}}>
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
    )
}

export default SidebarButton