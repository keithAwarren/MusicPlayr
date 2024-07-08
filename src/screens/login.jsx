import "./login.css";
import { loginEndpoint } from "../spotify";

function Login() {
    return (
        <div className="login-page">
            <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" 
                alt="spotify-logo"
                className="logo"
                />
            <a href={loginEndpoint}> {/* Link to Spotify Login page */}
                <div className="login-btn">LOG IN</div>
            </a>
        </div>
    )
}

export default Login;