'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAudioStore, type AudioTrack } from '@/stores/audioStore';
import { useMediaSession } from './useMediaSession';

interface HowlInstance {
  play: () => void; pause: () => void; stop: () => void;
  fade: (from: number, to: number, ms: number) => HowlInstance;
  seek: (t?: number) => number | HowlInstance;
  rate: (r?: number) => number | HowlInstance;
  volume: (v?: number) => number | HowlInstance;
  mute: (m?: boolean) => boolean | HowlInstance;
  duration: () => number; playing: () => boolean; unload: () => void;
  on: (event: string, cb: (...args: unknown[]) => void) => HowlInstance;
}

let _howl: HowlInstance | null = null;
let _loadedUrl = '';

const FADE_MS = 400;

export function useAudio() {
  const store  = useAudioStore();
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);

  // Wire Media Session API
  useMediaSession();

  const load = useCallback(async (track: AudioTrack, autoPlay = true) => {
    // Fade out previous
    if (_howl?.playing()) {
      _howl.fade(store.isMuted ? 0 : store.volume, 0, FADE_MS);
      await new Promise((r) => setTimeout(r, FADE_MS));
    }
    if (_howl) { _howl.unload(); _howl = null; }
    if (ticker.current) clearInterval(ticker.current);

    store.setIsLoading(true);
    store.setTrack(track, false);

    const url = track.audioUrl;
    if (!url || url.startsWith('[')) { store.setIsLoading(false); return; }
    if (url === _loadedUrl && _howl) return;
    _loadedUrl = url;

    try {
      const { Howl } = await import('howler') as { Howl: new (o: object) => HowlInstance };
      _howl = new Howl({
        src: [url], html5: true, preload: true,
        volume: 0, // start silent, fade in
        rate: store.playbackRate,
        onload: () => {
          store.setIsLoading(false);
          store.setDuration(_howl?.duration() ?? 0);
          if (autoPlay) {
            _howl?.play();
            _howl?.fade(0, store.isMuted ? 0 : store.volume, FADE_MS);
            store.play();
          }
        },
        onend:        () => store.skipNext(),
        onloaderror:  (_id: unknown, err: unknown) => {
          console.warn('Audio load error:', err);
          store.setIsLoading(false);
        },
        onplayerror:  () => store.setIsLoading(false),
      });

      ticker.current = setInterval(() => {
        if (!_howl?.playing()) return;
        const t = _howl.seek() as number;
        if (typeof t === 'number') store.setCurrentTime(t);
      }, 500);

    } catch (e) {
      console.warn('Howler init error:', e);
      store.setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!_howl) return;
    if (store.isPlaying) _howl.play(); else _howl.pause();
  }, [store.isPlaying]);

  useEffect(() => {
    _howl?.volume(store.isMuted ? 0 : store.volume);
  }, [store.volume, store.isMuted]);

  useEffect(() => { _howl?.rate(store.playbackRate); }, [store.playbackRate]);

  const seek = useCallback((t: number) => {
    _howl?.seek(t); store.seek(t);
  }, [store]);

  useEffect(() => () => { if (ticker.current) clearInterval(ticker.current); }, []);

  return { ...store, load, seek };
}
