import React from 'react';
import styled from 'styled-components';
import { authEndpoint, clientId, redirectUri, scopes } from '../config/spotify';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1db954;
`;

const LoginButton = styled.a`
  padding: 20px;
  background-color: black;
  border-radius: 99px;
  font-weight: 800;
  color: white;
  text-decoration: none;
`;

function Login() {
  return (
    <LoginContainer>
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
        alt="Spotify logo"
        style={{ width: '70%', maxWidth: '500px', marginBottom: '50px' }}
      />
      <LoginButton
        href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
          "%20"
        )}&response_type=token&show_dialog=true`}
      >
        LOGIN WITH SPOTIFY
      </LoginButton>
    </LoginContainer>
  );
}

export default Login; 