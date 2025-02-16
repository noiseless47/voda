import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { getTokenFromUrl } from './config/spotify';
import SpotifyWebApi from 'spotify-web-api-js';
import './App.css';

const spotify = new SpotifyWebApi();

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";
    const _token = hash.access_token;

    if (_token) {
      setToken(_token);
      spotify.setAccessToken(_token);
    }
  }, []);

  return (
    <div className="app">
      {token ? <Dashboard spotify={spotify} /> : <Login />}
    </div>
  );
}

export default App; 