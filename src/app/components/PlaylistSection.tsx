'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  margin-top: 48px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
`;

const Header = styled.div`
  margin-bottom: 24px;

  h2 {
    font-size: 24px;
    font-weight: 700;
    color: white;
  }
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
`;

const PlaylistCard = styled.a`
  display: block;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const PlaylistImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
`;

const PlaylistInfo = styled.div`
  padding: 16px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: white;
    margin-bottom: 4px;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #b3b3b3;
  }
`;

interface PlaylistSectionProps {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
}

export default function PlaylistSection({ playlists }: PlaylistSectionProps) {
  if (!playlists) return null;

  return (
    <Container>
      <Header>
        <h2>Your Playlists</h2>
      </Header>
      <PlaylistGrid>
        {playlists.map(playlist => (
          <PlaylistCard 
            key={playlist.id}
            href={playlist.external_urls?.spotify}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PlaylistImage 
              src={playlist.images?.[0]?.url || '/default-playlist.png'} 
              alt={playlist.name} 
            />
            <PlaylistInfo>
              <h3>{playlist.name}</h3>
              <p>{playlist.tracks.total} tracks</p>
            </PlaylistInfo>
          </PlaylistCard>
        ))}
      </PlaylistGrid>
    </Container>
  );
} 