import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 32px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
`;

const Header = styled.div`
  margin-bottom: 32px;

  h2 {
    font-size: 28px;
    margin-bottom: 12px;
    background: linear-gradient(to right, #1ed760, #1db954);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    color: #b3b3b3;
    font-size: 16px;
    line-height: 1.6;
  }
`;

const InputContainer = styled.div`
  margin-bottom: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1ed760;
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const GenerateButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: #1ed760;
  color: black;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #1fdf64;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #1ed76050;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ff5555;
  background: rgba(255, 85, 85, 0.1);
  padding: 16px;
  border-radius: 12px;
  margin: 16px 0;
  font-size: 14px;
`;

const PlaylistPreview = styled(motion.div)`
  margin-top: 32px;
  padding: 24px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    font-size: 20px;
    margin-bottom: 16px;
    color: #1ed760;
  }
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TrackItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }

  .track-info {
    flex: 1;
    h4 {
      margin: 0;
      font-size: 14px;
      color: white;
    }
    p {
      margin: 4px 0 0;
      font-size: 12px;
      color: #b3b3b3;
    }
  }
`;

interface MoodPlaylistProps {
  spotify: SpotifyWebApi.SpotifyWebApiJs;
  topTracks: SpotifyApi.TrackObjectFull[];
}

const GENRE_SEEDS: Record<string, string> = {
  'workout': 'work-out',
  'mood': 'mood',
  'party': 'party',
  'chill': 'chill',
  'focus': 'focus',
  'sleep': 'sleep',
  'indie': 'indie',
  'rock': 'rock',
  'pop': 'pop',
  'hip-hop': 'hip-hop',
  'dance': 'dance',
  'electronic': 'electronic',
  'jazz': 'jazz',
  'classical': 'classical',
  'metal': 'metal',
  'soul': 'soul',
  'blues': 'blues',
  'punk': 'punk',
  'country': 'country',
  'folk': 'folk'
};

export default function MoodPlaylist({ spotify, topTracks }: MoodPlaylistProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [playlist, setPlaylist] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      // 1. Get all browse categories
      const browseCategoriesResponse = await spotify.getCategories({
        limit: 50,
        country: 'US'
      });

      console.log('Available categories:', browseCategoriesResponse.categories.items);

      // 2. Find matching category
      const searchTerm = prompt.toLowerCase().trim();
      const matchingCategory = browseCategoriesResponse.categories.items.find(category => 
        category.name.toLowerCase().includes(searchTerm) ||
        searchTerm.includes(category.name.toLowerCase())
      );

      if (!matchingCategory) {
        const categories = browseCategoriesResponse.categories.items
          .map(cat => cat.name)
          .join(', ');
        throw new Error(`Try one of these categories: ${categories}`);
      }

      console.log('Found matching category:', matchingCategory.name);

      // 3. Get playlists from this category
      const categoryPlaylists = await spotify.getCategoryPlaylists(matchingCategory.id, {
        limit: 10,
        country: 'US'
      });

      if (!categoryPlaylists.playlists.items.length) {
        throw new Error('No playlists found in this category');
      }

      // 4. Get tracks from top playlists
      const allTracks: SpotifyApi.TrackObjectFull[] = [];
      
      for (const playlist of categoryPlaylists.playlists.items.slice(0, 3)) {
        try {
          console.log('Getting tracks from playlist:', playlist.name);
          const playlistTracks = await spotify.getPlaylistTracks(playlist.id, {
            limit: 50,
            market: 'US'
          });
          
          playlistTracks.items.forEach(item => {
            if (item.track && !item.track.is_local && 'id' in item.track) {
              allTracks.push(item.track as SpotifyApi.TrackObjectFull);
            }
          });
        } catch (error) {
          console.error('Error getting playlist tracks:', error);
        }
      }

      if (allTracks.length === 0) {
        throw new Error('No tracks found in the playlists');
      }

      // 5. Remove duplicates and sort by popularity
      const uniqueTracks = Array.from(new Set(allTracks.map(track => track.id)))
        .map(id => allTracks.find(track => track.id === id))
        .filter(track => track && track.popularity > 30) as SpotifyApi.TrackObjectFull[];

      const selectedTracks = uniqueTracks
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20);

      console.log(`Selected ${selectedTracks.length} tracks from ${matchingCategory.name}`);
      setPlaylist(selectedTracks);

    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'Could not generate playlist. Please try again');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to get audio features based on the search term
  const getAudioFeatures = (term: string): Record<string, number> => {
    const params: Record<string, number> = {
      min_popularity: 50
    };

    if (term.includes('workout') || term.includes('energetic')) {
      params.target_energy = 0.8;
      params.min_energy = 0.7;
      params.target_tempo = 130;
    }
    else if (term.includes('chill') || term.includes('relax')) {
      params.target_energy = 0.4;
      params.max_energy = 0.6;
      params.target_valence = 0.5;
    }
    else if (term.includes('focus') || term.includes('study')) {
      params.target_energy = 0.5;
      params.target_instrumentalness = 0.3;
      params.max_speechiness = 0.3;
    }
    else if (term.includes('party') || term.includes('dance')) {
      params.target_energy = 0.8;
      params.min_danceability = 0.7;
      params.target_valence = 0.8;
    }
    else if (term.includes('sleep')) {
      params.target_energy = 0.3;
      params.max_energy = 0.4;
      params.target_instrumentalness = 0.5;
    }

    return params;
  };

  return (
    <Container>
      <Header>
        <h2>Mood Playlist Generator</h2>
        <p>Describe the vibe you're looking for and we'll create a playlist for you</p>
      </Header>

      <InputContainer>
        <Input
          placeholder="Enter a category (e.g., 'workout', 'party', 'focus', 'sleep', 'chill')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
        />
      </InputContainer>

      <GenerateButton
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Playlist'}
      </GenerateButton>

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      {playlist.length > 0 && (
        <PlaylistPreview
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Your Generated Playlist</h3>
          <TrackListComponent tracks={playlist} />
        </PlaylistPreview>
      )}
    </Container>
  );
}

// Helper function to enhance search query
const enhanceSearchQuery = (prompt: string) => {
  const terms = [];
  const lowercasePrompt = prompt.toLowerCase();

  // Add mood-based terms
  if (lowercasePrompt.includes('workout') || lowercasePrompt.includes('energetic')) {
    terms.push('workout', 'energy');
  } 
  if (lowercasePrompt.includes('chill') || lowercasePrompt.includes('relax')) {
    terms.push('chill', 'relax');
  }
  if (lowercasePrompt.includes('study') || lowercasePrompt.includes('focus')) {
    terms.push('study', 'focus');
  }
  if (lowercasePrompt.includes('party') || lowercasePrompt.includes('dance')) {
    terms.push('party', 'dance');
  }

  // Add genre terms if present
  if (lowercasePrompt.includes('rock')) terms.push('rock');
  if (lowercasePrompt.includes('pop')) terms.push('pop');
  if (lowercasePrompt.includes('hip hop') || lowercasePrompt.includes('rap')) terms.push('rap');
  if (lowercasePrompt.includes('indie')) terms.push('indie');

  // Combine original prompt with enhanced terms
  return `${prompt} ${terms.join(' ')}`;
};

// Update the TrackList component
const TrackListComponent = ({ tracks }: { tracks: SpotifyApi.TrackObjectFull[] }) => (
  <TrackList>
    {tracks.map((track, index) => (
      <TrackItem key={track.id}>
        <span style={{ color: '#b3b3b3', width: '20px' }}>{index + 1}</span>
        <img src={track.album.images[2]?.url} alt={track.name} />
        <div className="track-info">
          <h4>{track.name}</h4>
          <p>{track.artists[0]?.name}</p>
        </div>
      </TrackItem>
    ))}
  </TrackList>
); 