'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpotifyPlayer } from '../context/SpotifyPlayerContext';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TimeRange = styled.span`
  font-size: 14px;
  color: #b3b3b3;
  padding: 4px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
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
  transform: translateX(10px);
  transition: all 0.2s ease;
  position: absolute;
  right: 16px;

  &:hover {
    transform: scale(1.1);
    background: #1fdf64;
  }

  &:disabled {
    background: #404040;
    cursor: not-allowed;
  }

  svg {
    fill: black;
    width: 16px;
    height: 16px;
  }
`;

const TrackNumber = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #b3b3b3;
  width: 30px;
  transition: all 0.3s ease;
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 600px;
  overflow-y: auto;
  padding-right: 8px;

  /* Scrollbar styling */
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
  padding: 16px;
  padding-right: 64px;
  border-radius: 12px;
  color: white;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-height: 80px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.02);

    ${PlayButton} {
      opacity: 1;
      transform: translateX(0);
    }

    ${TrackNumber} {
      opacity: 0;
    }
  }
`;

const TrackImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  margin-right: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const TrackInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    margin: 0;
  }

  p {
    font-size: 14px;
    color: #b3b3b3;
    margin: 4px 0 0;
  }
`;

interface TopTracksProps {
  tracks: SpotifyApi.TrackObjectFull[];
  timeRange: string;
}

export default function TopTracks({ tracks, timeRange }: TopTracksProps) {
  const { player, deviceId, isReady } = useSpotifyPlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  const timeRangeText = {
    'short_term': 'Last Month',
    'medium_term': 'Last 6 Months',
    'long_term': 'All Time'
  }[timeRange];

  const handlePlay = async (track: SpotifyApi.TrackObjectFull) => {
    if (player && deviceId && isReady) {
      try {
        setIsPlaying(true);
        setCurrentTrackId(track.id);

        const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [track.uri] }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('spotify_token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error playing track:', error);
        setIsPlaying(false);
        setCurrentTrackId(null);
      }
    }
  };

  return (
    <div>
      <Header>
        <h2>Top Tracks</h2>
        <TimeRange>{timeRangeText}</TimeRange>
      </Header>
      <TrackList>
        <AnimatePresence>
          {tracks.map((track, index) => (
            <TrackItem
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TrackNumber>{index + 1}</TrackNumber>
              <TrackImage src={track.album.images[1]?.url} alt={track.name} />
              <TrackInfo>
                <h4>{track.name}</h4>
                <p>{track.artists[0]?.name}</p>
              </TrackInfo>
              <PlayButton 
                onClick={() => handlePlay(track)}
                disabled={isPlaying && currentTrackId === track.id}
              >
                {isPlaying && currentTrackId === track.id ? (
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
            </TrackItem>
          ))}
        </AnimatePresence>
      </TrackList>
    </div>
  );
} 