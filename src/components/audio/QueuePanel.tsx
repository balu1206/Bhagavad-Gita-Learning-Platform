'use client';

import { useState, useRef, useCallback } from 'react';
import { GripVertical, X, Play, Music } from 'lucide-react';
import { useAudioStore, type AudioTrack } from '@/stores/audioStore';
import { useAudio } from '@/hooks/useAudio';
import { cn } from '@/lib/utils';

export function QueuePanel() {
  const store = useAudioStore();
  const audio = useAudio();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);

  const handleDragStart = (i: number) => {
    dragItem.current = i;
    setDragIndex(i);
  };

  const handleDragEnter = (i: number) => setDropIndex(i);

  const handleDragEnd = useCallback(() => {
    const from = dragItem.current;
    const to   = dropIndex;
    if (from === null || to === null || from === to) {
      setDragIndex(null); setDropIndex(null); dragItem.current = null;
      return;
    }
    const next = [...store.queue];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);

    // Recalculate current index
    const currentId = store.currentTrack?.id;
    const newIndex  = next.findIndex((t) => t.id === currentId);
    store.setQueue(next, newIndex >= 0 ? newIndex : 0);

    setDragIndex(null); setDropIndex(null); dragItem.current = null;
  }, [dropIndex, store]);

  const removeFromQueue = useCallback((id: string) => {
    const next = store.queue.filter((t) => t.id !== id);
    const currentId = store.currentTrack?.id;
    const newIndex  = next.findIndex((t) => t.id === currentId);
    store.setQueue(next, newIndex >= 0 ? newIndex : 0);
  }, [store]);

  if (!store.queue.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <Music className="w-10 h-10 text-dark-600" />
        <p className="text-dark-400 text-sm">Queue is empty</p>
        <p className="text-dark-600 text-xs">Open a chapter to start listening</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-full">
      <p className="text-xs text-dark-500 uppercase tracking-widest px-4 py-3 sticky top-0 bg-dark-950/80 backdrop-blur-sm">
        Up Next · {store.queue.length} verses
      </p>
      <ul className="space-y-0.5 pb-4">
        {store.queue.map((track, i) => (
          <QueueItem
            key={track.id}
            track={track}
            index={i}
            isCurrent={i === store.queueIndex}
            isPlaying={store.isPlaying && i === store.queueIndex}
            isDragging={dragIndex === i}
            isDropTarget={dropIndex === i && dragIndex !== i}
            onPlay={() => { store.setQueue(store.queue, i); void audio.load(track); }}
            onRemove={() => removeFromQueue(track.id)}
            onDragStart={() => handleDragStart(i)}
            onDragEnter={() => handleDragEnter(i)}
            onDragEnd={handleDragEnd}
          />
        ))}
      </ul>
    </div>
  );
}

interface QueueItemProps {
  track: AudioTrack;
  index: number;
  isCurrent: boolean;
  isPlaying: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  onPlay: () => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
}

function QueueItem({
  track, index, isCurrent, isPlaying, isDragging, isDropTarget,
  onPlay, onRemove, onDragStart, onDragEnter, onDragEnd,
}: QueueItemProps) {
  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 group transition-all',
        isCurrent  && 'bg-saffron-900/30',
        isDragging && 'opacity-40',
        isDropTarget && 'border-t-2 border-saffron-500',
      )}
    >
      {/* Drag handle */}
      <div className="cursor-grab active:cursor-grabbing text-dark-700 group-hover:text-dark-500 transition-colors flex-shrink-0">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Index / playing indicator */}
      <div className="w-5 flex-shrink-0 text-center">
        {isCurrent && isPlaying ? (
          <span className="text-saffron-400 text-xs">▶</span>
        ) : (
          <span className="text-dark-600 text-xs tabular-nums">{index + 1}</span>
        )}
      </div>

      {/* Track info */}
      <button onClick={onPlay} className="flex-1 text-left min-w-0">
        <p className={cn(
          'text-sm truncate',
          isCurrent ? 'text-saffron-300 font-medium' : 'text-dark-300 hover:text-white transition-colors',
        )}>
          {track.label}
        </p>
        <p className="text-xs text-dark-600 truncate">{track.chapterTitle}</p>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {!isCurrent && (
          <button
            onClick={onPlay}
            className="p-1 rounded text-dark-500 hover:text-white transition-colors"
            aria-label="Play this verse"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={onRemove}
          className="p-1 rounded text-dark-500 hover:text-red-400 transition-colors"
          aria-label="Remove from queue"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </li>
  );
}
