'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Lock, CheckCircle2, ChevronRight } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type StepStatus = 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED';

interface JourneyStepData {
  id: string;
  order: number;
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  estimatedMinutes: number;
  status: StepStatus;
  lessonCount: number;
  quizScore?: number;
  quizPassed?: boolean;
}

// ─── Static step definitions (used for display when API not yet available) ───

const JOURNEY_STEPS_STATIC: Omit<JourneyStepData, 'id' | 'status' | 'lessonCount' | 'quizScore' | 'quizPassed'>[] = [
  { order: 1, slug: 'introduction',    title: 'Introduction to the Gita',    subtitle: 'Discover the background and significance',             icon: '📖', estimatedMinutes: 15 },
  { order: 2, slug: 'key-concepts',    title: 'Key Sanskrit Concepts',       subtitle: 'Master the essential vocabulary',                      icon: '🔑', estimatedMinutes: 20 },
  { order: 3, slug: 'battlefield-setting', title: 'The Battlefield Setting', subtitle: "Understanding Arjuna's crisis",                        icon: '⚔️', estimatedMinutes: 18 },
  { order: 4, slug: 'core-teachings',  title: 'Core Teachings',              subtitle: 'The central philosophy of the Gita',                  icon: '🕉️', estimatedMinutes: 25 },
  { order: 5, slug: 'paths-of-yoga',   title: 'The Four Paths of Yoga',     subtitle: 'Explore the routes to union with the divine',          icon: '🧘', estimatedMinutes: 22 },
  { order: 6, slug: 'the-divine',      title: "The Divine — Krishna's Nature", subtitle: "Understand the nature of God",                      icon: '✨', estimatedMinutes: 20 },
  { order: 7, slug: 'liberation',      title: 'Liberation & Self-Realisation', subtitle: "The Gita's teaching on freedom",                    icon: '🌅', estimatedMinutes: 18 },
  { order: 8, slug: 'daily-practice',  title: 'Daily Practice & Integration', subtitle: "Bringing the Gita's wisdom into everyday life",      icon: '🌿', estimatedMinutes: 15 },
];

// ─── Step card ────────────────────────────────────────────────────────────────

function StepCard({
  step,
  isLast,
}: {
  step: JourneyStepData;
  isLast: boolean;
}) {
  const isLocked = step.status === 'LOCKED';
  const isCompleted = step.status === 'COMPLETED';
  const isActive = step.status === 'UNLOCKED' || step.status === 'IN_PROGRESS';

  return (
    <div className="flex gap-4">
      {/* Left: connector line + icon */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl transition-all',
            isCompleted && 'bg-green-100 ring-2 ring-green-400',
            isActive && 'bg-saffron-50 ring-2 ring-saffron-400 shadow-glow',
            isLocked && 'bg-warm-100 opacity-50',
          )}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          ) : isLocked ? (
            <Lock className="h-5 w-5 text-warm-400" />
          ) : (
            <span>{step.icon}</span>
          )}
        </div>
        {!isLast && (
          <div
            className={cn(
              'mt-1 w-0.5 flex-1',
              isCompleted ? 'bg-green-300' : 'bg-warm-200',
            )}
            style={{ minHeight: '32px' }}
          />
        )}
      </div>

      {/* Right: content card */}
      <div className="mb-6 flex-1 pb-2">
        <div
          className={cn(
            'rounded-2xl border p-4 transition-all',
            isCompleted &&
              'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/30',
            isActive &&
              'border-saffron-200 bg-white shadow-soft hover:shadow-medium dark:border-saffron-800 dark:bg-dark-800',
            isLocked &&
              'border-warm-200 bg-warm-50/50 opacity-60 dark:border-dark-700 dark:bg-dark-900',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={cn(
                    'text-xs font-medium',
                    isCompleted && 'text-green-600',
                    isActive && 'text-saffron-600',
                    isLocked && 'text-warm-400',
                  )}
                >
                  Step {step.order}
                </span>
                {isCompleted && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Complete
                  </span>
                )}
                {step.status === 'IN_PROGRESS' && (
                  <span className="rounded-full bg-saffron-100 px-2 py-0.5 text-xs font-medium text-saffron-700">
                    In progress
                  </span>
                )}
              </div>

              <h3
                className={cn(
                  'text-base font-semibold',
                  isLocked
                    ? 'text-warm-400'
                    : 'text-dark-900 dark:text-warm-50',
                )}
              >
                {step.title}
              </h3>
              <p
                className={cn(
                  'mt-0.5 text-sm',
                  isLocked ? 'text-warm-300' : 'text-warm-500',
                )}
              >
                {step.subtitle}
              </p>

              <div className="mt-3 flex items-center gap-3 text-xs text-warm-400">
                <span>{step.estimatedMinutes} min</span>
                <span>·</span>
                <span>{step.lessonCount} lessons</span>
                {isCompleted && step.quizScore !== undefined && (
                  <>
                    <span>·</span>
                    <span className="font-medium text-green-600">
                      Quiz: {step.quizScore}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {isActive && (
              <Link
                href={`/journey/${step.slug}`}
                className="flex shrink-0 items-center gap-1 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-medium hover:-translate-y-0.5"
              >
                {step.status === 'IN_PROGRESS' ? 'Continue' : 'Start'}
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
            {isCompleted && (
              <Link
                href={`/journey/${step.slug}`}
                className="flex shrink-0 items-center gap-1 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-all hover:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
              >
                Review
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JourneyPage() {
  const [steps, setSteps] = useState<JourneyStepData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/journey/progress');
        if (res.ok) {
          const data = await res.json();
          if (data.steps && data.steps.length > 0) {
            setSteps(data.steps);
          } else {
            buildStaticSteps(0);
          }
        } else {
          buildStaticSteps(0);
        }
      } catch {
        buildStaticSteps(0);
      } finally {
        setLoading(false);
      }
    }

    function buildStaticSteps(completedCount: number) {
      const built: JourneyStepData[] = JOURNEY_STEPS_STATIC.map((s, i) => ({
        ...s,
        id: `static-${s.order}`,
        lessonCount: s.order <= 2 ? 2 : 1,
        status:
          i < completedCount
            ? 'COMPLETED'
            : i === completedCount
              ? 'UNLOCKED'
              : 'LOCKED',
      }));
      setSteps(built);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-saffron-500 border-t-transparent" />
      </div>
    );
  }

  const completedCount = steps.filter((s) => s.status === 'COMPLETED').length;
  const nextStep = steps.find(
    (s) => s.status === 'UNLOCKED' || s.status === 'IN_PROGRESS',
  );

  return (
    <div className="min-h-screen bg-warm-50 pb-24 pt-6 dark:bg-dark-950">
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark-900 dark:text-warm-50">
            Beginner Journey
          </h1>
          <p className="mt-1 text-warm-500">
            A guided 8-step path through the Bhagavad Gita
          </p>
        </div>

        {/* Simple progress bar (no gamification) */}
        <div className="mb-6 rounded-2xl bg-white dark:bg-dark-800 border border-warm-100 dark:border-dark-700 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-dark-700 dark:text-dark-200">Your Progress</span>
            <span className="text-sm text-saffron-600 dark:text-saffron-400 font-semibold">{completedCount} / 8 steps</span>
          </div>
          <div className="h-2 w-full rounded-full bg-warm-100 dark:bg-dark-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-saffron-400 to-saffron-600 transition-all duration-500"
              style={{ width: `${(completedCount / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Next step highlight */}
        {nextStep && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-saffron-500 to-saffron-600 p-4 text-white shadow-medium">
            <div className="mb-1 text-xs font-medium text-saffron-100">
              Continue your journey
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">{nextStep.title}</h3>
                <p className="text-sm text-saffron-100">{nextStep.subtitle}</p>
              </div>
              <Link
                href={`/journey/${nextStep.slug}`}
                className="flex shrink-0 items-center gap-1 rounded-xl bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30"
              >
                Begin <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Step path */}
        <div>
          {steps.map((step, i) => (
            <StepCard key={step.id} step={step} isLast={i === steps.length - 1} />
          ))}
        </div>

        {/* Completion message */}
        {completedCount === 8 && (
          <div className="mt-4 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 p-6 text-center text-white shadow-large">
            <div className="mb-2 text-4xl">🏆</div>
            <h3 className="text-xl font-bold">Journey Complete!</h3>
            <p className="mt-1 text-gold-100">
              You have walked the full path of the Gita. Congratulations, seeker.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
