'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { authEndpoint, clientId, redirectUri, scopes } from './config/spotify';
import Dashboard from './components/Dashboard';
import SpotifyWebApi from 'spotify-web-api-js';

const spotify = new SpotifyWebApi();

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #1e1e1e, #121212);
  color: white;
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Hero = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 0;
  text-align: center;

  @media (max-width: 768px) {
    padding: 40px 0;
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 24px;
  background: linear-gradient(to right, #1ed760, #1db954);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #b3b3b3;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const LoginButton = styled(motion.a)`
  display: inline-block;
  background: #1ed760;
  color: black;
  padding: 16px 32px;
  border-radius: 30px;
  font-weight: 700;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background: #1fdf64;
  }
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 1rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    font-size: 1.5rem;
    color: #1ed760;
    margin-bottom: 16px;
  }

  p {
    color: #b3b3b3;
    line-height: 1.6;
  }
`;

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_token');
    
    if (storedToken) {
      spotify.setAccessToken(storedToken);
      spotify.getMe()
        .then(() => {
          setToken(storedToken);
        })
        .catch(() => {
          localStorage.removeItem('spotify_token');
          setToken(null);
        });
    }
  }, []);

  const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;

  if (token) {
    return <Dashboard spotify={spotify} />;
  }

  return (
    <Container>
      <Hero>
        <Title>Spotify Dashboard</Title>
        <Subtitle>
          Your personal music insights powered by AI
        </Subtitle>
        <LoginButton 
          href={loginUrl}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign in with Spotify
        </LoginButton>
      </Hero>

      <FeaturesGrid>
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>🎯 AI-Powered Insights</h3>
          <p>Get deep insights into your music taste with our advanced AI analysis. Discover patterns in your listening habits and receive personalized recommendations.</p>
        </FeatureCard>

        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>🎭 Mood-Based Playlists</h3>
          <p>Generate custom playlists based on your current mood. Our AI understands the emotional context of music and creates the perfect mix for any moment.</p>
        </FeatureCard>

        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>📊 Listening Stats</h3>
          <p>Track your top artists, songs, and genres over different time periods. Visualize your music journey with beautiful, interactive charts.</p>
        </FeatureCard>

        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3>🎨 Smart Playlists</h3>
          <p>Create intelligent playlists that adapt to your taste. Mix familiar favorites with new discoveries that match your preferences perfectly.</p>
        </FeatureCard>

        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3>🔄 Real-Time Updates</h3>
          <p>See your currently playing track and recently played songs. Keep track of your listening history in real-time.</p>
        </FeatureCard>

        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3>🎵 Genre Analysis</h3>
          <p>Explore your genre preferences with detailed breakdowns and discover how your music taste evolves over time.</p>
        </FeatureCard>
      </FeaturesGrid>
    </Container>
  );
}
