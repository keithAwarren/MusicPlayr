import AboutMe from "../components/aboutMe";
import AboutProject from "../components/aboutProject";

function Home() {
    return (
        <div className="screen-container flex">
            <div className="left-home-body">
            <AboutProject />
            </div>
            <div className="right-home-body">
            <AboutMe />
            </div>
        </div>
    )
}

export default Home