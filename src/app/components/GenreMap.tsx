interface GenreNode {
  id: string;
  group: number;
  value: number;
}

interface GenreLink {
  source: string;
  target: string;
  value: number;
}

function createGenreNetwork(artists: SpotifyApi.ArtistObjectFull[]) {
  // Create force-directed graph of related genres
  const nodes: GenreNode[] = [];
  const links: GenreLink[] = [];
  
  // Use D3.js for visualization
} 