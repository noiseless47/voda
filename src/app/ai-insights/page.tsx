'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AIInsightsPage() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">AI Music Insights</h1>
      <p className="mb-4">
        This page shows AI-generated insights about your music preferences.
      </p>
      <button 
        onClick={() => router.push('/')}
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
