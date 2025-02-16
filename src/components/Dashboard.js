import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TopTracks from './TopTracks';
import TopArtists from './TopArtists';
import RecentlyPlayed from './RecentlyPlayed';
import UserProfile from './UserProfile';

const DashboardContainer = styled.div`
  padding: 30px;
  background-color: #121212;
  color: white;
  min-height: 100vh;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

function Dashboard({ spotify }) {
  const [userData, setUserData] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    spotify.getMe().then(user => setUserData(user));
    
    spotify.getMyTopTracks().then(tracks => setTopTracks(tracks.items));
    
    spotify.getMyTopArtists().then(artists => setTopArtists(artists.items));
    
    spotify.getMyRecentlyPlayedTracks().then(tracks => 
      setRecentlyPlayed(tracks.items)
    );
  }, [spotify]);

  return (
    <DashboardContainer>
      {userData && <UserProfile user={userData} />}
      <Grid>
        <TopTracks tracks={topTracks} />
        <TopArtists artists={topArtists} />
        <RecentlyPlayed tracks={recentlyPlayed} />
      </Grid>
    </DashboardContainer>
  );
}

export default Dashboard; 