'use client';

import styled from 'styled-components';
import { authEndpoint, clientId, redirectUri, scopes } from '../config/spotify';
import Image from 'next/image';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5)),
              linear-gradient(rgb(32, 87, 100), rgb(41, 65, 171));
  padding: 20px;
  text-align: center;
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

const LoginButton = styled.button`
  background-color: #1ed760;
  color: #000;
  border: none;
  padding: 17px 48px;
  border-radius: 500px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: slideUp 1s ease-in-out;

  &:hover {
    background-color: #1fdf64;
    transform: scale(1.04);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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
  const handleLogin = () => {
    const scopesStr = encodeURIComponent(scopes.join(' '));
    const url = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopesStr}&response_type=token&show_dialog=true`;
    window.location.href = url;
  };

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

        <LoginButton onClick={handleLogin}>
          Login with Spotify
        </LoginButton>
      </Content>
    </LoginContainer>
  );
} 