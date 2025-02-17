'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSpotifyPlayer } from '../context/SpotifyPlayerContext';

const PlayerContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background: #181818;
  border-top: 1px solid #282828;
  transform: translateY(${props => props.$isVisible ? '0' : '100%'});
  transition: transform 0.3s ease;
  z-index: 1000;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 180px;
`;

const AlbumArt = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 4px;
`;

const TrackDetails = styled.div`
  h3 {
    color: #fff;
    font-size: 14px;
    margin: 0 0 4px;
  }
  p {
    color: #b3b3b3;
    font-size: 12px;
    margin: 0;
  }
`;

const PlaybackContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const TimeDisplay = styled.span`
  color: #a7a7a7;
  font-size: 11px;
  min-width: 35px;
  text-align: right;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: #4d4d4d;
  border-radius: 2px;
  cursor: pointer;
  position: relative;

  &:hover {
    height: 6px;
  }
`;

const Progress = styled.div<{ $width: number }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${props => props.$width}%;
  background: #fff;
  border-radius: 2px;
`;

const PlayButton = styled.button`
  background: #fff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 24px;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 14px;
    height: 14px;
    fill: black;
  }
`;

export default function PlayerBar() {
  const { currentTrack, player, isReady } = useSpotifyPlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!player || !isReady) return;

    const interval = setInterval(() => {
      player.getCurrentState().then(state => {
        if (state) {
          setIsPlaying(!state.paused);
          setProgress(state.position);
          setDuration(state.duration);
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [player, isReady]);

  const handlePlayPause = () => {
    if (isPlaying) {
      player?.pause();
    } else {
      player?.resume();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const position = duration * percent;
    player?.seek(position);
  };

  const formatTimeLeft = (ms: number) => {
    const timeLeft = duration - ms;
    const seconds = Math.floor(timeLeft / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `-${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <PlayerContainer $isVisible={!!currentTrack}>
      <TrackInfo>
        <AlbumArt src={currentTrack.album.images[0]?.url} alt={currentTrack.name} />
        <TrackDetails>
          <h3>{currentTrack.name}</h3>
          <p>{currentTrack.artists[0].name}</p>
        </TrackDetails>
      </TrackInfo>

      <PlaybackContainer>
        <ProgressContainer>
          <ProgressBar onClick={handleProgressClick}>
            <Progress $width={(progress / duration) * 100} />
          </ProgressBar>
          <TimeDisplay>{formatTimeLeft(progress)}</TimeDisplay>
        </ProgressContainer>

        <PlayButton onClick={handlePlayPause}>
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
      </PlaybackContainer>
    </PlayerContainer>
  );
} 