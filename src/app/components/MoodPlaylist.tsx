import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SpotifyWebApi from 'spotify-web-api-js';
import { motion } from 'framer-motion';
import SpotifyPlayer from './SpotifyPlayer';

const Container = styled.div`
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  color: #1ed760;
  margin-bottom: 16px;
`;

const Description = styled.p`
  color: #b3b3b3;
  margin-bottom: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #1ed760;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: #1ed760;
  color: black;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #1db954;
    transform: scale(1.02);
  }

  &:disabled {
    background: #404040;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  margin-top: 12px;
  padding: 12px;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
`;

const PlaylistResult = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const SongCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 12px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;
  }
`;

const SongImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const SongInfo = styled.div`
  flex: 1;
  margin-right: 16px;
`;

const SongTitle = styled.h4`
  color: white;
  margin: 0 0 4px 0;
  font-size: 14px;
`;

const ArtistName = styled.p`
  color: #b3b3b3;
  margin: 0;
  font-size: 12px;
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  
  @media (max-width: 768px) {
  flex-direction: column;
  gap: 8px;
  }
`;

const AddButton = styled.button<{ $selected: boolean }>`
  background: ${props => props.$selected ? '#1ed760' : 'transparent'};
  color: ${props => props.$selected ? 'black' : '#1ed760'};
  border: 1px solid #1ed760;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const PreviewLink = styled.a`
  color: #b3b3b3;
  text-decoration: none;
  font-size: 13px;
  transition: all 0.2s ease;
  padding: 6px 12px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);

  &:hover {
    color: #1ed760;
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 4px 8px;
  }
`;

const SectionTitle = styled.h3`
  color: white;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SongSection = styled.div`
  margin-bottom: 32px;

  h4 {
    color: #b3b3b3;
      font-size: 14px;
    margin-bottom: 16px;
    font-weight: 500;
  }
`;

const PlaylistNameInput = styled(Input)`
  margin-top: 24px;
`;

const MoodTag = styled.span`
  background: rgba(30, 215, 96, 0.1);
  color: #1ed760;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const StatsBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const StatItem = styled.div`
  text-align: center;

  .value {
    font-size: 24px;
    font-weight: 600;
    color: #1ed760;
  }

  .label {
      font-size: 12px;
      color: #b3b3b3;
    margin-top: 4px;
  }
`;

interface MoodPlaylistProps {
  spotify: SpotifyWebApi.SpotifyWebApiJs;
  topTracks: SpotifyApi.TrackObjectFull[];
}

interface SongSuggestion {
  name: string;
  artist: string;
  spotifyId: string;
  uri: string;
  previewUrl: string | null;
  selected: boolean;
  externalUrl: string;
  imageUrl: string;
  popularity: number;
  relevanceScore: number;
}

export default function MoodPlaylist({ spotify, topTracks }: MoodPlaylistProps) {
  const [mood, setMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [playlist, setPlaylist] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<SongSuggestion[]>([]);
  const [playlistName, setPlaylistName] = useState('');
  const [recentTracks, setRecentTracks] = useState<SpotifyApi.PlayHistoryObject[]>([]);

  useEffect(() => {
    const fetchRecentTracks = async () => {
      try {
        const response = await spotify.getMyRecentlyPlayedTracks({ limit: 50 });
        setRecentTracks(response.items);
      } catch (error) {
        console.error('Error fetching recent tracks:', error);
      }
    };

    fetchRecentTracks();
  }, [spotify]);

  const getSongSuggestionsFromAI = async (mood: string) => {
    try {
      const response = await fetch('/api/getSongSuggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          mood,
          topTracks,
          recentTracks,
          prompt: `Suggest songs that match the mood: "${mood}". 
                  Return them in this exact format:
                  Song Name | Artist Name`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI suggestions');
      }
      
      const data = await response.json();
      if (!data.suggestions || data.suggestions.length === 0) {
        throw new Error('No song suggestions received');
      }

      return data.suggestions.map((suggestion: string) => {
        const [name, artist] = suggestion.split('|').map(s => s.trim());
        if (!name || !artist) {
          throw new Error('Invalid song suggestion format');
        }
        return { name, artist };
      });
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      throw error;
    }
  };

  const calculateRelevanceScore = (track: SpotifyApi.TrackObjectFull | SpotifyApi.RecommendationTrackObject) => {
    let score = 0;
    
    if (topTracks.some(t => t.artists[0].id === track.artists[0].id)) {
      score += 5;
    }

    if (recentTracks.some(t => t.track.artists[0].id === track.artists[0].id)) {
      score += 3;
    }

    score += (track.popularity / 100);

    return score;
  };

  const findSpotifyTracks = async (suggestions: SongSuggestion[]) => {
    console.log('Processing suggestions:', suggestions.length);
    
    const tracksWithIds = await Promise.all(
      suggestions.map(async (suggestion, index) => {
        try {
          // Try exact match first
          let searchResult = await spotify.searchTracks(
            `track:"${suggestion.name}" artist:"${suggestion.artist}"`
          );

          // If no results, try a more lenient search
          if (searchResult.tracks.items.length === 0) {
            const cleanedTrackName = suggestion.name.replace(/[^\w\s]/g, '');
            const cleanedArtistName = suggestion.artist.replace(/[^\w\s]/g, '');
            
            searchResult = await spotify.searchTracks(
              `${cleanedTrackName} ${cleanedArtistName}`
            );
          }
          
          if (searchResult.tracks.items.length > 0) {
            // Find the best matching track
            const bestMatch = searchResult.tracks.items.find(track => 
              track.artists.some(artist => 
                artist.name.toLowerCase().includes(suggestion.artist.toLowerCase()) ||
                suggestion.artist.toLowerCase().includes(artist.name.toLowerCase())
              )
            ) || searchResult.tracks.items[0];

            const relevanceScore = calculateRelevanceScore(bestMatch);
            
            return {
              name: bestMatch.name,
              artist: bestMatch.artists[0].name,
              spotifyId: bestMatch.id,
              uri: bestMatch.uri,
              previewUrl: bestMatch.preview_url,
              externalUrl: bestMatch.external_urls.spotify,
              imageUrl: bestMatch.album.images[0]?.url || '',
              popularity: bestMatch.popularity,
              relevanceScore,
              selected: relevanceScore > 5
            } as SongSuggestion & { relevanceScore: number };
          }
          return null;
        } catch (error) {
          console.error(`Error searching for track: ${suggestion.name}`, error);
          return null;
        }
      })
    );

    const validTracks = tracksWithIds
      .filter((track): track is (SongSuggestion & { relevanceScore: number }) => track !== null)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // If we have too few tracks, try to get recommendations based on the ones we found
    if (validTracks.length < 15) {
      try {
        const seedTracks = validTracks.slice(0, 5).map(track => track.spotifyId);
        
        const recommendations = await spotify.getRecommendations({
          seed_tracks: seedTracks,
          target_valence: mood.toLowerCase().includes('happy') ? 0.8 : 
                         mood.toLowerCase().includes('sad') ? 0.2 : 0.5,
          target_energy: mood.toLowerCase().includes('party') || 
                        mood.toLowerCase().includes('energetic') ? 0.8 : 0.5,
          limit: 20 - validTracks.length
        });

        const additionalTracks = recommendations.tracks.map(track => ({
          name: track.name,
          artist: track.artists[0].name,
          spotifyId: track.id,
          uri: track.uri,
          previewUrl: track.preview_url,
          externalUrl: track.external_urls.spotify,
          imageUrl: track.album.images[0]?.url || '',
          popularity: track.popularity,
          relevanceScore: calculateRelevanceScore(track),
          selected: false
        }));

        return [...validTracks, ...additionalTracks]
          .sort((a, b) => b.relevanceScore - a.relevanceScore);
      } catch (error) {
        console.error('Error getting recommendations:', error);
      }
    }

    return validTracks;
  };

  const toggleSongSelection = (index: number) => {
    setSuggestions(prev => 
      prev.map((song, i) => 
        i === index ? { ...song, selected: !song.selected } : song
      )
    );
  };

  const generatePlaylist = async () => {
    if (!mood.trim()) {
      setError('Please enter a mood description');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuggestions([]);

    try {
      console.log('Getting AI suggestions...');
      const aiSuggestions = await getSongSuggestionsFromAI(mood);
      console.log('AI suggestions received:', aiSuggestions.length);
      
      let tracksWithIds = await findSpotifyTracks(aiSuggestions);
      console.log('Initial tracks found on Spotify:', tracksWithIds.length);

      // If we still don't have enough tracks, try another AI suggestion round
      if (tracksWithIds.length < 15) {
        console.log('Getting more AI suggestions...');
        const moreSuggestions = await getSongSuggestionsFromAI(
          `${mood} (alternative songs, different from: ${
            tracksWithIds.map(t => `${t.name} by ${t.artist}`).join(', ')
          })`
        );
        
        const moreTracks = await findSpotifyTracks(moreSuggestions);
        tracksWithIds = [...tracksWithIds, ...moreTracks]
          .filter((track, index, self) => 
            index === self.findIndex(t => t.spotifyId === track.spotifyId)
          )
          .sort((a, b) => b.relevanceScore - a.relevanceScore);
      }

      if (tracksWithIds.length === 0) {
        throw new Error('No matching tracks found on Spotify');
      }

      console.log('Final tracks count:', tracksWithIds.length);
      setSuggestions(tracksWithIds);
    } catch (err) {
      console.error('Error generating suggestions:', err);
      setError('Could not generate suggestions. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const checkToken = async () => {
    try {
      await spotify.getMe();
    } catch (error) {
      localStorage.removeItem('spotify_token');
      window.location.href = '/';
      throw new Error('Session expired. Please login again.');
    }
  };

  const createPlaylist = async () => {
    if (!playlistName.trim()) {
      setError('Please enter a playlist name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let user;
      try {
        user = await spotify.getMe();
        console.log('Current user:', user);
      } catch (error: any) {
        console.error('Error getting user:', error);
        if (error.status === 401) {
          localStorage.removeItem('spotify_token');
          window.location.href = '/';
          return;
        }
        throw new Error('Failed to get user information');
      }

      const selectedTracks = suggestions.filter(track => track.selected);
      console.log('Selected tracks:', selectedTracks);
      
      if (selectedTracks.length === 0) {
        throw new Error('Please select at least one song');
      }

      console.log('Creating playlist...');
      const playlistData = {
        name: playlistName,
        description: `AI-curated playlist for mood: ${mood}`,
        public: false
      };
      console.log('Playlist data:', playlistData);

      const playlistResponse = await spotify.createPlaylist(user.id, playlistData);
      console.log('Playlist created:', playlistResponse);

      if (!playlistResponse || !playlistResponse.id) {
        throw new Error('Failed to create playlist');
      }

      const trackUris = selectedTracks.map(track => track.uri);
      console.log('Adding tracks:', trackUris);

      await spotify.addTracksToPlaylist(
        playlistResponse.id,
        trackUris
      );
      console.log('Tracks added successfully');

      setPlaylist(playlistResponse);
    } catch (error: any) {
      console.error('Full error object:', error);
      
      let errorMessage = 'Could not create playlist';
      
      if (error.response) {
        console.error('API Error response:', error.response);
        errorMessage = error.response.error?.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (error.status === 401 || error.response?.status === 401) {
        localStorage.removeItem('spotify_token');
        window.location.href = '/';
        return;
      }

      setError(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>AI Mood Playlist Generator</Title>
      <Description>
        Describe your mood or the vibe you're looking for, and our AI will curate the perfect playlist
      </Description>
      
        <Input
        type="text"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="e.g., 'feeling nostalgic about the 90s', 'need motivation for workout'"
        disabled={isLoading}
      />
      
      <Button
        onClick={generatePlaylist}
        disabled={isLoading || !mood.trim()}
      >
        {isLoading ? 'Generating...' : 'GENERATE SUGGESTIONS'}
      </Button>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {suggestions.length > 0 && !playlist && (
        <>
          <PlaylistResult>
            <SectionTitle>
              🎵 AI Suggested Songs
              <MoodTag>{mood}</MoodTag>
            </SectionTitle>

            <StatsBar>
              <StatItem>
                <div className="value">{suggestions.length}</div>
                <div className="label">Songs Found</div>
              </StatItem>
              <StatItem>
                <div className="value">
                  {suggestions.filter(s => s.selected).length}
                </div>
                <div className="label">Selected</div>
              </StatItem>
              <StatItem>
                <div className="value">
                  {Math.round(suggestions.reduce((acc, song) => acc + song.popularity, 0) / suggestions.length)}%
                </div>
                <div className="label">Avg. Popularity</div>
              </StatItem>
            </StatsBar>

            <SongSection>
              <h4>Recommended Picks</h4>
              {suggestions.slice(0, Math.ceil(suggestions.length / 2)).map((song, index) => (
                <SongCard 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <SongImage src={song.imageUrl} alt={`${song.name} album art`} />
                  <SongInfo>
                    <SongTitle>{song.name}</SongTitle>
                    <ArtistName>{song.artist}</ArtistName>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#b3b3b3', 
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>Popularity: {song.popularity}%</span>
                      {song.relevanceScore > 5 && (
                        <span style={{ color: '#1ed760' }}>
                          • Matches Your Taste
                        </span>
                      )}
                    </div>
                  </SongInfo>
                  <Controls>
                    <SpotifyPlayer 
                      trackUri={song.uri}
                      previewUrl={song.previewUrl}
                      externalUrl={song.externalUrl}
                      spotify={spotify}
                    />
                    <AddButton
                      $selected={!!song.selected}
                      onClick={() => toggleSongSelection(index)}
                    >
                      {song.selected ? '✓' : '+'}
                    </AddButton>
                  </Controls>
                </SongCard>
              ))}
            </SongSection>

            {suggestions.length > Math.ceil(suggestions.length / 2) && (
              <SongSection>
                <h4>More Options</h4>
                {suggestions.slice(Math.ceil(suggestions.length / 2)).map((song, index) => (
                  <SongCard 
                    key={index + Math.ceil(suggestions.length / 2)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: (index + Math.ceil(suggestions.length / 2)) * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <SongImage src={song.imageUrl} alt={`${song.name} album art`} />
                    <SongInfo>
                      <SongTitle>{song.name}</SongTitle>
                      <ArtistName>{song.artist}</ArtistName>
                    </SongInfo>
                    <Controls>
                      <SpotifyPlayer 
                        trackUri={song.uri}
                        previewUrl={song.previewUrl}
                        externalUrl={song.externalUrl}
                        spotify={spotify}
                      />
                      <AddButton
                        $selected={!!song.selected}
                        onClick={() => toggleSongSelection(index + Math.ceil(suggestions.length / 2))}
                      >
                        {song.selected ? '✓' : '+'}
                      </AddButton>
                    </Controls>
                  </SongCard>
                ))}
              </SongSection>
            )}
          </PlaylistResult>

          <PlaylistNameInput
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder={`${mood} Vibes`}
          />

          <Button
            onClick={createPlaylist}
            disabled={isLoading || !playlistName.trim() || suggestions.filter(s => s.selected).length === 0}
            style={{ marginTop: '16px' }}
          >
            Create Playlist with {suggestions.filter(s => s.selected).length} Songs
          </Button>
        </>
      )}

      {playlist && (
        <PlaylistResult>
          <h3>🎉 Playlist Created!</h3>
          <p>Name: {playlist.name}</p>
          <p>Tracks: {playlist.tracks?.total || suggestions.filter(s => s.selected).length}</p>
          <a 
            href={playlist.external_urls?.spotify} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#1ed760', textDecoration: 'none' }}
          >
            Open in Spotify →
          </a>
        </PlaylistResult>
      )}
    </Container>
  );
}