'use client';

import styled from 'styled-components';
import { authEndpoint, clientId, redirectUri, scopes } from '../config/spotify';
import Image from 'next/image';
import { FaSpotify } from 'react-icons/fa';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #1e1e1e 0%,
    #121212 50%,
    #1a1a1a 100%
  );
  color: white;
  font-family: var(--font-primary);
  position: relative;
  overflow: hidden;
`;

const Logo = styled.div`
  margin-bottom: 48px;
  animation: fadeIn 1s ease-in;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 120%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    bottom: -24px;
    left: -10%;
  }
`;

const LoginButton = styled.a`
  background: #1ed760;
  color: black;
  padding: 16px 32px;
  border-radius: 500px;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: var(--font-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(30, 215, 96, 0.3);

  span {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  svg {
    font-size: 24px;
  }

  &:hover {
    transform: translateY(-2px);
    background: #1fdf64;
    box-shadow: 0 6px 16px rgba(30, 215, 96, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const WelcomeText = styled.div`
  color: white;
  margin-bottom: 48px;
  text-align: center;
  animation: fadeIn 1s ease-in 0.3s backwards;
  max-width: 800px;
  padding: 0 24px;

  h1 {
    font-family: var(--font-secondary);
    font-size: 64px;
    font-weight: 700;
    margin-bottom: 24px;
    background: linear-gradient(to right, #1ed760, #fff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
  }

  p {
    font-size: 20px;
    color: #b3b3b3;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;
  max-width: 1200px;
  padding: 0 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Feature = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    color: #1ed760;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    color: #b3b3b3;
    line-height: 1.5;
  }
`;

const BackgroundShapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: radial-gradient(circle, rgba(29, 185, 84, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }

  &::before {
    width: 1000px;
    height: 1000px;
    top: -500px;
    right: -300px;
    animation: float 20s infinite ease-in-out;
  }

  &::after {
    width: 800px;
    height: 800px;
    bottom: -400px;
    left: -200px;
    animation: float 15s infinite ease-in-out reverse;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, 30px); }
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
`;

export default function Login() {
  const loginUrl = `https://accounts.spotify.com/authorize?client_id=${
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  }&redirect_uri=${
    encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI!)
  }&scope=${
    encodeURIComponent(scopes.join(' '))
  }&response_type=token&show_dialog=true`;

  return (
    <LoginContainer>
      <BackgroundShapes />
      <Content>
        <Logo>
          <Image
            src="/voda-logo.png"
            alt="VØDA"
            width={180}
            height={60}
            priority
          />
        </Logo>
        
        <WelcomeText>
          <h1>Welcome to VØDA</h1>
          <p>
            Your personal AI-powered music intelligence hub. Discover insights about your 
            listening habits, create smart playlists, and explore your musical journey.
          </p>
        </WelcomeText>

        <LoginButton href={loginUrl}>
          Sign in with <span><FaSpotify /> Spotify</span>
        </LoginButton>

        <Features>
          <Feature>
            <h3>🎯 AI-Powered Insights</h3>
            <p>Get deep insights into your music taste with advanced AI analysis.</p>
          </Feature>
          <Feature>
            <h3>🎭 Mood Playlists</h3>
            <p>Generate custom playlists based on your current mood.</p>
          </Feature>
          <Feature>
            <h3>📊 Rich Analytics</h3>
            <p>Track your musical journey with beautiful visualizations.</p>
          </Feature>
        </Features>
      </Content>
    </LoginContainer>
  );
} 