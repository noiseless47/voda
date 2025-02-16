'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fontFamily, headingStyles } from '../styles/shared';

const GenresContainer = styled.div`
  ${fontFamily}

  h2 {
    ${headingStyles}
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const GenresList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const GenreTag = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
`;

const GenreCount = styled.span`
  background: rgba(30, 215, 96, 0.2);
  color: #1ed760;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
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

interface TopGenresProps {
  artists: SpotifyApi.ArtistObjectFull[];
}

export default function TopGenres({ artists }: TopGenresProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const genres = artists.reduce((acc: { [key: string]: number }, artist) => {
    artist.genres.forEach(genre => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {});

  const sortedGenres = Object.entries(genres)
    .sort(([, a], [, b]) => b - a);

  const displayGenres = isExpanded ? sortedGenres : sortedGenres.slice(0, 8);

  return (
    <GenresContainer>
      <h2>Top Genres</h2>
      <GenresList>
        <AnimatePresence>
          {displayGenres.map(([genre, count], index) => (
            <motion.div
              key={genre}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <GenreTag>
                {genre}
                <GenreCount>{count}</GenreCount>
              </GenreTag>
            </motion.div>
          ))}
        </AnimatePresence>
      </GenresList>
      {sortedGenres.length > 8 && (
        <ExpandButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Show Less' : 'Show More'}
        </ExpandButton>
      )}
    </GenresContainer>
  );
} 