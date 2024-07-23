import "./login.css";
import { loginEndpoint } from "../spotify";
import myPhoto from "../assets/KEITH.jpeg";
import { LiaGithub, LiaLinkedin } from "react-icons/lia";
import { MdEmail } from "react-icons/md";
import { IconContext } from "react-icons";

function Login() {
  return (
    <IconContext.Provider value={{ size: "40px", color: "white" }}>
      <div className="login-page flex">
        <div className="content-wrapper flex">
          <div className="left-section flex">
            <div className="about-project">
              <h2>About playr</h2>
              <p className="project-description">
                Playr is a sleek web application built with React and Vite,
                designed to offer users a seamless Spotify experience tailored
                to their unique tastes.
              </p>
              <h3>Features</h3>
              <ul className="project-features">
                <li>
                  Playback: Enjoy full Spotify player functionality with ease.
                </li>
                <br />
                <li>
                  View Playlists: Access both your curated playlists and those
                  crafted just for you.
                </li>
                <br />
                <li>
                  Link Account: Integrate your account for a truly personalized
                  experience.
                </li>
              </ul>
              <h3>How It's Made</h3>
              <p className="project-technologies">
                Playr is crafted using the powerful combination of the React and
                Vite libraries, seamlessly integrating the Spotify API with
                Axios for robust data handling. Animations and styles are
                inspired by CSSGradient.io and CodePen.io, ensuring an
                aesthetically pleasing user experience.
              </p>
            </div>
          </div>
          <div className="center-section flex">
            <img
              src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
              alt="spotify-logo"
              className="logo"
            />
            <a href={loginEndpoint}>
              {" "}
              {/* Link to Spotify Login page */}
              <div className="login-btn">LOG IN</div>
            </a>
          </div>
          <div className="right-section flex">
            <div className="about-me flex">
              <img src={myPhoto} alt="My Photo" className="keith-photo" />
              <div className="me-description">
                <div className="contact-links">
                  <h3>Connect with me</h3>
                  <ul className="flex">
                    <li>
                      <a
                        href="https://www.linkedin.com/in/keith-warren-286875269"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LiaLinkedin />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/keithAwarren"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LiaGithub />
                      </a>
                    </li>
                    <li>
                      <a href="mailto:warrenkeith.music@gmail.com">
                        <MdEmail />
                      </a>
                    </li>
                  </ul>
                </div>
                <h2>About Me</h2>
                <p>
                  Hi, I’m Keith! I’m an aspiring web and software developer with
                  a passion for creating. When I'm not coding, you can find me
                  enjoying music, skateboarding/being active, or spending time
                  with my kittens. My goal is to merge my love for technology
                  with my creative interests to build engaging and user-friendly
                  applications.
                </p>
                <p>
                  **DISCLAIMER** The Spotify API has it's limitations, this
                  project is only able to play 30 second previews of tracks per
                  the spotify APIs terms of service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </IconContext.Provider>
  );
}

export default Login;
