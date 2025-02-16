import React from 'react';
import styled from 'styled-components';

const RecentContainer = styled.div`
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

function RecentlyPlayed({ tracks }) {
  return (
    <RecentContainer>
      <h2>Recently Played</h2>
      {tracks.slice(0, 10).map((item) => (
        <TrackItem key={item.played_at}>
          <img src={item.track.album.images[2].url} alt={item.track.name} />
          <div>
            <h4>{item.track.name}</h4>
            <p>{item.track.artists[0].name}</p>
          </div>
        </TrackItem>
      ))}
    </RecentContainer>
  );
}

export default RecentlyPlayed; 