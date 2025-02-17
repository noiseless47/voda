export const authEndpoint = "https://accounts.spotify.com/authorize";
export const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
export const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
export const scopes = [
  "user-read-private",
  "user-read-email",
  "streaming",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-library-read",
  "user-follow-read"
];

export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial: { [key: string]: string }, item) => {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
}; 