import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Sidebar from "../components/sidebar/sidebar"
import Playlists from "./Playlists"
import Player from "./player"
import Home from "./home"
import "./home.css"

function Index() {
    return (
        <Router>
            <div className="main-body">
                <Sidebar />
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/playlists" element={<Playlists/>}/>
                <Route path="/player" element={<Player />}/>
            </Routes>
            </div>
        </Router>
    )
}

export default Index