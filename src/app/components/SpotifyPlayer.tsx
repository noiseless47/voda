'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SpotifyUser } from '../types/spotify.d';
import { useSpotifyPlayer } from '../context/SpotifyPlayerContext';
import SpotifyWebApi from 'spotify-web-api-js';

const PlayerContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PlayButton = styled.button<{ $isPlaying: boolean }>`
  background: #1ed760;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    background: #1fdf64;
  }

  svg {
    width: 14px;
    height: 14px;
    fill: black;
  }

  &:disabled {
    background: #404040;
    cursor: not-allowed;
    transform: none;
  }
`;

const PreviewLink = styled.a`
  color: #b3b3b3;
  text-decoration: none;
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
`;

interface SpotifyPlayerProps {
  trackUri: string;
  previewUrl: string | null;
  externalUrl: string;
  spotify: SpotifyWebApi.SpotifyWebApiJs;
}

export default function SpotifyPlayer({ 
  trackUri, 
  previewUrl,
  externalUrl,
  spotify 
}: SpotifyPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { deviceId, isPremium, isReady } = useSpotifyPlayer();

  useEffect(() => {
    if (previewUrl) {
      const audioElement = new Audio(previewUrl);
      setAudio(audioElement);
      return () => {
        audioElement.pause();
        audioElement.src = '';
      };
    }
  }, [previewUrl]);

  const togglePlay = async () => {
    if (isPremium && deviceId && isReady) {
      try {
        if (isPlaying) {
          await spotify.pause();
        } else {
          await spotify.play({
            device_id: deviceId,
            uris: [trackUri]
          });
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Playback error:', error);
        window.open(externalUrl, '_blank');
      }
    } else if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audio) {
      audio.onended = () => setIsPlaying(false);
    }
  }, [audio]);

  if (isPremium === null) {
    return <PlayerContainer>Loading...</PlayerContainer>;
  }

  if (!previewUrl && !isPremium) {
    return (
      <PreviewLink 
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Spotify
      </PreviewLink>
    );
  }

  return (
    <PlayerContainer>
      <PlayButton 
        $isPlaying={isPlaying} 
        onClick={togglePlay}
        disabled={!previewUrl && !isPremium}
      >
        {isPlaying ? (
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
    </PlayerContainer>
  );
} 