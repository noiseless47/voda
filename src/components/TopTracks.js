import React from 'react';
import styled from 'styled-components';

const TracksContainer = styled.div`
  background-color: #282828;
  padding: 20px;
  border-radius: 10px;
`;

const TrackItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
`;

function TopTracks({ tracks }) {
  return (
    <TracksContainer>
      <h2>Top Tracks</h2>
      {tracks.slice(0, 10).map((track) => (
        <TrackItem key={track.id}>
          <img src={track.album.images[2].url} alt={track.name} />
          <div>
            <h4>{track.name}</h4>
            <p>{track.artists[0].name}</p>
          </div>
        </TrackItem>
      ))}
    </TracksContainer>
  );
}

export default TopTracks; 