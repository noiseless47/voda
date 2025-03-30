'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { generateMusicInsights } from '../utils/groq';

const InsightsContainer = styled.div`
  display: grid;
  gap: 32px;
`;

const Section = styled.div`
  h2 {
    font-size: 24px;
    margin-bottom: 24px;
    color: #1ed760;
    font-weight: 700;
  }
`;

const TasteAnalysis = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
`;

const MainInsights = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  line-height: 1.6;

  p {
    margin-bottom: 16px;
    color: #e1e1e1;
    font-size: 15px;
  }

  strong {
    color: #1ed760;
    font-weight: 600;
  }
`;

const GenreDistribution = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;

  h3 {
    color: #1ed760;
    margin-bottom: 16px;
    font-size: 18px;
  }
`;

const GenreBar = styled.div`
  margin-bottom: 16px;
`;

const GenreLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 14px;
  color: #e1e1e1;
`;

const ProgressBar = styled.div<{ $width: number }>`
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$width}%;
    background: linear-gradient(to right, #1ed760, #1db954);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
`;

interface AIInsightsProps {
  topTracks: SpotifyApi.TrackObjectFull[];
  topArtists: SpotifyApi.ArtistObjectFull[];
  genres: string[];
}

export default function AIInsights({ topTracks, topArtists, genres }: AIInsightsProps) {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getInsights = async () => {
      setLoading(true);
      try {
        const generatedInsights = await generateMusicInsights({
          topTracks,
          topArtists,
          genres
        });
        setInsights(generatedInsights);
      } catch (error) {
        console.error('Error getting insights:', error);
        setInsights('Unable to generate insights at this time.');
      }
      setLoading(false);
    };

    if (topTracks.length > 0 && topArtists.length > 0) {
      getInsights();
    }
  }, [topTracks, topArtists, genres]);

  // Calculate genre percentages
  const genreCounts = genres.reduce((acc: { [key: string]: number }, genre) => {
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  const totalGenres = Object.values(genreCounts).reduce((a, b) => a + b, 0);
  const topGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([genre, count]) => ({
      name: genre,
      percentage: (count / totalGenres) * 100
    }));

  // Format the insights text with better styling
  const formatInsights = (text: string) => {
    return text
      .split('**')
      .map((part, index) => 
        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
      );
  };

  return (
    <InsightsContainer>
      <Section>
        <h2>Music Taste Analysis</h2>
        <TasteAnalysis>
          <MainInsights>
            {insights.split('\n').map((paragraph, index) => (
              <p key={index}>{formatInsights(paragraph)}</p>
            ))}
          </MainInsights>
          <GenreDistribution>
            <h3>Genre Distribution</h3>
            {topGenres.map(genre => (
              <GenreBar key={genre.name}>
                <GenreLabel>
                  <span>{genre.name}</span>
                  <span>{Math.round(genre.percentage)}%</span>
                </GenreLabel>
                <ProgressBar $width={genre.percentage} />
              </GenreBar>
            ))}
          </GenreDistribution>
        </TasteAnalysis>
      </Section>
    </InsightsContainer>
  );
} 