interface SongVector {
  danceability: number;
  energy: number;
  valence: number;
  tempo: number;
  [key: string]: number;
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

function calculateSimilarity(song1: SongVector, song2: SongVector): number {
  return cosineSimilarity(
    Object.values(song1),
    Object.values(song2)
  );
}

function findSimilarSongs(track: SongVector, catalog: SongVector[]) {
  return catalog
    .map(song => ({
      song,
      similarity: calculateSimilarity(track, song)
    }))
    .sort((a, b) => b.similarity - a.similarity);
}

export { calculateSimilarity, findSimilarSongs, type SongVector }; 