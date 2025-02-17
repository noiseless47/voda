'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpotifyPlayer } from '../context/SpotifyPlayerContext';

const Container = styled.div`
  padding: 0px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
  }
`;

const PlayButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1ed760;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.2s ease;
  margin-right: 16px;

  &:hover {
    transform: scale(1.1);
    background: #1fdf64;
  }

  &:disabled {
    background: #404040;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
    fill: black;
  }
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
`;

const TrackItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);

    ${PlayButton} {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const TrackImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 4px;
  margin-right: 16px;
`;

const TrackInfo = styled.div`
  flex: 1;
  min-width: 0;

  h4 {
    color: white;
    font-size: 14px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    color: #b3b3b3;
    font-size: 12px;
    margin: 4px 0 0;
  }
`;

const PlayedAt = styled.span`
  color: #b3b3b3;
  font-size: 14px;
  min-width: 80px;
  text-align: right;
`;

interface RecentlyPlayedProps {
  tracks: SpotifyApi.PlayHistoryObject[];
}

export default function RecentlyPlayed({ tracks }: RecentlyPlayedProps) {
  const { player, deviceId, isReady } = useSpotifyPlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  const handlePlay = async (track: SpotifyApi.TrackObjectFull) => {
    console.log('Play attempt - Device ID:', deviceId);
    console.log('Player ready:', isReady);
    
    if (!deviceId) {
      console.log('No device ID - opening in Spotify app');
      window.open(track.external_urls.spotify, '_blank');
      return;
    }

    try {
      setIsPlaying(true);
      setCurrentTrackId(track.id);

      const token = localStorage.getItem('spotify_token');
      console.log('Token available:', !!token);

      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [track.uri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Play response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Play error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Playback error:', error);
      window.open(track.external_urls.spotify, '_blank');
      setIsPlaying(false);
      setCurrentTrackId(null);
    }
  };

  const formatPlayedAt = (date: string) => {
    const playedAt = new Date(date);
    const now = new Date();
    const diff = now.getTime() - playedAt.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <Container>
      <Header>
        <h2>Recently Played</h2>
      </Header>
      <TrackList>
        <AnimatePresence>
          {tracks.map((item, index) => (
            <TrackItem
              key={`${item.track.id}-${item.played_at}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TrackImage 
                src={item.track.album?.images[2]?.url} 
                alt={item.track.name} 
              />
              <TrackInfo>
                <h4>{item.track.name}</h4>
                <p>{item.track.artists[0]?.name}</p>
              </TrackInfo>
              <PlayButton 
                onClick={() => handlePlay(item.track)}
                disabled={isPlaying && currentTrackId === item.track.id}
              >
                {isPlaying && currentTrackId === item.track.id ? (
                  <svg viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </PlayButton>
              <PlayedAt>{formatPlayedAt(item.played_at)}</PlayedAt>
            </TrackItem>
          ))}
        </AnimatePresence>
      </TrackList>
    </Container>
  );
} 