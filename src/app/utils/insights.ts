import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

interface UserListeningData {
  topGenres: string[];
  topArtists: SpotifyApi.ArtistObjectFull[];
  topTracks: SpotifyApi.TrackObjectFull[];
  recentTracks?: SpotifyApi.PlayHistoryObject[];
}

async function generateMusicInsights(userData: UserListeningData) {
  const prompt = `Analyze this user's music taste:
    Top Genres: ${userData.topGenres.join(', ')}
    Favorite Artists: ${userData.topArtists.map(a => a.name).join(', ')}
    Top Tracks: ${userData.topTracks.map(t => t.name).join(', ')}

    Please provide:
    1. A summary of their music taste
    2. Interesting patterns or preferences
    3. Music recommendations based on their taste`;
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating insights:', error);
    return 'Unable to generate insights at this time.';
  }
}

export { generateMusicInsights, type UserListeningData }; 