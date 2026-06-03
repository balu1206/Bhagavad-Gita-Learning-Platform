'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Volume2, Bookmark, Eye } from 'lucide-react';

const SAMPLE_VERSE = {
  chapter: 2,
  verse: 47,
  chapterTitle: 'Contents of the Gita Summarised',
  sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
  transliteration: 'karmaṇy evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi',
  wordMeanings: [
    { word: 'karmaṇi', meaning: 'in prescribed duties' },
    { word: 'eva', meaning: 'certainly' },
    { word: 'adhikāraḥ', meaning: 'right' },
    { word: 'te', meaning: 'of you' },
    { word: 'mā', meaning: 'never' },
    { word: 'phaleṣu', meaning: 'in the fruits' },
    { word: 'kadācana', meaning: 'at any time' },
  ],
  translation: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
  commentary: "There are three considerations here: prescribed duties, capricious work according to one's whims, and nonperformance of duties. Prescribed duties refer to activities performed while one is in the modes of material nature. Capricious work means actions without the sanction of authority, and nonperformance of duties refers to not discharging one's prescribed duties. The Lord advised that Arjuna not be inactive, but that he perform his prescribed duty without being attached to the result. One who is attached to the result of his work is also the cause of the action. Thus he is the enjoyer or sufferer of the result of such actions.",
};

export function ChapterPreview() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 bg-warm-50 dark:bg-dark-850">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-saffron-600 dark:text-saffron-400 mb-3">
            The reading experience
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-dark-900 dark:text-dark-100 mb-4">
            Exactly what you&rsquo;ll see inside
          </h2>
          <p className="mx-auto max-w-xl text-dark-500 dark:text-dark-400">
            A live preview of BG 2.47 — the most celebrated verse of the Gita — in our full reading experience.
          </p>
        </div>

        {/* Browser chrome */}
        <div className="rounded-3xl border border-warm-200 dark:border-dark-700 shadow-xl overflow-hidden bg-white dark:bg-dark-800">
          {/* Fake browser toolbar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-warm-100 dark:border-dark-700 bg-warm-50 dark:bg-dark-900">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4 h-7 rounded-lg bg-white dark:bg-dark-700 border border-warm-200 dark:border-dark-600 flex items-center px-3">
              <span className="text-xs text-dark-400 dark:text-dark-500 truncate">
                gitapath.app/chapters/2/47
              </span>
            </div>
          </div>

          {/* Simulated reader header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-warm-100 dark:border-dark-700 bg-white dark:bg-dark-800">
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-saffron-500" />
              <span className="text-sm font-medium text-dark-600 dark:text-dark-300">
                Chapter 2 · {SAMPLE_VERSE.chapterTitle}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-dark-400 dark:text-dark-500">
              <span>2 / 72</span>
              <div className="w-16 h-1.5 bg-warm-200 dark:bg-dark-700 rounded-full overflow-hidden">
                <div className="w-[3%] h-full bg-saffron-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Verse content */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-7 max-h-[560px] overflow-y-auto">
            {/* Chapter/verse label */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-warm-200 dark:to-dark-700" />
              <span className="text-xs font-semibold text-saffron-500 dark:text-saffron-400 uppercase tracking-widest px-2">
                Chapter 2 &middot; Verse 47
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-warm-200 dark:to-dark-700" />
            </div>

            {/* Sanskrit section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-widest">Sanskrit</h3>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 text-xs text-dark-400 dark:text-dark-500">
                    <Eye className="w-3.5 h-3.5" />
                    Hide transliteration
                  </button>
                  <button className="flex items-center gap-1 text-xs text-saffron-600 dark:text-saffron-400">
                    <Volume2 className="w-3.5 h-3.5" />
                    Listen
                  </button>
                  <button className="flex items-center gap-1 text-xs text-dark-400 dark:text-dark-500">
                    <Bookmark className="w-3.5 h-3.5" />
                    Save
                  </button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-warm-50 to-saffron-50/30 dark:from-dark-800 dark:to-dark-800/50 rounded-2xl p-6 border border-warm-200 dark:border-dark-700 text-center">
                <p className="font-sanskrit text-2xl sm:text-3xl text-dark-900 dark:text-white leading-loose whitespace-pre-line">
                  {SAMPLE_VERSE.sanskrit}
                </p>
                <p className="mt-4 text-sm text-dark-500 dark:text-dark-400 italic leading-relaxed whitespace-pre-line">
                  {SAMPLE_VERSE.transliteration}
                </p>
              </div>
            </div>

            {/* Word meanings */}
            <div>
              <h3 className="text-xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-widest mb-3">
                Word-by-Word
              </h3>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_VERSE.wordMeanings.map(({ word, meaning }) => (
                  <div
                    key={word}
                    className="rounded-lg border border-warm-200 dark:border-dark-700 bg-warm-50 dark:bg-dark-900 px-3 py-2 text-center"
                  >
                    <p className="font-sanskrit text-sm text-saffron-700 dark:text-saffron-300">{word}</p>
                    <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">{meaning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Translation */}
            <div>
              <h3 className="text-xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-widest mb-3">
                Translation
              </h3>
              <blockquote className="border-l-4 border-saffron-400 dark:border-saffron-600 pl-5 py-1">
                <p className="text-dark-800 dark:text-dark-100 text-base leading-relaxed font-serif">
                  &ldquo;{SAMPLE_VERSE.translation}&rdquo;
                </p>
                <footer className="mt-2 text-xs text-dark-400 dark:text-dark-500">
                  &mdash; Swami Sivananda
                </footer>
              </blockquote>
            </div>

            {/* Commentary preview */}
            <div>
              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-warm-50 dark:bg-dark-900 border border-warm-200 dark:border-dark-700">
                <span className="text-sm font-semibold text-dark-700 dark:text-dark-200">Commentary</span>
                <span className="text-xs text-saffron-500">▼ Expand</span>
              </div>
              <div className="mt-3 px-4 py-3 space-y-2">
                <p className="text-dark-600 dark:text-dark-300 text-sm leading-relaxed line-clamp-3">
                  {SAMPLE_VERSE.commentary}
                </p>
              </div>
            </div>
          </div>

          {/* CTA footer */}
          <div className="px-6 py-5 border-t border-warm-100 dark:border-dark-700 bg-gradient-to-r from-saffron-50 to-gold-50/50 dark:from-saffron-900/10 dark:to-gold-900/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-dark-600 dark:text-dark-300 text-center sm:text-left">
              This is exactly how every verse looks. 700 more await you.
            </p>
            <Link
              href="/chapters/2/47"
              className="inline-flex items-center gap-2 h-10 px-6 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-gold-500 text-white shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
              Read BG 2.47
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
