import { Link } from "react-router-dom";
import { IconContext } from "react-icons";
import "./sidebarButton.css";

function SidebarButton(props) {
    return (
        <Link to={props.to}>
            <div className="btn-body">
                <IconContext.Provider value={{ size: "30px", className: "btn-icon"}}>
                {props.icon}
                <p className="btn-title">{props.title}</p>
                </IconContext.Provider>
            </div>
        </Link>
    );
}

export default SidebarButton