function AboutProject() {
    return (
        <div className="about-project">
            <h2>About playr</h2>
            <p className="project-description">
                Playr is a web app built with react + vite designed to give users a simplified Spotify expoerience, catered to their tastes.
            </p>
            <h3>Features</h3>
            <ul className="project-features">
                <li>PlayBack: Play, pause, rewind </li>
                <li>View Playlists: Do that</li>
                <li>Link Account: For you</li>
            </ul>
            <h3>How It's Made</h3>
            <p className="project-technologies">
                Built using react + vite with the official Spotify API intergrated for personalized and reliable requests.
            </p>
        </div>
    );
}

export default AboutProject;