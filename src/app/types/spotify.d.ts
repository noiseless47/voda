import { SpotifyApi } from '@types/spotify-api';
import { SpotifyApi as SpotifyApiJs } from 'spotify-web-api-js';

declare module '@types/spotify-api' {
  namespace SpotifyApi {
    interface PlayHistoryObject {
      track: TrackObjectFull;
      played_at: string;
      context: ContextObject | null;
    }

    interface TrackObjectSimplified {
      artists: ArtistObjectSimplified[];
      name: string;
      id: string;
      uri: string;
      duration_ms: number;
    }

    interface TrackObjectFull extends TrackObjectSimplified {
      album: AlbumObjectSimplified;
      external_ids: ExternalIdObject;
      popularity: number;
      is_local?: boolean;
    }

    interface AlbumObjectSimplified {
      album_type: string;
      artists: ArtistObjectSimplified[];
      available_markets: string[];
      id: string;
      images: ImageObject[];
      name: string;
      release_date: string;
      type: 'album';
      uri: string;
    }

    interface ArtistObjectSimplified {
      id: string;
      name: string;
      type: 'artist';
      uri: string;
      genres?: string[];
    }

    interface ImageObject {
      height: number;
      url: string;
      width: number;
    }

    interface ExternalIdObject {
      [key: string]: string;
    }

    interface ContextObject {
      type: string;
      href: string;
      external_urls: {
        spotify: string;
      };
      uri: string;
    }
  }
}

export interface UserListeningData {
  topGenres: string[];
  topArtists: SpotifyApi.ArtistObjectFull[];
  averageMetrics: {
    valence: number;
    energy: number;
    danceability: number;
    acousticness: number;
  };
}

export interface MoodData {
  valence: number;
  energy: number;
  danceability: number;
  acousticness: number;
}

export {}; 