import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import PlayerBar from './PlayerBar';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1ed760;
  font-size: 1.5rem;
  font-weight: 700;
`;

const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.3);
  padding: 24px;
  text-align: center;
  margin-top: auto;
  color: #b3b3b3;
  font-size: 0.9rem;

  a {
    color: #1ed760;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
  showTimeRange?: boolean;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  onSignOut?: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TimeRangeControls = styled.div`
  display: flex;
  gap: 8px;
`;

const TimeRangeButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  color: ${props => props.$active ? '#fff' : '#b3b3b3'};
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

const SignOutButton = styled.button`
  background: transparent;
  color: #b3b3b3;
  border: 1px solid #b3b3b3;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: white;
    border-color: white;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
  margin: 0 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin: 16px 0;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  background: ${props => props.$active ? '#1ed760' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? 'black' : 'white'};
  border: none;
  cursor: pointer;
  white-space: nowrap;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#1ed760' : 'rgba(255, 255, 255, 0.15)'};
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;

  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
  }
`;

export default function Layout({ 
  children, 
  showTimeRange, 
  timeRange, 
  onTimeRangeChange,
  onSignOut,
  activeTab,
  onTabChange
}: LayoutProps) {
  return (
    <LayoutContainer>
      <Header>
        <Logo>
          <Image src="/spotify-icon.png" alt="Spotify" width={30} height={30} />
          VØDA
        </Logo>
        <HeaderContent>
          <TabsContainer>
            <Tab 
              $active={activeTab === 'overview'} 
              onClick={() => onTabChange('overview')}
            >
              Overview
            </Tab>
            <Tab 
              $active={activeTab === 'ai-insights'} 
              onClick={() => onTabChange('ai-insights')}
            >
              AI Insights
            </Tab>
            <Tab 
              $active={activeTab === 'recommendations'} 
              onClick={() => onTabChange('recommendations')}
            >
              Smart Playlists
            </Tab>
            <Tab 
              $active={activeTab === 'mood-playlist'} 
              onClick={() => onTabChange('mood-playlist')}
            >
              Mood Playlist
            </Tab>
          </TabsContainer>
          <Controls>
            {showTimeRange && onTimeRangeChange && (
              <TimeRangeControls>
                <TimeRangeButton 
                  $active={timeRange === 'short_term'} 
                  onClick={() => onTimeRangeChange('short_term')}
                >
                  Last Month
                </TimeRangeButton>
                <TimeRangeButton 
                  $active={timeRange === 'medium_term'} 
                  onClick={() => onTimeRangeChange('medium_term')}
                >
                  Last 6 Months
                </TimeRangeButton>
                <TimeRangeButton 
                  $active={timeRange === 'long_term'} 
                  onClick={() => onTimeRangeChange('long_term')}
                >
                  All Time
                </TimeRangeButton>
              </TimeRangeControls>
            )}
            {onSignOut && (
              <SignOutButton onClick={onSignOut}>
                Sign Out
              </SignOutButton>
            )}
          </Controls>
        </HeaderContent>
      </Header>
      <Main>{children}</Main>
      <PlayerBar />
      <Footer>
        Made with ♥️ using{' '}
        <a href="https://developer.spotify.com/documentation/web-api" target="_blank" rel="noopener noreferrer">
          Spotify API
        </a>
      </Footer>
    </LayoutContainer>
  );
} 