export const authEndpoint = "https://accounts.spotify.com/authorize";
export const clientId = NEXT_PUBLIC_SPOTIFY_CLIENT_ID; // Get this from Spotify Developer Dashboard
export const redirectUri = NEXT_PUBLIC_REDIRECT_URI;
export const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-read-private",
  "user-read-email",
];

export const getTokenFromUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.hash
      .substring(1)
      .split("&")
      .reduce((initial, item) => {
        let parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});
  }
  return {};
}; 