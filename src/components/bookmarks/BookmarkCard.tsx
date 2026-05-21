'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Pencil, Trash2, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';

export interface BookmarkData {
  id:        string;
  verseId:   string;
  note?:     string | null;
  tags:      string[];
  createdAt: string;
  verse: {
    number: number;
    slug:   string;
    sanskrit:    string;
    translation: string;
    chapter: { number: number; title: string };
  };
}

interface BookmarkCardProps {
  bookmark:  BookmarkData;
  view:      'grid' | 'list';
  onEdit:    (bookmark: BookmarkData) => void;
  onDelete:  (id: string) => void;
}

export function BookmarkCard({ bookmark, view, onEdit, onDelete }: BookmarkCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { verse } = bookmark;
  const ref = `${verse.chapter.number}.${verse.number}`;

  if (view === 'list') {
    return (
      <div className="flex items-start gap-4 p-4 rounded-xl border border-warm-100 dark:border-dark-700 hover:border-saffron-200 dark:hover:border-saffron-800 bg-white dark:bg-dark-900 transition-all group">
        <Link href={`/chapters/${verse.chapter.number}/${verse.number}`} className="flex-1 min-w-0 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="font-semibold text-saffron-600 dark:text-saffron-400 text-sm">{ref}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-saffron-600 dark:text-saffron-400 font-medium mb-0.5">{verse.chapter.title}</p>
            <p className="text-sm text-dark-700 dark:text-dark-200 line-clamp-2 leading-relaxed">
              &ldquo;{verse.translation}&rdquo;
            </p>
            {bookmark.note && (
              <p className="text-xs text-dark-500 dark:text-dark-400 mt-1.5 italic line-clamp-1">📝 {bookmark.note}</p>
            )}
            {bookmark.tags.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {bookmark.tags.map((t) => (
                  <Badge key={t} variant="default" size="sm">{t}</Badge>
                ))}
              </div>
            )}
          </div>
        </Link>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => onEdit(bookmark)} className="p-1.5 rounded text-dark-400 hover:text-saffron-500 transition-colors" aria-label="Edit"><Pencil className="w-3.5 h-3.5" /></button>
          {confirmDelete
            ? <><button onClick={() => onDelete(bookmark.id)} className="px-2 py-1 rounded text-xs bg-red-500 text-white">Delete</button>
                <button onClick={() => setConfirmDelete(false)} className="px-2 py-1 rounded text-xs text-dark-400">Cancel</button></>
            : <button onClick={() => setConfirmDelete(true)} className="p-1.5 rounded text-dark-400 hover:text-red-500 transition-colors" aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
          }
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <Card variant="interactive" className="p-5 flex flex-col h-full group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-semibold text-saffron-600 dark:text-saffron-400 uppercase tracking-wide">{ref}</span>
          <p className="text-xs text-dark-400 dark:text-dark-500 mt-0.5">{verse.chapter.title}</p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(bookmark)} className="p-1 rounded text-dark-400 hover:text-saffron-500 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
          {confirmDelete
            ? <><button onClick={() => onDelete(bookmark.id)} className="px-1.5 py-0.5 rounded text-xs bg-red-500 text-white">Delete</button>
                <button onClick={() => setConfirmDelete(false)} className="text-xs text-dark-400 ml-1">✕</button></>
            : <button onClick={() => setConfirmDelete(true)} className="p-1 rounded text-dark-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          }
        </div>
      </div>

      <Link href={`/chapters/${verse.chapter.number}/${verse.number}`} className="flex-1">
        <p className="font-sanskrit text-sm text-dark-600 dark:text-dark-300 line-clamp-2 mb-2 leading-relaxed">
          {verse.sanskrit}
        </p>
        <p className="text-sm text-dark-500 dark:text-dark-400 line-clamp-3 leading-relaxed italic">
          &ldquo;{verse.translation}&rdquo;
        </p>
      </Link>

      {bookmark.note && (
        <div className="mt-3 pt-3 border-t border-warm-100 dark:border-dark-700">
          <p className="text-xs text-dark-500 dark:text-dark-400 line-clamp-2">📝 {bookmark.note}</p>
        </div>
      )}

      {bookmark.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {bookmark.tags.slice(0, 3).map((t) => <Badge key={t} variant="default" size="sm">{t}</Badge>)}
          {bookmark.tags.length > 3 && <Badge variant="default" size="sm">+{bookmark.tags.length - 3}</Badge>}
        </div>
      )}

      <Link
        href={`/chapters/${verse.chapter.number}/${verse.number}`}
        className="mt-3 flex items-center gap-1 text-xs text-saffron-600 dark:text-saffron-400 hover:gap-2 transition-all"
      >
        <BookOpen className="w-3 h-3" /> Read verse <ChevronRight className="w-3 h-3" />
      </Link>
    </Card>
  );
}
