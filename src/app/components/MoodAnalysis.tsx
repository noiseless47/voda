'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MoodData } from '../types/spotify';
import SpotifyWebApi from 'spotify-web-api-js';

const spotify = new SpotifyWebApi();

// Set token from localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('spotify_token');
  if (token) {
    spotify.setAccessToken(token);
  }
}

const MoodContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
`;

const MoodGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const MoodSection = styled.div`
  h2 {
    font-size: 24px;
    margin-bottom: 24px;
    color: #1ed760;
    font-weight: 700;
  }
`;

const MoodChart = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  display: grid;
  gap: 16px;
`;

const MoodBar = styled.div`
  position: relative;
`;

const MoodLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #e1e1e1;
  text-transform: capitalize;
`;

const MoodBarProgress = styled.div<{ $value: number }>`
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
    width: ${props => props.$value * 100}%;
    background: linear-gradient(to right, #1ed760, #1db954);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
`;

const MoodDescription = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  line-height: 1.6;

  h3 {
    color: #1ed760;
    margin-bottom: 16px;
    font-size: 18px;
  }

  p {
    color: #e1e1e1;
    font-size: 15px;
  }
`;

interface MoodAnalysisProps {
  tracks: SpotifyApi.TrackObjectFull[];
}

export default function MoodAnalysis({ tracks }: MoodAnalysisProps) {
  const [moodData, setMoodData] = useState<MoodData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateMood = async () => {
      setIsLoading(true);
      try {
        if (!tracks.length) {
          setError('No tracks available for mood analysis');
          return;
        }

        const token = localStorage.getItem('spotify_token');
        if (!token) {
          setError('Authentication required');
          return;
        }

        spotify.setAccessToken(token);

        // Get audio features in a single request
        const trackIds = tracks.map(track => track.id);
        const response = await spotify.getAudioFeaturesForTracks(trackIds);

        if (!response.audio_features || response.audio_features.length === 0) {
          throw new Error('No audio features available');
        }

        const validFeatures = response.audio_features.filter(
          (feature): feature is SpotifyApi.AudioFeaturesObject => 
            feature !== null && feature !== undefined
        );

        if (validFeatures.length === 0) {
          throw new Error('No valid audio features found');
        }

        const averages = validFeatures.reduce((acc, feature) => ({
          valence: acc.valence + feature.valence,
          energy: acc.energy + feature.energy,
          danceability: acc.danceability + feature.danceability,
          acousticness: acc.acousticness + feature.acousticness
        }), { valence: 0, energy: 0, danceability: 0, acousticness: 0 });

        const count = validFeatures.length;
        setMoodData({
          valence: averages.valence / count,
          energy: averages.energy / count,
          danceability: averages.danceability / count,
          acousticness: averages.acousticness / count
        });
        setError(null);
      } catch (error) {
        console.error('Error calculating mood:', error);
        if (error instanceof Error && error.message.includes('401')) {
          setError('Session expired. Please sign in again.');
          localStorage.removeItem('spotify_token');
          window.location.href = '/';
        } else {
          setError('Unable to analyze mood at this time. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    calculateMood();
  }, [tracks]);

  if (isLoading) {
    return (
      <MoodContainer>
        <h2>Music Mood</h2>
        <LoadingSpinner />
      </MoodContainer>
    );
  }

  if (error) {
    return (
      <MoodContainer>
        <h2>Music Mood</h2>
        <ErrorMessage>{error}</ErrorMessage>
      </MoodContainer>
    );
  }

  const getMoodDescription = (data: MoodData) => {
    const moods = [];
    if (data.valence > 0.6) moods.push('positive and upbeat');
    else if (data.valence < 0.4) moods.push('melancholic');
    if (data.energy > 0.6) moods.push('energetic');
    else if (data.energy < 0.4) moods.push('calm');
    if (data.danceability > 0.6) moods.push('danceable');
    if (data.acousticness > 0.6) moods.push('acoustic');

    return moods.join(', ');
  };

  return (
    <MoodContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Your Music Mood</h2>
      {moodData && (
        <MoodGrid>
          <MoodChart>
            {Object.entries(moodData).map(([key, value]) => (
              <MoodBar key={key}>
                <MoodLabel>
                  <span>{key}</span>
                  <span>{Math.round(value * 100)}%</span>
                </MoodLabel>
                <MoodBarProgress $value={value} />
              </MoodBar>
            ))}
          </MoodChart>
          <MoodDescription>
            <h3>Mood Analysis</h3>
            <p>Your music taste tends to be {getMoodDescription(moodData)}</p>
          </MoodDescription>
        </MoodGrid>
      )}
    </MoodContainer>
  );
}

// Add these styled components
const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #1ed760;
  animation: spin 1s linear infinite;
  margin: 24px auto;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.p`
  color: #ff5555;
  text-align: center;
  margin: 24px 0;
  padding: 16px;
  background: rgba(255, 85, 85, 0.1);
  border-radius: 8px;
`; 