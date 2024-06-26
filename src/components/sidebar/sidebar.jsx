import "./sidebar.css"
import SidebarButton from "./sidebarButton"
import { IoHomeSharp } from "react-icons/io5";
import { BsMusicPlayerFill } from "react-icons/bs";
import { PiPlaylistFill } from "react-icons/pi";
import { SlLogin } from "react-icons/sl";


function Sidebar() {
    return (
        <>
            <div className="sidebar-container">
                <img
                    src="https://picsum.photos/id/237/200/300"
                    className="profile-img"
                />
            <div>
                <SidebarButton title="Home" to="/" icon={<IoHomeSharp />}/>
                <SidebarButton title="Player" to="/player" icon={<BsMusicPlayerFill />}/>
                <SidebarButton title="Playlists" to="/playlists" icon={<PiPlaylistFill />}/>
            </div>
            <SidebarButton title="" icon={<SlLogin />}/>
            </div>
        </>
    )
}

export default Sidebar