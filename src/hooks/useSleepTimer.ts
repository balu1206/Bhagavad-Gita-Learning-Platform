'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioStore } from '@/stores/audioStore';

export type SleepOption = 5 | 10 | 15 | 30 | 45 | 60 | 'end-of-verse';

export function useSleepTimer() {
  const store = useAudioStore();
  const [option, setOption]         = useState<SleepOption | null>(null);
  const [remaining, setRemaining]   = useState<number | null>(null); // seconds
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetRef = useRef<number | null>(null);

  const start = useCallback((opt: SleepOption) => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (opt === 'end-of-verse') {
      setOption('end-of-verse');
      setRemaining(null);
      return;
    }

    const endsAt = Date.now() + opt * 60 * 1000;
    targetRef.current = endsAt;
    setOption(opt);
    setRemaining(opt * 60);

    timerRef.current = setInterval(() => {
      const left = Math.max(0, Math.round((targetRef.current! - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        store.pause();
        cancel();
      }
    }, 1000);
  }, [store]); // eslint-disable-line react-hooks/exhaustive-deps

  const cancel = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    targetRef.current = null;
    setOption(null);
    setRemaining(null);
  }, []);

  // end-of-verse: pause when track ends
  useEffect(() => {
    if (option !== 'end-of-verse') return;
    const unsub = useAudioStore.subscribe(
      (s) => s.currentTime,
      (t) => {
        const dur = useAudioStore.getState().duration;
        if (dur > 0 && t >= dur - 0.5) {
          useAudioStore.getState().pause();
          cancel();
        }
      },
    );
    return unsub;
  }, [option, cancel]);

  // Cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return { option, remaining, start, cancel, isActive: option !== null };
}
