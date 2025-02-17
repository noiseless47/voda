'use client';

import styled from 'styled-components';
import { SpotifyUser } from '../types/spotify';

const ProfileContainer = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 16px;
    gap: 16px;
  }
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;

  h1 {
    font-size: 32px;
    margin: 0 0 8px 0;
    background: linear-gradient(to right, #fff, #b3b3b3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    color: #b3b3b3;
    margin: 0;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 16px;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 16px;
  }
`;

const StatItem = styled.div`
  h3 {
    color: #1ed760;
    margin: 0;
    font-size: 24px;
  }

  p {
    margin: 4px 0 0;
    font-size: 14px;
  }
`;

interface UserProfileProps {
  user: SpotifyUser;
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <ProfileContainer>
      <ProfileImage src={user.images?.[0]?.url} alt={user.display_name || ''} />
      <ProfileInfo>
        <h1>{user.display_name}</h1>
        <p>{user.email}</p>
        <Stats>
          <StatItem>
            <h3>{user.followers?.total.toLocaleString()}</h3>
            <p>Followers</p>
          </StatItem>
          <StatItem>
            <h3>{user.product === 'premium' ? 'Premium' : 'Free'}</h3>
            <p>Account Type</p>
          </StatItem>
        </Stats>
      </ProfileInfo>
    </ProfileContainer>
  );
} 