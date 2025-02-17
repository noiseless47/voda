'use client';

import styled from 'styled-components';
import { authEndpoint, clientId, redirectUri, scopes } from '../config/spotify';
import Image from 'next/image';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to bottom, #1e1e1e, #121212);
  color: white;
`;

const Logo = styled.div`
  margin-bottom: 48px;
  animation: fadeIn 1s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LoginButton = styled.a`
  background: #1ed760;
  color: black;
  padding: 16px 48px;
  border-radius: 500px;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.04);
    background: #1db954;
  }
`;

const WelcomeText = styled.div`
  color: white;
  margin-bottom: 32px;
  animation: fadeIn 1s ease-in 0.3s backwards;

  h1 {
    font-size: 40px;
    font-weight: 900;
    margin-bottom: 16px;
    background: linear-gradient(to right, #1ed760, #fff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 18px;
    color: #b3b3b3;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
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
  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-top-read',
    'user-read-recently-played',
    'user-read-currently-playing'
  ].join(' ');

  const loginUrl = `https://accounts.spotify.com/authorize?client_id=${
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  }&redirect_uri=${
    encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI!)
  }&scope=${
    encodeURIComponent(scopes)
  }&response_type=token&show_dialog=true`;

  return (
    <LoginContainer>
      <BackgroundShapes />
      <Content>
        <Logo>
          <Image
            src="/spotify-white.png" // Make sure to add this image to your public folder
            alt="Spotify logo"
            width={240}
            height={72}
            priority
          />
        </Logo>
        
        <WelcomeText>
          <h1>Welcome to Your Spotify Stats</h1>
          <p>
            Discover your top tracks, artists, and listening habits. 
            Get insights into your music taste and explore your Spotify journey.
          </p>
        </WelcomeText>

        <LoginButton href={loginUrl}>
          Login with Spotify
        </LoginButton>
      </Content>
    </LoginContainer>
  );
} 