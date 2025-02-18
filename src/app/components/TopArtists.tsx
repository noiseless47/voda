'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ArtistsContainer = styled.div`
  background-color: #282828;
  padding: 20px;
  border-radius: 10px;
`;

const ArtistList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 600px;
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

const ArtistItem = styled(motion.a)`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  text-decoration: none;
  color: white;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 80px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
`;

const ArtistNumber = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #b3b3b3;
  width: 30px;
`;

const ArtistImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 16px;
`;

const ArtistInfo = styled.div`
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

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
  }
`;

const TimeRange = styled.span`
  font-size: 14px;
  color: #b3b3b3;
  padding: 4px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
`;

const Genres = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: #b3b3b3;
`;

const ArtistName = styled.h4`
  color: white;
  font-size: 16px;
  margin: 0;
  text-transform: none;
`;

const ArtistGenre = styled.p`
  color: #b3b3b3;
  font-size: 14px;
  margin: 4px 0 0;
  text-transform: none;
`;

interface TopArtistsProps {
  artists: SpotifyApi.ArtistObjectFull[];
  timeRange: string;
}

export default function TopArtists({ artists, timeRange }: TopArtistsProps) {
  const timeRangeText = {
    'short_term': 'Last Month',
    'medium_term': 'Last 6 Months',
    'long_term': 'All Time'
  }[timeRange];

  return (
    <div>
      <Header>
        <h2>Top Artists</h2>
        <TimeRange>{timeRangeText}</TimeRange>
      </Header>
      <ArtistList>
        <AnimatePresence>
          {artists.map((artist, index) => (
            <ArtistItem
              key={artist.id}
              href={artist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ArtistNumber>{index + 1}</ArtistNumber>
              <ArtistImage src={artist.images[0]?.url} alt={artist.name} />
              <ArtistInfo>
                <ArtistName>{artist.name}</ArtistName>
                {artist.genres[0] && (
                  <ArtistGenre>
                    {artist.genres[0].charAt(0).toUpperCase() + artist.genres[0].slice(1)}
                  </ArtistGenre>
                )}
              </ArtistInfo>
            </ArtistItem>
          ))}
        </AnimatePresence>
      </ArtistList>
    </div>
  );
} 