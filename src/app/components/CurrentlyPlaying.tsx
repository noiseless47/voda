'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const AlbumArt = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const NowPlaying = styled.div`
  color: #1ed760;
  font-size: 14px;
  margin-bottom: 4px;
`;

interface CurrentlyPlayingProps {
  track: SpotifyApi.CurrentlyPlayingObject;
}

export default function CurrentlyPlaying({ track }: CurrentlyPlayingProps) {
  if (!track.item) return null;

  return (
    <Container>
      <AlbumArt src={track.item.album.images[0].url} alt={track.item.name} />
      <TrackInfo>
        <NowPlaying>NOW PLAYING</NowPlaying>
        <h3>{track.item.name}</h3>
        <p>{track.item.artists.map(artist => artist.name).join(', ')}</p>
      </TrackInfo>
    </Container>
  );
} 