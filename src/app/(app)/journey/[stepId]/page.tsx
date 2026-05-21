'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import QuizSection from '@/components/journey/QuizSection';

// ─── Types ───────────────────────────────────────────────────────────────────

interface LessonData {
  id: string;
  order: number;
  title: string;
  content: string;
  verseRefs: string[];
  estimatedMinutes: number;
}

interface QuizQuestionData {
  id: string;
  order: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface StepData {
  id: string;
  order: number;
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  estimatedMinutes: number;
  lessons: LessonData[];
  quizQuestions: QuizQuestionData[];
  status: string;
  lessonsRead: number;
}

// ─── Markdown renderer (lightweight) ─────────────────────────────────────────

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-dark-900 dark:text-warm-100 mt-5 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-dark-900 dark:text-warm-100 mt-6 mb-3">$1</h2>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-saffron-400 pl-4 py-1 my-4 bg-saffron-50/50 dark:bg-saffron-950/20 italic text-warm-600 dark:text-warm-400 text-sm rounded-r-lg">$1</blockquote>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-dark-900 dark:text-warm-100">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1 text-warm-700 dark:text-warm-300">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc my-3 space-y-0.5">$&</ul>')
    .replace(/\n\n/g, '</p><p class="text-warm-700 dark:text-warm-300 leading-relaxed my-3">')
    .replace(/^([^<].+)$/gm, '<p class="text-warm-700 dark:text-warm-300 leading-relaxed my-3">$1</p>')
    .replace(/<p[^>]*><\/p>/g, '');
}

// ─── Lesson view ──────────────────────────────────────────────────────────────

function LessonView({
  lesson,
  stepTitle,
  stepIcon,
  totalLessons,
  onComplete,
}: {
  lesson: LessonData;
  stepTitle: string;
  stepIcon: string;
  totalLessons: number;
  onComplete: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [markedRead, setMarkedRead] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById('lesson-content');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Consider read when user has scrolled 80% of lesson content
      if (rect.bottom < window.innerHeight + 200) {
        setScrolled(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleComplete() {
    setMarkedRead(true);
    onComplete();
  }

  return (
    <div id="lesson-content">
      {/* Lesson header */}
      <div className="mb-6 flex items-center gap-2 text-sm text-warm-400">
        <span>{stepIcon}</span>
        <span>{stepTitle}</span>
        <ChevronRight className="h-3 w-3" />
        <span>
          Lesson {lesson.order} of {totalLessons}
        </span>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-dark-900 dark:text-warm-50">
        {lesson.title}
      </h1>

      <div className="mb-6 flex items-center gap-3 text-sm text-warm-400">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{lesson.estimatedMinutes} min read</span>
        </div>
        {lesson.verseRefs.length > 0 && (
          <>
            <span>·</span>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>Verses: {lesson.verseRefs.join(', ')}</span>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div
        className="prose-gita"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.content) }}
      />

      {/* Verse reference chips */}
      {lesson.verseRefs.length > 0 && (
        <div className="mt-6 rounded-xl border border-saffron-200 bg-saffron-50 p-4 dark:border-saffron-800 dark:bg-saffron-950/30">
          <div className="mb-2 text-xs font-medium text-saffron-600">
            Referenced verses
          </div>
          <div className="flex flex-wrap gap-2">
            {lesson.verseRefs.map((ref) => {
              const [ch, v] = ref.split('.');
              return (
                <Link
                  key={ref}
                  href={`/read/chapter-${ch}?verse=${v}`}
                  className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-saffron-600 shadow-sm transition-all hover:shadow-medium dark:bg-dark-800"
                >
                  <BookOpen className="h-3 w-3" />
                  {ref}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Mark as read */}
      <div className="mt-8">
        {!markedRead ? (
          <button
            onClick={handleComplete}
            className={cn(
              'w-full rounded-xl py-3 text-sm font-medium transition-all',
              scrolled
                ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-medium hover:shadow-large hover:-translate-y-0.5'
                : 'border border-warm-200 bg-warm-50 text-warm-400 cursor-default',
            )}
            disabled={!scrolled}
          >
            {scrolled ? '✓ Mark as read — Continue' : 'Scroll to read the full lesson'}
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 py-3 text-sm font-medium text-green-600 dark:bg-green-950/30">
            <CheckCircle2 className="h-4 w-4" />
            Lesson complete!
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function StepPage() {
  const params = useParams();
  const router = useRouter();
  const stepId = params.stepId as string;

  const [stepData, setStepData] = useState<StepData | null>(null);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState<Set<number>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/journey/step/${stepId}`);
        if (res.ok) {
          const data = await res.json();
          setStepData(data);
          setCurrentLessonIdx(data.lessonsRead ?? 0);
        } else {
          buildStaticData();
        }
      } catch {
        buildStaticData();
      } finally {
        setLoading(false);
      }
    }

    function buildStaticData() {
      // Static fallback so UI works before DB is wired
      const staticSteps: Record<string, Partial<StepData>> = {
        introduction: {
          order: 1, slug: 'introduction', title: 'Introduction to the Gita',
          subtitle: 'Discover the background and significance of the Bhagavad Gita',
          icon: '📖', estimatedMinutes: 15, status: 'UNLOCKED', lessonsRead: 0,
          lessons: [
            { id: '1', order: 1, title: 'What is the Bhagavad Gita?', verseRefs: ['1.29', '2.7'], estimatedMinutes: 7,
              content: `## What is the Bhagavad Gita?\n\nThe Bhagavad Gita, often called simply "the Gita," is a 700-verse Sanskrit scripture that is part of the ancient Indian epic, the Mahabharata.\n\n### The Setting\n\nThe Gita begins moments before a great civil war, as the warrior prince Arjuna surveys the opposing army and recognises family members, teachers, and friends.\n\n> "My limbs fail and my mouth is parched, my body quivers and my hair stands on end." — Arjuna (1.29)\n\n### The Teacher\n\nHis charioteer, Krishna — revealed to be the Supreme Being in human form — then imparts timeless wisdom over 18 chapters.` },
            { id: '2', order: 2, title: 'The 18 Chapters at a Glance', verseRefs: ['2.47', '18.66'], estimatedMinutes: 5,
              content: `## The 18 Chapters at a Glance\n\nThe Gita is structured as a conversation with Arjuna's questions and Krishna's answers woven across 18 chapters.\n\n### Three Sections\n\n**Chapters 1–6: Karma Kanda (Action)**\nFocus on self-discipline, selfless service, and the yoga of action.\n\n**Chapters 7–12: Bhakti Kanda (Devotion)**\nThe nature of God, devotion, and the path of surrender.\n\n**Chapters 13–18: Jnana Kanda (Knowledge)**\nThe nature of reality, the three gunas, and liberation.` },
          ],
          quizQuestions: [
            { id: 'q1', order: 1, question: 'On what battlefield does the Gita dialogue take place?', options: ['Hastinapura', 'Kurukshetra', 'Ayodhya', 'Vrindavan'], correctIndex: 1, explanation: 'The Gita takes place on the battlefield of Kurukshetra.' },
            { id: 'q2', order: 2, question: 'Who is the primary teacher in the Bhagavad Gita?', options: ['Arjuna', 'Vyasa', 'Krishna', 'Bhishma'], correctIndex: 2, explanation: "Krishna, acting as Arjuna's charioteer, is the teacher." },
            { id: 'q3', order: 3, question: 'How many verses does the Bhagavad Gita contain?', options: ['500', '600', '700', '800'], correctIndex: 2, explanation: 'The Bhagavad Gita contains 700 Sanskrit verses.' },
          ],
        },
      };
      const found = staticSteps[stepId];
      if (found) {
        setStepData({ id: stepId, ...found } as StepData);
      }
    }

    load();
  }, [stepId]);

  const handleLessonComplete = useCallback(() => {
    setLessonsCompleted((prev) => new Set([...prev, currentLessonIdx]));
    // Persist to API
    fetch(`/api/journey/step/${stepId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonIndex: currentLessonIdx }),
    }).catch(() => {});
  }, [currentLessonIdx, stepId]);

  const goToNextLesson = () => {
    if (!stepData) return;
    if (currentLessonIdx < stepData.lessons.length - 1) {
      setCurrentLessonIdx((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowQuiz(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizPassed(passed);
    if (passed) {
      fetch(`/api/journey/step/${stepId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score }),
      }).catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-saffron-500 border-t-transparent" />
      </div>
    );
  }

  if (!stepData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-warm-500">Step not found.</p>
        <Link href="/journey" className="text-saffron-600 hover:underline">
          Back to Journey
        </Link>
      </div>
    );
  }

  const currentLesson = stepData.lessons[currentLessonIdx];
  const isLastLesson = currentLessonIdx === stepData.lessons.length - 1;

  return (
    <div className="min-h-screen bg-warm-50 pb-24 dark:bg-dark-950">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-warm-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-dark-700 dark:bg-dark-900/80">
        <Link
          href="/journey"
          className="flex items-center gap-1.5 text-sm text-warm-500 hover:text-dark-900 dark:hover:text-warm-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Journey
        </Link>

        {/* Lesson progress dots */}
        <div className="flex items-center gap-1.5">
          {stepData.lessons.map((_, i) => (
            <button
              key={i}
              onClick={() => !showQuiz && setCurrentLessonIdx(i)}
              className={cn(
                'h-2 rounded-full transition-all',
                i === currentLessonIdx && !showQuiz
                  ? 'w-5 bg-saffron-500'
                  : lessonsCompleted.has(i)
                    ? 'w-2 bg-green-400'
                    : 'w-2 bg-warm-200',
              )}
              aria-label={`Lesson ${i + 1}`}
            />
          ))}
          <div
            className={cn(
              'ml-1 h-2 w-2 rounded-full transition-all',
              showQuiz ? 'bg-saffron-500 w-5' : quizPassed ? 'bg-green-400' : 'bg-warm-200',
            )}
            title="Quiz"
          />
        </div>

        <div className="text-sm font-medium text-dark-900 dark:text-warm-100">
          {stepData.icon} {stepData.title}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {!showQuiz ? (
          <>
            {/* Lesson selector tabs */}
            {stepData.lessons.length > 1 && (
              <div className="mb-6 flex gap-2 overflow-x-auto">
                {stepData.lessons.map((l, i) => (
                  <button
                    key={l.id}
                    onClick={() => setCurrentLessonIdx(i)}
                    className={cn(
                      'shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                      i === currentLessonIdx
                        ? 'bg-saffron-500 text-white'
                        : lessonsCompleted.has(i)
                          ? 'bg-green-50 text-green-600 dark:bg-green-950/30'
                          : 'bg-white text-warm-500 dark:bg-dark-800',
                    )}
                  >
                    {lessonsCompleted.has(i) && '✓ '}{l.title}
                  </button>
                ))}
              </div>
            )}

            <LessonView
              lesson={currentLesson}
              stepTitle={stepData.title}
              stepIcon={stepData.icon}
              totalLessons={stepData.lessons.length}
              onComplete={handleLessonComplete}
            />

            {/* Next lesson / start quiz CTA */}
            {lessonsCompleted.has(currentLessonIdx) && (
              <button
                onClick={goToNextLesson}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 py-3 text-sm font-medium text-white shadow-medium hover:shadow-large hover:-translate-y-0.5 transition-all"
              >
                {isLastLesson ? (
                  <>Take the quiz <ArrowRight className="h-4 w-4" /></>
                ) : (
                  <>Next lesson <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            )}
          </>
        ) : (
          <QuizSection
            questions={stepData.quizQuestions}
            stepTitle={stepData.title}
            stepIcon={stepData.icon}
            onComplete={handleQuizComplete}
            onBackToLessons={() => { setShowQuiz(false); setCurrentLessonIdx(0); }}
            onContinueJourney={() => router.push('/journey')}
          />
        )}
      </div>
    </div>
  );
}
