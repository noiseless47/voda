export interface SpotifyUser extends SpotifyApi.CurrentUsersProfileResponse {
  product: 'free' | 'premium' | 'open';
}

declare global {
  interface Window {
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
      }) => {
        connect: () => Promise<boolean>;
        disconnect: () => void;
        addListener: (event: string, callback: (state: any) => void) => void;
        removeListener: (event: string) => void;
        getCurrentState: () => Promise<{
          paused: boolean;
          position: number;
          duration: number;
          track_window: {
            current_track: {
              name: string;
              artists: { name: string }[];
              album: {
                images: { url: string }[];
              };
            };
          };
        } | null>;
        pause: () => Promise<void>;
        resume: () => Promise<void>;
        seek: (position_ms: number) => Promise<void>;
        setVolume: (volume: number) => Promise<void>;
      };
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }

  namespace Spotify {
    interface Track {
      id: string;
      name: string;
      artists: { name: string }[];
      album: {
        images: { url: string }[];
      };
    }

    interface Player {
      connect: () => Promise<boolean>;
      disconnect: () => void;
      addListener: (event: string, callback: (state: any) => void) => void;
      removeListener: (event: string) => void;
      getCurrentState: () => Promise<any>;
      pause: () => Promise<void>;
      resume: () => Promise<void>;
      seek: (position_ms: number) => Promise<void>;
      setVolume: (volume: number) => Promise<void>;
    }
  }
} 