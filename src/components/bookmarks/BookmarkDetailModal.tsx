'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import { Tag, Save, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import type { BookmarkData } from './BookmarkCard';

interface BookmarkDetailModalProps {
  bookmark: BookmarkData | null;
  isOpen:   boolean;
  onClose:  () => void;
  onSave:   (id: string, note: string, tags: string[]) => Promise<void>;
}

export function BookmarkDetailModal({ bookmark, isOpen, onClose, onSave }: BookmarkDetailModalProps) {
  const [note,    setNote]    = useState('');
  const [tags,    setTags]    = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (bookmark) {
      setNote(bookmark.note ?? '');
      setTags(bookmark.tags);
      setTagInput('');
    }
  }, [bookmark]);

  const addTag = (raw: string) => {
    const t = raw.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags((prev) => [...prev, t]);
    }
    setTagInput('');
  };

  const handleTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); }
    if (e.key === 'Backspace' && !tagInput) setTags((prev) => prev.slice(0, -1));
  };

  const handleSave = async () => {
    if (!bookmark) return;
    setSaving(true);
    try { await onSave(bookmark.id, note, tags); onClose(); }
    finally { setSaving(false); }
  };

  if (!bookmark) return null;
  const { verse } = bookmark;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title={`Verse ${verse.chapter.number}.${verse.number}`}>
      <div className="space-y-5">
        {/* Verse text */}
        <div className="bg-warm-50 dark:bg-dark-800 rounded-xl p-4">
          <p className="font-sanskrit text-sm text-dark-700 dark:text-dark-200 leading-relaxed mb-2">
            {verse.sanskrit}
          </p>
          <p className="text-sm text-dark-500 dark:text-dark-400 italic leading-relaxed">
            &ldquo;{verse.translation}&rdquo;
          </p>
          <p className="text-xs text-dark-300 dark:text-dark-600 mt-2">{verse.chapter.title}</p>
        </div>

        {/* Note editor */}
        <div>
          <label className="block text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-widest mb-2">
            Your Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your reflection, insight, or note here…"
            rows={4}
            maxLength={2000}
            className="w-full rounded-xl border border-warm-200 dark:border-dark-600 bg-white dark:bg-dark-900 text-dark-800 dark:text-dark-100 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-saffron-500/40 focus:border-saffron-400 transition-colors placeholder:text-dark-300"
          />
          <p className="text-xs text-dark-300 dark:text-dark-600 text-right mt-1">{note.length}/2000</p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-widest mb-2">
            <Tag className="w-3 h-3 inline mr-1" />Tags
          </label>
          <div className="flex flex-wrap gap-1.5 min-h-[2.5rem] p-2 rounded-xl border border-warm-200 dark:border-dark-600 bg-white dark:bg-dark-900 focus-within:ring-2 focus-within:ring-saffron-500/40 focus-within:border-saffron-400 transition-colors">
            {tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-saffron-100 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-300 text-xs font-medium">
                {t}
                <button onClick={() => setTags(tags.filter((x) => x !== t))} className="hover:text-red-500 transition-colors">×</button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
              onBlur={() => tagInput && addTag(tagInput)}
              placeholder={tags.length === 0 ? 'Add tags (Enter to confirm)…' : ''}
              className="flex-1 min-w-[120px] bg-transparent text-sm text-dark-700 dark:text-dark-200 outline-none placeholder:text-dark-300"
            />
          </div>
          <p className="text-xs text-dark-300 dark:text-dark-600 mt-1">Press Enter or comma to add a tag</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <Link
            href={`/chapters/${verse.chapter.number}/${verse.number}`}
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm text-saffron-600 dark:text-saffron-400 hover:underline"
          >
            <BookOpen className="w-3.5 h-3.5" /> Read verse
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSave} isLoading={saving}>
              <Save className="w-3.5 h-3.5" /> Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
