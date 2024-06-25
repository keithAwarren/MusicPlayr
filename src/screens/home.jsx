import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Playlists from "./Playlists"
import Player from "./player"
import "./home.css"

function Home() {
    return (
        <Router>
            <div className="main-body">
            <Routes>
                <Route path="/home" element={<Home />}/>
                <Route path="/playlists" element={<Playlists/>}/>
                <Route path="/player" element={<Player />}/>
            </Routes>
            </div>
        </Router>
    )
}

export default Home