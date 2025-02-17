'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTokenFromUrl } from '../config/spotify';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const token = getTokenFromUrl().access_token;
    if (token) {
      localStorage.setItem('spotify_token', token);
      router.push('/');
    }
  }, [router]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#121212',
      color: '#1ed760'
    }}>
      Authenticating...
    </div>
  );
} 