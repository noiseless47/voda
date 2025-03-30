import Groq from 'groq-sdk';

// Using Llama 3 model
const MODEL = 'llama3-70b-8192';

// Initialize the Groq client properly
const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true
});

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
    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
    });
    
    return response.choices[0]?.message?.content || 'Unable to generate insights at this time.';
  } catch (error) {
    console.error('Error generating insights:', error);
    return 'Unable to generate insights at this time.';
  }
}

export { generateMusicInsights, type UserListeningData }; 