import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { mood, topTracks, recentTracks } = await request.json();

    // Format user's music preferences
    const userTopArtists = [...new Set(topTracks.map((track: SpotifyApi.TrackObjectFull) => track.artists[0].name))].slice(0, 5);
    const userTopGenres = [...new Set(topTracks.flatMap((track: any) => track.artists[0].genres || []))].slice(0, 5);
    const recentArtists = [...new Set(recentTracks.map((track: any) => track.track.artists[0].name))].slice(0, 5);

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent(`
      You are a music expert creating a personalized playlist. Let's analyze the user's taste:
      
      LISTENING PROFILE:
      - Favorite Artists: ${userTopArtists.join(', ')}
      - Top Genres: ${userTopGenres.join(', ')}
      - Recent Listens: ${recentArtists.join(', ')}
      
      MOOD ANALYSIS: "${mood}"
      Create a deeply personalized playlist of EXACTLY 20 songs that capture this mood.
      
      PLAYLIST COMPOSITION:
      1. Core Favorites (30%):
         - Songs from their favorite artists that match the mood
         - Focus on less obvious tracks that fit the emotion
      
      2. Genre Matches (30%):
         - Songs from similar artists in their preferred genres
         - Must maintain the emotional tone of the mood
      
      3. Mood-Based Discoveries (40%):
         - Hidden gems and new releases that perfectly match the mood
         - Artists they might love based on their taste
         - Mix of mainstream and underground selections
      
      IMPORTANT RULES:
      1. Every song MUST match the "${mood}" mood
      2. Provide EXACTLY 20 songs
      3. Format each song exactly as: Song Name | Artist Name
      4. Be extremely precise with spelling and artist names
      5. Include a mix of eras and styles while maintaining mood cohesion
      6. Avoid the most obvious/overplayed songs unless they're perfect for the mood
      
      RESPONSE FORMAT:
      Song Name | Artist Name
      (one per line, exactly 20 lines)
    `);
    
    const text = result.response.text();
    
    const suggestions = text
      .split('\n')
      .filter(line => line.includes('|'))
      .map(line => line.trim());

    if (suggestions.length === 0) {
      throw new Error('No valid song suggestions received');
    }

    return Response.json({ suggestions });
  } catch (error) {
    console.error('Error in getSongSuggestions:', error);
    return Response.json(
      { error: 'Failed to get song suggestions. Please try again.' }, 
      { status: 500 }
    );
  }
} 