import React from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #282828;
  border-radius: 10px;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 20px;
`;

const ProfileInfo = styled.div`
  h1 {
    margin: 0;
    color: white;
  }
  p {
    color: #b3b3b3;
  }
`;

function UserProfile({ user }) {
  return (
    <ProfileContainer>
      <ProfileImage src={user.images[0]?.url} alt={user.display_name} />
      <ProfileInfo>
        <h1>{user.display_name}</h1>
        <p>Followers: {user.followers.total}</p>
        <p>Email: {user.email}</p>
      </ProfileInfo>
    </ProfileContainer>
  );
}

export default UserProfile; 