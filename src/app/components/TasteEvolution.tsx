'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  backdrop-filter: blur(10px);

  h2 {
    font-size: 24px;
    margin-bottom: 24px;
    color: #1ed760;
    font-weight: 700;
  }
`;

const Timeline = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 24px;
`;

const TimePoint = styled.div<{ $active: boolean }>`
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  padding: 24px;
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  h3 {
    color: ${props => props.$active ? '#1ed760' : '#e1e1e1'};
    font-size: 18px;
    margin-bottom: 16px;
    text-transform: capitalize;
  }
`;

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const GenreTag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  color: #e1e1e1;
`;

const Stats = styled.div`
  color: #b3b3b3;
  font-size: 14px;
  
  strong {
    color: #1ed760;
    font-weight: 600;
  }
`;

interface TasteChange {
  period: string;
  topGenres: string[];
  dominantMood: string;
  newArtists: number;
  description: string;
}

interface TasteEvolutionProps {
  historicalData: {
    [key: string]: {
      tracks: SpotifyApi.TrackObjectFull[];
      artists: SpotifyApi.ArtistObjectFull[];
    };
  };
}

export default function TasteEvolution({ historicalData }: TasteEvolutionProps) {
  const [changes, setChanges] = useState<TasteChange[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('medium_term');

  useEffect(() => {
    const analyzeChanges = () => {
      const periods = ['short_term', 'medium_term', 'long_term'];
      return periods.map(period => {
        const data = historicalData[period] || { tracks: [], artists: [] };
        const genres = new Set(data.artists?.flatMap(artist => artist.genres || []));
        
        return {
          period,
          topGenres: Array.from(genres).slice(0, 5),
          dominantMood: 'energetic',
          newArtists: data.artists?.length || 0,
          description: `Based on your ${period.replace('_', ' ')} listening history`
        };
      });
    };

    setChanges(analyzeChanges());
  }, [historicalData]);

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Your Taste Evolution</h2>
      <Timeline>
        {changes.map((change) => (
          <TimePoint
            key={change.period}
            $active={selectedPeriod === change.period}
            onClick={() => setSelectedPeriod(change.period)}
          >
            <h3>{change.period.replace('_', ' ')}</h3>
            <GenreList>
              {change.topGenres.map(genre => (
                <GenreTag key={genre}>{genre}</GenreTag>
              ))}
            </GenreList>
            <Stats>
              <strong>{change.newArtists}</strong> new artists discovered
            </Stats>
          </TimePoint>
        ))}
      </Timeline>
    </Container>
  );
} 