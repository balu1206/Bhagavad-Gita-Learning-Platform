import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type RepeatMode = 'none' | 'one' | 'all';

export interface AudioTrack {
  id: string;
  chapter: number;
  verse: number;
  chapterTitle: string;
  label: string;
  audioUrl: string;
  duration?: number;
}

interface AudioState {
  currentTrack: AudioTrack | null;
  queue: AudioTrack[];
  queueIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  playbackRate: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  isMiniPlayerVisible: boolean;
  isFullPlayerOpen: boolean;
}

interface AudioActions {
  setTrack: (track: AudioTrack, autoPlay?: boolean) => void;
  setQueue: (tracks: AudioTrack[], startIndex?: number) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  skipNext: () => void;
  skipPrev: () => void;
  setVolume: (v: number) => void;
  setPlaybackRate: (r: number) => void;
  toggleMute: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
  setIsLoading: (b: boolean) => void;
  setBuffered: (b: number) => void;
  showMiniPlayer: () => void;
  hideMiniPlayer: () => void;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
}

export const useAudioStore = create<AudioState & AudioActions>()(
  subscribeWithSelector((set, get) => ({
    currentTrack: null, queue: [], queueIndex: 0,
    isPlaying: false, isLoading: false, currentTime: 0,
    duration: 0, buffered: 0, volume: 0.8, playbackRate: 1,
    isMuted: false, repeatMode: 'none', isShuffled: false,
    isMiniPlayerVisible: false, isFullPlayerOpen: false,

    setTrack: (track, autoPlay = true) =>
      set({ currentTrack: track, currentTime: 0, isPlaying: autoPlay, isMiniPlayerVisible: true }),

    setQueue: (tracks, startIndex = 0) =>
      set({ queue: tracks, queueIndex: startIndex, currentTrack: tracks[startIndex] ?? null }),

    play:       () => set({ isPlaying: true }),
    pause:      () => set({ isPlaying: false }),
    togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
    seek:       (t) => set({ currentTime: t }),

    skipNext: () => {
      const { queue, queueIndex, repeatMode } = get();
      if (!queue.length) return;
      if (repeatMode === 'one') { set({ currentTime: 0 }); return; }
      const next = queueIndex + 1;
      if (next >= queue.length) {
        if (repeatMode === 'all') set({ queueIndex: 0, currentTrack: queue[0], currentTime: 0 });
        else set({ isPlaying: false });
        return;
      }
      set({ queueIndex: next, currentTrack: queue[next], currentTime: 0 });
    },

    skipPrev: () => {
      const { queue, queueIndex, currentTime } = get();
      if (currentTime > 3) { set({ currentTime: 0 }); return; }
      const prev = Math.max(0, queueIndex - 1);
      set({ queueIndex: prev, currentTrack: queue[prev] ?? get().currentTrack, currentTime: 0 });
    },

    setVolume:       (v) => set({ volume: v, isMuted: v === 0 }),
    setPlaybackRate: (r) => set({ playbackRate: r }),
    toggleMute:      () => set((s) => ({ isMuted: !s.isMuted })),
    setRepeatMode:   (mode) => set({ repeatMode: mode }),
    toggleShuffle:   () => set((s) => ({ isShuffled: !s.isShuffled })),
    setCurrentTime:  (t) => set({ currentTime: t }),
    setDuration:     (d) => set({ duration: d }),
    setIsLoading:    (b) => set({ isLoading: b }),
    setBuffered:     (b) => set({ buffered: b }),
    showMiniPlayer:  () => set({ isMiniPlayerVisible: true }),
    hideMiniPlayer:  () => set({ isMiniPlayerVisible: false }),
    openFullPlayer:  () => set({ isFullPlayerOpen: true }),
    closeFullPlayer: () => set({ isFullPlayerOpen: false }),
  })),
);
