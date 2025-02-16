'use client';

import { useEffect, useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SpotifyWebApi from 'spotify-web-api-js';

const spotify = new SpotifyWebApi();

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (token) {
      setToken(token);
      spotify.setAccessToken(token);
    }
  }, []);

  return (
    <main>
      {token ? <Dashboard spotify={spotify} /> : <Login />}
    </main>
  );
}
