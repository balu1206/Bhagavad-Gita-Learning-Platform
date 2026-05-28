'use client';

import { useEffect } from 'react';
import { useAudioStore } from '@/stores/audioStore';
import { CHAPTER_TITLES } from '@/lib/audioManifest';

/**
 * Wires the Web Media Session API so the OS lock screen / notification
 * area shows track info and responds to hardware media buttons.
 *
 * Safe to call unconditionally — no-ops when the API is unavailable.
 */
export function useMediaSession() {
  const store = useAudioStore();
  const track = store.currentTrack;

  // Update metadata whenever track changes
  useEffect(() => {
    if (!('mediaSession' in navigator) || !track) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title:  track.label,
      artist: CHAPTER_TITLES[track.chapter] ?? 'Bhagavad Gita',
      album:  'Bhagavad Gita',
      artwork: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    });
  }, [track]);

  // Update playback state
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = store.isPlaying ? 'playing' : 'paused';
  }, [store.isPlaying]);

  // Register action handlers
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const handlers: [MediaSessionAction, () => void][] = [
      ['play',         store.play],
      ['pause',        store.pause],
      ['nexttrack',    store.skipNext],
      ['previoustrack', store.skipPrev],
    ];

    for (const [action, handler] of handlers) {
      try { navigator.mediaSession.setActionHandler(action, handler); }
      catch { /* action not supported on this platform */ }
    }

    // Seekto / seekbackward / seekforward
    try {
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) store.seek(details.seekTime);
      });
    } catch { /* not supported */ }

    return () => {
      for (const [action] of handlers) {
        try { navigator.mediaSession.setActionHandler(action, null); }
        catch { /* ignore */ }
      }
    };
  }, [store]);
}
