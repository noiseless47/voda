import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateMusicInsights(data: {
  topTracks: SpotifyApi.TrackObjectFull[];
  topArtists: SpotifyApi.ArtistObjectFull[];
  genres: string[];
}) {
  const prompt = `Analyze this user's music taste and provide insights:
    Top Artists: ${data.topArtists.map(artist => artist.name).join(', ')}
    Top Genres: ${data.genres.join(', ')}
    Top Tracks: ${data.topTracks.map(track => `${track.name} by ${track.artists[0].name}`).join(', ')}

    Please provide:
    1. A summary of their music taste
    2. Interesting patterns or preferences
    3. Music recommendations based on their taste
    4. Unique insights about their listening habits`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating insights:', error);
    return 'Unable to generate insights at this time.';
  }
}

export async function generatePlaylistDescription(tracks: SpotifyApi.TrackObjectFull[]) {
  const genres = [...new Set(tracks.flatMap(track => 
    track.artists.flatMap(artist => (artist as unknown as SpotifyApi.ArtistObjectFull).genres || [])
  ))];

  const prompt = `Create an engaging playlist description for a mix of music with these characteristics:
    Genres: ${genres.join(', ')}
    Artists: ${[...new Set(tracks.map(track => track.artists[0].name))].join(', ')}
    Mood: Based on these songs, suggest a mood or theme for this playlist.

    Please provide:
    1. A catchy title for the playlist
    2. A short, engaging description
    3. The overall mood/vibe of the playlist`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating playlist description:', error);
    return 'Unable to generate playlist description at this time.';
  }
}
