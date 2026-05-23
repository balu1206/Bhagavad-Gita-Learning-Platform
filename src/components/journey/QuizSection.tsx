'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, Trophy } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface QuizQuestion {
  id: string;
  order: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizSectionProps {
  questions: QuizQuestion[];
  stepTitle: string;
  stepIcon: string;
  onComplete: (score: number, passed: boolean) => void;
  onBackToLessons: () => void;
  onContinueJourney: () => void;
}

type AnswerState = Record<number, number>; // questionIdx → chosen optionIdx

// ─── Score display ────────────────────────────────────────────────────────────

function ScoreDisplay({
  score,
  total,
  passed,
  onRetry,
  onContinue,
}: {
  score: number;
  total: number;
  passed: boolean;
  onRetry: () => void;
  onContinue: () => void;
}) {
  const pct = Math.round((score / total) * 100);

  return (
    <div className="text-center">
      <div className="mb-4 text-5xl">{passed ? '🏆' : '📚'}</div>

      <h2 className="text-2xl font-bold text-dark-900 dark:text-warm-50">
        {passed ? 'Quiz Passed!' : 'Keep Studying'}
      </h2>
      <p className="mt-1 text-warm-500">
        You got {score} out of {total} correct
      </p>

      {/* Score ring */}
      <div className="my-6 flex justify-center">
        <div className="relative h-28 w-28">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-warm-200 dark:text-dark-700"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
              className={passed ? 'text-green-500' : 'text-saffron-500'}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={cn(
                'text-2xl font-bold',
                passed ? 'text-green-600' : 'text-saffron-600',
              )}
            >
              {pct}%
            </span>
          </div>
        </div>
      </div>

      {passed ? (
        <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
          <CheckCircle2 className="mx-auto mb-2 h-5 w-5" />
          Excellent! You&apos;ve completed this step. The next step is now unlocked.
        </div>
      ) : (
        <div className="mb-6 rounded-xl bg-saffron-50 p-4 text-sm text-saffron-700 dark:bg-saffron-950/30 dark:text-saffron-400">
          You need 70% to pass. Review the lessons and try again — you&apos;ve got this!
        </div>
      )}

      <div className="flex flex-col gap-3">
        {passed ? (
          <button
            onClick={onContinue}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 py-3 text-sm font-medium text-white shadow-medium hover:shadow-large hover:-translate-y-0.5 transition-all"
          >
            Continue Journey <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 py-3 text-sm font-medium text-white shadow-medium hover:shadow-large hover:-translate-y-0.5 transition-all"
          >
            Try Again
          </button>
        )}
        <button
          onClick={onRetry}
          className="rounded-xl border border-warm-200 py-3 text-sm font-medium text-warm-500 hover:bg-warm-50 dark:border-dark-700 dark:hover:bg-dark-800"
        >
          {passed ? 'Retake Quiz' : 'Review Lessons'}
        </button>
      </div>
    </div>
  );
}

// ─── Single question card ─────────────────────────────────────────────────────

function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelect,
  isSubmitted,
}: {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | undefined;
  onSelect: (idx: number) => void;
  isSubmitted: boolean;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm text-warm-400">
        <span>
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <h3 className="mb-5 text-base font-semibold text-dark-900 dark:text-warm-100 leading-snug">
        {question.question}
      </h3>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect = idx === question.correctIndex;
          const isWrong = isSubmitted && isSelected && !isCorrect;
          const showCorrect = isSubmitted && isCorrect;

          return (
            <button
              key={idx}
              onClick={() => !isSubmitted && onSelect(idx)}
              disabled={isSubmitted}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-all',
                !isSubmitted && !isSelected && 'border-warm-200 bg-white hover:border-saffron-300 hover:bg-saffron-50 dark:border-dark-700 dark:bg-dark-800 dark:hover:border-saffron-700',
                !isSubmitted && isSelected && 'border-saffron-400 bg-saffron-50 dark:border-saffron-600 dark:bg-saffron-950/40',
                showCorrect && 'border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-950/30',
                isWrong && 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/30',
                isSubmitted && !isSelected && !isCorrect && 'border-warm-100 bg-warm-50 opacity-50 dark:border-dark-800 dark:bg-dark-900',
              )}
            >
              <div
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
                  !isSubmitted && isSelected && 'border-saffron-500 bg-saffron-500 text-white',
                  !isSubmitted && !isSelected && 'border-warm-300 text-warm-400',
                  showCorrect && 'border-green-500 bg-green-500 text-white',
                  isWrong && 'border-red-400 bg-red-400 text-white',
                  isSubmitted && !isSelected && !isCorrect && 'border-warm-200 text-warm-300',
                )}
              >
                {isSubmitted ? (
                  showCorrect ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isWrong ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    String.fromCharCode(65 + idx)
                  )
                ) : (
                  String.fromCharCode(65 + idx)
                )}
              </div>
              <span
                className={cn(
                  showCorrect && 'font-medium text-green-700 dark:text-green-400',
                  isWrong && 'text-red-600 dark:text-red-400',
                  !showCorrect && !isWrong && 'text-dark-700 dark:text-warm-300',
                )}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation after submit */}
      {isSubmitted && (
        <div
          className={cn(
            'mt-4 rounded-xl p-4 text-sm leading-relaxed',
            selectedAnswer === question.correctIndex
              ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
          )}
        >
          <span className="font-medium">
            {selectedAnswer === question.correctIndex
              ? '✓ Correct! '
              : '✗ Incorrect. '}
          </span>
          {question.explanation}
        </div>
      )}
    </div>
  );
}

// ─── Main QuizSection component ───────────────────────────────────────────────

export default function QuizSection({
  questions,
  stepTitle,
  stepIcon,
  onComplete,
  onBackToLessons,
  onContinueJourney,
}: QuizSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const currentQ = questions[currentIdx];
  const selectedAnswer = answers[currentIdx];
  const isCurrentSubmitted = submitted[currentIdx] ?? false;

  function handleSelect(idx: number) {
    setAnswers((prev) => ({ ...prev, [currentIdx]: idx }));
  }

  function handleSubmitAnswer() {
    setSubmitted((prev) => ({ ...prev, [currentIdx]: true }));
  }

  function handleNext() {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      // Calculate score
      const correct = questions.filter(
        (q, i) => answers[i] === q.correctIndex,
      ).length;
      const score = Math.round((correct / questions.length) * 100);
      const didPass = score >= 70;
      setFinalScore(correct);
      setPassed(didPass);
      setShowResults(true);
      onComplete(score, didPass);
    }
  }

  function handleRetry() {
    setCurrentIdx(0);
    setAnswers({});
    setSubmitted({});
    setShowResults(false);
    setRetryCount((c) => c + 1);
  }

  if (showResults) {
    return (
      <ScoreDisplay
        score={finalScore}
        total={questions.length}
        passed={passed}
        onRetry={handleRetry}
        onContinue={onContinueJourney}
      />
    );
  }

  return (
    <div>
      {/* Quiz header */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xl">{stepIcon}</span>
        <div>
          <h2 className="text-lg font-bold text-dark-900 dark:text-warm-50">
            Step Quiz
          </h2>
          <p className="text-sm text-warm-500">{stepTitle}</p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-xs text-warm-400">
        <span>Pass mark: 70%</span>
        {retryCount > 0 && <span>Attempt {retryCount + 1}</span>}
      </div>

      {/* Progress bar across questions */}
      <div className="mb-6 flex gap-1">
        {questions.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all',
              i < currentIdx && submitted[i]
                ? answers[i] === questions[i].correctIndex
                  ? 'bg-green-400'
                  : 'bg-red-300'
                : i === currentIdx
                  ? 'bg-saffron-400'
                  : 'bg-warm-200 dark:bg-dark-700',
            )}
          />
        ))}
      </div>

      {/* Question */}
      <div className="rounded-2xl border border-warm-200 bg-white p-5 dark:border-dark-700 dark:bg-dark-800">
        <QuestionCard
          question={currentQ}
          questionNumber={currentIdx + 1}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswer}
          onSelect={handleSelect}
          isSubmitted={isCurrentSubmitted}
        />
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex gap-3">
        {currentIdx > 0 && (
          <button
            onClick={() => setCurrentIdx((i) => i - 1)}
            className="flex items-center gap-1 rounded-xl border border-warm-200 px-4 py-2.5 text-sm text-warm-500 hover:bg-warm-50 dark:border-dark-700 dark:hover:bg-dark-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}

        {!isCurrentSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === undefined}
            className={cn(
              'flex-1 rounded-xl py-2.5 text-sm font-medium transition-all',
              selectedAnswer !== undefined
                ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-medium hover:shadow-large'
                : 'border border-warm-200 bg-warm-50 text-warm-300 cursor-not-allowed dark:border-dark-700',
            )}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 py-2.5 text-sm font-medium text-white shadow-medium hover:shadow-large hover:-translate-y-0.5 transition-all"
          >
            {currentIdx < questions.length - 1 ? (
              <>Next <ArrowRight className="h-4 w-4" /></>
            ) : (
              <>See Results <Trophy className="h-4 w-4" /></>
            )}
          </button>
        )}
      </div>

      <button
        onClick={onBackToLessons}
        className="mt-3 w-full py-2 text-xs text-warm-400 hover:text-warm-600"
      >
        ← Back to lessons
      </button>
    </div>
  );
}
