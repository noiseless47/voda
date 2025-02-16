import React from 'react';
import styled from 'styled-components';

const ArtistsContainer = styled.div`
  background-color: #282828;
  padding: 20px;
  border-radius: 10px;
`;

const ArtistItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
`;

function TopArtists({ artists }) {
  return (
    <ArtistsContainer>
      <h2>Top Artists</h2>
      {artists.slice(0, 10).map((artist) => (
        <ArtistItem key={artist.id}>
          <img src={artist.images[2].url} alt={artist.name} />
          <div>
            <h4>{artist.name}</h4>
            <p>{artist.genres[0]}</p>
          </div>
        </ArtistItem>
      ))}
    </ArtistsContainer>
  );
}

export default TopArtists; 