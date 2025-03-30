'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { generatePlaylistDescription } from '../utils/groq';
import SpotifyWebApi from 'spotify-web-api-js';

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

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const Option = styled.button<{ $selected: boolean }>`
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${props => props.$selected ? '#1ed760' : 'rgba(255, 255, 255, 0.1)'};
  background: ${props => props.$selected ? 'rgba(30, 215, 96, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.$selected ? '#1ed760' : '#fff'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    transform: translateY(-2px);
    border-color: #1ed760;
  }

  h3 {
    font-size: 16px;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #b3b3b3;
    margin: 0;
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
  margin-top: 24px;

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

const ErrorMessage = styled.div`
  color: #ff5555;
  background: rgba(255, 85, 85, 0.1);
  padding: 16px;
  border-radius: 12px;
  margin: 16px 0;
  font-size: 14px;
`;

const SettingsContainer = styled.div`
  margin: 24px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const Slider = styled.input`
  width: 200px;
  -webkit-appearance: none;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #1ed760;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

interface PlaylistSuggestion {
  name: string;
  description: string;
  tracks: SpotifyApi.TrackObjectFull[];
  mood: string;
}

interface AIPlaylistGeneratorProps {
  topTracks: SpotifyApi.TrackObjectFull[];
  recentTracks: SpotifyApi.PlayHistoryObject[];
  spotify: SpotifyWebApi.SpotifyWebApiJs;
}

interface PlaylistSettings {
  trackCount: number;
  familiarRatio: number; // 0-1, percentage of familiar songs
}

const SPOTIFY_GENRE_MAP: Record<string, string> = {
  'pop': 'pop',
  'hiphop': 'hip-hop',
  'rock': 'rock',
  'indie': 'indie',
};

const getTrackFeatures = async (spotify: SpotifyWebApi.SpotifyWebApiJs, trackIds: string[]) => {
  const features = await spotify.getAudioFeaturesForTracks(trackIds);
  return features.audio_features;
};

const getMoodParameters = (mood: string) => {
  switch (mood) {
    case 'energetic':
      return { 
        target_energy: 0.8,
        target_valence: 0.7,
        target_danceability: 0.7,
        min_energy: 0.6
      };
    case 'chill':
      return { 
        target_energy: 0.4,
        target_valence: 0.5,
        target_danceability: 0.4,
        max_energy: 0.6
      };
    case 'focus':
      return { 
        target_energy: 0.5,
        target_instrumentalness: 0.3,
        target_valence: 0.5,
        max_danceability: 0.6
      };
    case 'party':
      return { 
        target_energy: 0.8,
        target_danceability: 0.8,
        target_valence: 0.8,
        min_danceability: 0.6
      };
    default:
      return {};
  }
};

const getArtistsGenres = async (spotify: SpotifyWebApi.SpotifyWebApiJs, artistIds: string[]) => {
  const artists = await spotify.getArtists(artistIds);
  return artists.artists.reduce((acc, artist) => {
    acc[artist.id] = artist.genres || [];
    return acc;
  }, {} as Record<string, string[]>);
};

export default function AIPlaylistGenerator({ 
  topTracks, 
  recentTracks, 
  spotify 
}: AIPlaylistGeneratorProps) {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [settings, setSettings] = useState<PlaylistSettings>({
    trackCount: 10,
    familiarRatio: 0.6 // 60% familiar songs by default
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [playlist, setPlaylist] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [error, setError] = useState<string | null>(null);

  const moods = [
    { id: 'energetic', name: 'Energetic', description: 'High-energy, upbeat tracks' },
    { id: 'chill', name: 'Chill', description: 'Relaxed, laid-back vibes' },
    { id: 'focus', name: 'Focus', description: 'Perfect for concentration' },
    { id: 'party', name: 'Party', description: 'Dance and celebration' }
  ];

  const genres = [
    { id: 'pop', name: 'Pop', description: 'Modern pop hits' },
    { id: 'hiphop', name: 'Hip Hop', description: 'Rap and hip hop tracks' },
    { id: 'rock', name: 'Rock', description: 'Classic and modern rock' },
    { id: 'indie', name: 'Indie', description: 'Independent and alternative' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // First verify the spotify instance and token
      if (!spotify) {
        throw new Error('Spotify instance not available');
      }

      const token = spotify.getAccessToken();
      console.log('Current token:', token ? 'exists' : 'missing');

      if (!token) {
        throw new Error('No access token available');
      }

      // Verify token is valid with a simple API call
      try {
        await spotify.getMe();
        console.log('Token is valid');
      } catch (tokenError) {
        console.error('Token validation error:', tokenError);
        throw new Error('Please refresh the page and try again');
      }

      // Verify we have tracks to use as seeds
      if (!topTracks || topTracks.length === 0) {
        throw new Error('No tracks available for recommendations');
      }

      console.log('Available seed tracks:', topTracks.length);

      // Use first track as seed
      const seedTrack = topTracks[0].id;
      console.log('Using seed track:', seedTrack, '- Track name:', topTracks[0].name);

      // Make a very simple recommendation request
      const recommendations = await spotify.getRecommendations({
        seed_tracks: [seedTrack],
        limit: 5  // Start with just 5 tracks to test
      }).catch(recError => {
        console.error('Full recommendation error:', recError);
        throw new Error('Failed to get recommendations');
      });

      if (!recommendations.tracks || recommendations.tracks.length === 0) {
        throw new Error('No recommendations received');
      }

      console.log('Received recommendations:', recommendations.tracks.length);
      
      // Set as playlist
      setPlaylist(recommendations.tracks as unknown as SpotifyApi.TrackObjectFull[]);
      console.log('Playlist updated successfully');

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Generation failed:', message);
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Container>
      <Header>
        <h2>AI Playlist Generator</h2>
        <p>Create personalized playlists based on your music taste and preferences</p>
      </Header>

      <h3>Select Mood</h3>
      <OptionsGrid>
        {moods.map(mood => (
          <Option
            key={mood.id}
            $selected={selectedMood === mood.id}
            onClick={() => setSelectedMood(mood.id)}
          >
            <h3>{mood.name}</h3>
            <p>{mood.description}</p>
          </Option>
        ))}
      </OptionsGrid>

      <h3>Select Genre</h3>
      <OptionsGrid>
        {genres.map(genre => (
          <Option
            key={genre.id}
            $selected={selectedGenre === genre.id}
            onClick={() => setSelectedGenre(genre.id)}
          >
            <h3>{genre.name}</h3>
            <p>{genre.description}</p>
          </Option>
        ))}
      </OptionsGrid>

      <SettingsContainer>
        <h3>Playlist Settings</h3>
        <SettingRow>
          <label>Number of Songs: {settings.trackCount}</label>
          <Slider
            type="range"
            min="5"
            max="20"
            value={settings.trackCount}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              trackCount: parseInt(e.target.value)
            }))}
          />
        </SettingRow>
        <SettingRow>
          <label>Familiar Songs: {Math.round(settings.familiarRatio * 100)}%</label>
          <Slider
            type="range"
            min="0"
            max="100"
            value={settings.familiarRatio * 100}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              familiarRatio: parseInt(e.target.value) / 100
            }))}
          />
        </SettingRow>
      </SettingsContainer>

      <GenerateButton
        onClick={handleGenerate}
        disabled={!selectedMood || !selectedGenre || isGenerating}
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
          <TrackList tracks={playlist} />
        </PlaylistPreview>
      )}
    </Container>
  );
}

// Add a simple TrackList component
const TrackList = ({ tracks }: { tracks: SpotifyApi.TrackObjectFull[] }) => (
  <div>
    {tracks.map((track, index) => (
      <TrackItem key={track.id}>
        <span>{index + 1}</span>
        <img src={track.album.images[2]?.url} alt={track.name} />
        <div>
          <h4>{track.name}</h4>
          <p>{track.artists[0]?.name}</p>
        </div>
      </TrackItem>
    ))}
  </div>
);

const TrackItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 8px;

  span {
    color: #b3b3b3;
    font-size: 14px;
    width: 20px;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }

  h4 {
    margin: 0;
    font-size: 14px;
  }

  p {
    margin: 4px 0 0;
    font-size: 12px;
    color: #b3b3b3;
  }
`;

// Helper functions
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const meetsParameters = (features: SpotifyApi.AudioFeaturesObject, params: any): boolean => {
  for (const [key, value] of Object.entries(params)) {
    const featureKey = key.replace('min', '').replace('max', '').toLowerCase();
    const featureValue = features[featureKey as keyof SpotifyApi.AudioFeaturesObject];
    
    if (typeof featureValue !== 'number') continue;
    if (key.startsWith('min') && featureValue < (value as number)) return false;
    if (key.startsWith('max') && featureValue > (value as number)) return false;
  }
  return true;
} 