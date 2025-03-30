'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TopTracks from './TopTracks';
import TopArtists from './TopArtists';
import RecentlyPlayed from './RecentlyPlayed';
import UserProfile from './UserProfile';
import SpotifyWebApi from 'spotify-web-api-js';
import { useRouter } from 'next/navigation';
import PlaylistSection from './PlaylistSection';
import CurrentlyPlaying from './CurrentlyPlaying';
import TopGenres from './TopGenres';
import MoodAnalysis from './MoodAnalysis';
import AIPlaylistGenerator from './AIPlaylistGenerator';
import TasteEvolution from './TasteEvolution';
import AIInsights from './AIInsights';
import { motion } from 'framer-motion';
import MoodPlaylist from './MoodPlaylist';
import Layout from './Layout';
import { SpotifyUser } from '../types/spotify';
import { SpotifyPlayerProvider } from '../context/SpotifyPlayerContext';
import { toast } from 'react-hot-toast';
import TimeRangeButton from './TimeRangeButton';

const DashboardContainer = styled.div`
  padding: 30px;
  background: linear-gradient(to bottom, #1e1e1e, #121212);
  color: white;
  min-height: 100vh;
  font-family: var(--font-circular), -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
`;

const Container = styled.div`
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const SignOutButton = styled.button`
  background: transparent;
  color: #b3b3b3;
  border: 1px solid #b3b3b3;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: white;
    border-color: white;
    transform: scale(1.04);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin: 24px 0;
  max-width: 1400px;
  margin: 0 auto;
`;

const StatsCard = styled.div`
  padding: 20px 24px;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.1);
  }

  h2 {
    font-size: 22px;
    margin-bottom: 20px;
    color: #fff;
    font-weight: 700;
  }

  &[data-type="recently-played"] {
    height: 100%;
  }
`;

const Title = styled.h1`
  font-family: var(--font-circular), -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(to right, #1ed760, #1db954);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TimeRangeContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const TabContainer = styled.div`
  margin: 20px 0 32px;
`;

const TabList = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
    gap: 8px;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  background: ${props => props.$active ? '#1ed760' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? 'black' : 'white'};
  border: none;
  cursor: pointer;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 14px;
  }
`;

type TabType = 'overview' | 'ai-insights' | 'recommendations' | 'mood-playlist';

interface DashboardProps {
  spotify: SpotifyWebApi.SpotifyWebApiJs;
}

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #1ed760;
  animation: spin 1s linear infinite;
  margin: 100px auto;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #1e1e1e, #121212);
  color: white;

  h2 {
    margin-top: 20px;
    color: #b3b3b3;
    font-size: 16px;
    font-weight: 500;
  }
`;

// Update the ProfileSection styling
const ProfileSection = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  padding: 32px;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 32px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }

  &::after {
    content: '';
    position: absolute;
    width: 1px;
    top: 32px;
    bottom: 32px;
    left: 66.666%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), transparent);
  }
`;

// Update the StatsGrid styling
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 600px 1fr;
  gap: 20px;
  margin-bottom: 32px;
  max-width: 1400px;
  margin: 0 auto;
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

// Add InsightsContainer styled component
const InsightsContainer = styled.div`
  display: grid;
  gap: 24px;
  margin: 24px 0;
  max-width: 1400px;
  margin: 0 auto;

  > * {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    padding: 24px;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
  }
`;

const CurrentlyPlayingCard = styled(motion.div)`
  background: linear-gradient(90deg, rgba(30, 215, 96, 0.2), rgba(30, 215, 96, 0.05));
  padding: 24px 32px;
  border-radius: 24px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  border: 1px solid rgba(30, 215, 96, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at top right,
      rgba(30, 215, 96, 0.2),
      transparent 50%
    );
    pointer-events: none;
  }
`;

// Add this to ensure Recently Played card takes full height
const RecentlyPlayedWrapper = styled.div`
  height: calc(1224px); // 600px * 2 (for both sections) + 24px gap
  position: sticky;
  top: 32px;
`;

export default function Dashboard({ spotify }: DashboardProps) {
  const router = useRouter();
  const [userData, setUserData] = useState<SpotifyUser | null>(null);
  const [topTracks, setTopTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyApi.ArtistObjectFull[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<SpotifyApi.PlayHistoryObject[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
  const [currentTrack, setCurrentTrack] = useState<SpotifyApi.CurrentlyPlayingObject | null>(null);
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isTabLoading, setIsTabLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = spotify.getAccessToken();
        if (token) {
          spotify.setAccessToken(token);

          const response = await spotify.getMe();
          const userData = response as unknown as SpotifyUser;
          setUserData(userData);

          const [tracks, artists, recentTracks] = await Promise.all([
            spotify.getMyTopTracks(),
            spotify.getMyTopArtists(),
            spotify.getMyRecentlyPlayedTracks()
          ]);

          console.log('User account type:', userData.product);
          setTopTracks(tracks.items);
          setTopArtists(artists.items);
          setRecentlyPlayed(recentTracks.items);

          try {
            const playlistData = await spotify.getUserPlaylists();
            setPlaylists(playlistData?.items || []);
          } catch (error) {
            console.error('Error fetching playlists:', error);
            setPlaylists([]); // Set empty array on error
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [spotify]);

  useEffect(() => {
    const updateTimeRangeData = async () => {
      try {
        const [tracks, artists] = await Promise.all([
          spotify.getMyTopTracks({ time_range: timeRange, limit: 20 }),
          spotify.getMyTopArtists({ time_range: timeRange, limit: 20 })
        ]);
        
        setTopTracks(tracks.items);
        setTopArtists(artists.items);
      } catch (error) {
        console.error('Error updating time range data:', error);
      }
    };

    if (spotify.getAccessToken()) {
      updateTimeRangeData();
    }
  }, [timeRange, spotify]);

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        const user = await spotify.getMe() as SpotifyUser;
        
        if (user.product !== 'premium') {
          toast.error('Spotify Premium is required for playback. Opening Spotify app instead.');
          return;
        }

        // Load the Spotify Web Playback SDK
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;

        script.onerror = () => {
          toast.error('Failed to load Spotify player. Please try again or use the Spotify app.');
        };

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
          const player = new window.Spotify.Player({
            name: 'VØDA Web Player',
            getOAuthToken: cb => { 
              const token = spotify.getAccessToken();
              if (token) {
                cb(token);
              } else {
                toast.error('Authentication error. Please sign in again.');
              }
            }
          });

          player.addListener('ready', ({ device_id }) => {
            console.log('Player ready with device ID', device_id);
            toast.success('Player connected successfully!');
          });

          player.addListener('not_ready', () => {
            toast.error('Player disconnected. Trying to reconnect...');
          });

          player.addListener('initialization_error', ({ message }) => {
            toast.error(`Player initialization failed: ${message}`);
          });

          player.addListener('authentication_error', () => {
            toast.error('Authentication failed. Please sign in again.');
          });

          player.addListener('account_error', () => {
            toast.error('Premium required for playback. Opening Spotify app instead.');
          });

          player.connect();
        };
      } catch (error) {
        console.error('Player initialization error:', error);
        toast.error('Failed to initialize player. Please try again.');
      }
    };

    initializePlayer();
  }, [spotify]);

  const handleSignOut = () => {
    localStorage.removeItem('spotify_token');
    // Clear all other stored data
    localStorage.removeItem('spotify_token_timestamp');
    localStorage.removeItem('spotify_refresh_token');
    // Force reload to clear React state
    window.location.href = '/';
  };

  const handleTabChange = async (tab: TabType) => {
    setIsTabLoading(true);
    setActiveTab(tab);
    // Add a small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsTabLoading(false);
  };

  const renderTabContent = () => {
    if (isTabLoading) {
      return (
        <LoadingContainer style={{ minHeight: 'auto', padding: '40px 0' }}>
          <LoadingSpinner />
        </LoadingContainer>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentTrack && (
              <CurrentlyPlayingCard
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CurrentlyPlaying track={currentTrack} />
              </CurrentlyPlayingCard>
            )}
            
            <ProfileSection>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {userData && <UserProfile user={userData} />}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <TopGenres artists={topArtists} />
              </motion.div>
            </ProfileSection>

            <TimeRangeContainer>
              <TimeRangeButton $active={timeRange === 'short_term'} onClick={() => setTimeRange('short_term')}>Last Month</TimeRangeButton>
              <TimeRangeButton $active={timeRange === 'medium_term'} onClick={() => setTimeRange('medium_term')}>Last 6 Months</TimeRangeButton>
              <TimeRangeButton $active={timeRange === 'long_term'} onClick={() => setTimeRange('long_term')}>All Time</TimeRangeButton>
            </TimeRangeContainer>

            <StatsGrid>
              <MainColumn>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <StatsCard>
                    <TopTracks tracks={topTracks} timeRange={timeRange} />
                  </StatsCard>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <StatsCard>
                    <TopArtists artists={topArtists} timeRange={timeRange} />
                  </StatsCard>
                </motion.div>
              </MainColumn>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <RecentlyPlayedWrapper>
                  <StatsCard 
                    style={{ height: '100%' }}
                    data-type="recently-played"
                  >
                    <RecentlyPlayed tracks={recentlyPlayed} />
                  </StatsCard>
                </RecentlyPlayedWrapper>
              </motion.div>
            </StatsGrid>
          </motion.div>
        );
      
      case 'ai-insights':
        return (
          <InsightsContainer>
            <TimeRangeContainer>
              <TimeRangeButton $active={timeRange === 'short_term'} onClick={() => setTimeRange('short_term')}>Last Month</TimeRangeButton>
              <TimeRangeButton $active={timeRange === 'medium_term'} onClick={() => setTimeRange('medium_term')}>Last 6 Months</TimeRangeButton>
              <TimeRangeButton $active={timeRange === 'long_term'} onClick={() => setTimeRange('long_term')}>All Time</TimeRangeButton>
            </TimeRangeContainer>
            <AIInsights 
              topTracks={topTracks}
              topArtists={topArtists}
              genres={Array.from(new Set(topArtists.flatMap(artist => artist.genres || [])))}
            />
            <MoodAnalysis tracks={topTracks} />
            <TasteEvolution 
              historicalData={{
                short_term: { tracks: topTracks, artists: topArtists },
                medium_term: { tracks: topTracks, artists: topArtists },
                long_term: { tracks: topTracks, artists: topArtists }
              }} 
            />
          </InsightsContainer>
        );
      
      case 'recommendations':
        console.log('Spotify instance before passing:', !!spotify, spotify.getAccessToken());
        return (
          <InsightsContainer>
            <AIPlaylistGenerator 
              topTracks={topTracks}
              recentTracks={recentlyPlayed}
              spotify={spotify}
            />
          </InsightsContainer>
        );
      
      case 'mood-playlist':
        // Verify token
        const token = spotify.getAccessToken();
        console.log('Token before MoodPlaylist:', token ? 'Present' : 'Missing');
        
        return (
          <InsightsContainer>
            <MoodPlaylist 
              spotify={spotify}
              topTracks={topTracks}
            />
          </InsightsContainer>
        );
    }
  };

  const showTimeRangeForTab = (tab: TabType) => {
    return tab === 'overview' || tab === 'ai-insights';
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <h2>Loading your Spotify data...</h2>
      </LoadingContainer>
    );
  }

  return (
    <SpotifyPlayerProvider spotify={spotify}>
      <Layout 
        showTimeRange={showTimeRangeForTab(activeTab)}
        timeRange={timeRange}
        onTimeRangeChange={(range) => setTimeRange(range as 'short_term' | 'medium_term' | 'long_term')}
        onSignOut={handleSignOut}
        activeTab={activeTab}
        onTabChange={(tab) => handleTabChange(tab as TabType)}
      >
        {renderTabContent()}
        <PlaylistSection playlists={playlists} />
      </Layout>
    </SpotifyPlayerProvider>
  );
} 