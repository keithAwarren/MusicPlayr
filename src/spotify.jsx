import axios from "axios";

const authEndpoint = "https://accounts.spotify.com/en/authorize"; // Base URL for Spotify authorization
const clientId = "74745c6eaa6c44c9a6fe6ef0e6fa6310"; // Playr App client ID
const redirectUri = "https://musicplayr.onrender.com/callback"
const scopes = [
  "user-library-read",
  "playlist-read-private",
  "streaming",
  "app-remote-control",
  "user-read-recently-played",
  "user-top-read",
]; // App permissions

// Construct the login URL with correct parameters
export const loginEndpoint = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=${encodeURIComponent(
  scopes.join(" ")
)}&response_type=token&show_dialog=true`;

// Use Axios for making requests to the Spotify API
const apiClient = axios.create({
  baseURL: "https://api.spotify.com/v1/", // base URL for Spotify API
});

// Set authorization token
export const setClientToken = (token) => {
  // Intercept each request and add the Authorization header with the token
  apiClient.interceptors.request.use(async function (config) {
    config.headers.Authorization = "Bearer " + token;
    return config;
  });
};

export default apiClient;
