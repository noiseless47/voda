'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { SpotifyUser } from '../types/spotify';
import { toast } from 'react-hot-toast';

interface SpotifyPlayerContextType {
  player: Spotify.Player | null;
  deviceId: string | null;
  isPremium: boolean;
  isReady: boolean;
  currentTrack: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
      images: { url: string }[];
    };
  } | null;
  progress: number;
  duration: number;
  isPlaying: boolean;
}

const SpotifyPlayerContext = createContext<SpotifyPlayerContextType>({
  player: null,
  deviceId: null,
  isPremium: false,
  isReady: false,
  currentTrack: null,
  progress: 0,
  duration: 0,
  isPlaying: false,
});

export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext);

export function SpotifyPlayerProvider({ 
  children,
  spotify
}: { 
  children: React.ReactNode;
  spotify: SpotifyWebApi.SpotifyWebApiJs;
}) {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
      images: { url: string }[];
    };
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        // Check if user has Premium
        const user = await spotify.getMe();
        const hasPremium = user.product === 'premium';
        setIsPremium(hasPremium);
        
        if (!hasPremium) {
          console.log('User does not have Premium');
          return;
        }

        // Load Spotify Player SDK
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
          console.log('SDK Ready, initializing player...');
          const player = new window.Spotify.Player({
            name: 'Pulse Web Player',
            getOAuthToken: cb => {
              const token = spotify.getAccessToken();
              console.log('Getting token for player:', !!token);
              if (token) cb(token);
            },
            volume: 0.5
          });

          player.addListener('ready', ({ device_id }) => {
            console.log('Player ready, device ID:', device_id);
            setDeviceId(device_id);
            setIsReady(true);
            
            // Set as active device
            spotify.transferMyPlayback([device_id])
              .then(() => console.log('Set as active device'))
              .catch(err => console.error('Failed to set active device:', err));
          });

          player.addListener('not_ready', () => {
            console.log('Player not ready');
            setIsReady(false);
            setDeviceId(null);
          });

          player.connect()
            .then(success => {
              console.log('Player connected:', success);
              if (success) {
                setPlayer(player);
              }
            });
        };

        return () => {
          player?.disconnect();
          document.body.removeChild(script);
        };
      } catch (error) {
        console.error('Player initialization error:', error);
      }
    };

    initializePlayer();
  }, [spotify]);

  useEffect(() => {
    if (!player || !isReady) return;

    const progressInterval = setInterval(() => {
      player.getCurrentState().then(state => {
        if (state) {
          setProgress(state.position);
          setDuration(state.duration);
          setIsPlaying(!state.paused);
          setCurrentTrack(state.track_window.current_track);
        }
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [player, isReady]);

  useEffect(() => {
    const checkPremium = async () => {
      try {
        const user = await spotify.getMe() as SpotifyUser;
        setIsPremium(user.product === 'premium');
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };

    checkPremium();
  }, [spotify]);

  return (
    <SpotifyPlayerContext.Provider 
      value={{ 
        player, 
        deviceId, 
        isPremium, 
        isReady,
        currentTrack,
        progress,
        duration,
        isPlaying
      }}
    >
      {children}
    </SpotifyPlayerContext.Provider>
  );
} 