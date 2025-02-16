'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RecentContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
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

const TrackItem = styled(motion.a)`
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
  }
`;

const TrackImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 16px;
`;

const TrackInfo = styled.div`
  flex: 1;
  
  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }
  
  p {
    margin: 4px 0 0;
    font-size: 14px;
    color: #b3b3b3;
  }
`;

const PlayedAt = styled.div`
  font-size: 14px;
  color: #b3b3b3;
  margin-left: 16px;
`;

const ExpandButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #1ed760;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(30, 215, 96, 0.1);
    border-color: #1ed760;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-shrink: 0;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
  }
`;

interface RecentlyPlayedProps {
  tracks: SpotifyApi.PlayHistoryObject[];
}

export default function RecentlyPlayed({ tracks }: RecentlyPlayedProps) {
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
    <RecentContainer>
      <Header>
        <h2>Recently Played</h2>
      </Header>
      <TrackList>
        <AnimatePresence>
          {tracks.map((item, index) => (
            <TrackItem
              key={`${item.track.id}-${item.played_at}`}
              href={item.track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TrackImage 
                src={(item.track as SpotifyApi.TrackObjectFull).album?.images[2]?.url} 
                alt={item.track.name} 
              />
              <TrackInfo>
                <h4>{item.track.name}</h4>
                <p>{item.track.artists[0]?.name}</p>
              </TrackInfo>
              <PlayedAt>{formatPlayedAt(item.played_at)}</PlayedAt>
            </TrackItem>
          ))}
        </AnimatePresence>
      </TrackList>
    </RecentContainer>
  );
} 