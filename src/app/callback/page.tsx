'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTokenFromUrl } from '../config/spotify';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const hash = getTokenFromUrl();
    const token = hash.access_token;
    
    if (token) {
      localStorage.setItem('spotify_token', token);
      router.push('/');
    }
  }, [router]);

  return <div>Loading...</div>;
} 