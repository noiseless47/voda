'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { SpotifyUser } from '../types/spotify';

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
  const [isPremium, setIsPremium] = useState(false);
  const [isReady, setIsReady] = useState(false);
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

  useEffect(() => {
    if (!isPremium) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Spotify Dashboard Player',
        getOAuthToken: cb => { cb(spotify.getAccessToken()!); },
        volume: 0.5
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setDeviceId(null);
        setIsReady(false);
      });

      player.addListener('player_state_changed', state => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setProgress(state.position);
        setDuration(state.duration);
        setIsPlaying(!state.paused);
      });

      player.connect();
      setPlayer(player);
    };

    return () => {
      document.body.removeChild(script);
      player?.disconnect();
    };
  }, [spotify, isPremium]);

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