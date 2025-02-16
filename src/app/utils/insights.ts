async function generateMusicInsights(userData: UserListeningData) {
  const prompt = `Analyze this user's music taste:
    Top Genres: ${userData.topGenres.join(', ')}
    Favorite Artists: ${userData.topArtists.map(a => a.name).join(', ')}
    Average Song Metrics: ${JSON.stringify(userData.averageMetrics)}
  `;
  
  // Use GPT to generate personalized insights
  const completion = await openai.createCompletion({
    model: "gpt-4",
    prompt,
    max_tokens: 200
  });

  return completion.choices[0].text;
} 