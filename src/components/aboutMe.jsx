import myPhoto from "../assets/KEITH.jpeg"

function AboutMe() {
    return(
        <>
        <div className="about-me-wrapper">
        <img
            src={myPhoto}
            alt="My Photo"
            className="keith-photo" 
        />
            <div className="about-me">
                <h2>About Me</h2>
                <p className="me-description">
                    Hi my name is Keith I went to school I go to work I feed my cats.
                </p>
            </div>
        </div>
        </>
    );
}

export default AboutMe;