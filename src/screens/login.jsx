import "./login.css";
import { loginEndpoint } from "../spotify";
import myPhoto from "../assets/KEITH.jpeg";

function Login() {
    return (
        <div className="login-page flex">
            <div className="content-wrappe flex">
                <div className="left-section flex">
                    <div className="about-project">
                        <h2>About playr</h2>
                        <p className="project-description">
                            Playr is a sleek web application built with React and Vite, designed to offer users a seamless Spotify experience tailored to their unique tastes.
                        </p>
                        <h3>Features</h3>
                        <ul className="project-features">
                            <li>Playback: Enjoy full Spotify player functionality with ease.</li>
                            <br />
                            <li>View Playlists: Access both your curated playlists and those crafted just for you.</li>
                            <br />
                            <li>Link Account: Integrate your account for a truly personalized experience.</li>
                        </ul>
                        <h3>How It's Made</h3>
                        <p className="project-technologies">
                        Playr is crafted using the powerful combination of the React and Vite libraries, seamlessly integrating the Spotify API with Axios for robust data handling. Animations and styles are inspired by CSSGradient.io and CodePen.io, ensuring an aesthetically pleasing user experience.
                        </p>
                    </div>
                </div>
                <div className="center-section flex">
                    <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" 
                        alt="spotify-logo"
                        className="logo"
                    />
                    <a href={loginEndpoint}> {/* Link to Spotify Login page */}
                        <div className="login-btn">LOG IN</div>
                    </a>
                </div>
                <div className="right-section flex">
                    <div className="about-me">
                        <img
                            src={myPhoto}
                            alt="My Photo"
                            className="keith-photo"
                        />
                        <div className="me-description">
                            <h2>About Me</h2>
                            <p>
                                Hi, my name is Keith. I went to school, I go to work, I feed my cats.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;