import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContinueCard } from '@/components/dashboard/ContinueCard';

// Next.js Link renders a plain <a> in the test environment
vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

// Stub out UI primitives that rely on CSS or complex context
vi.mock('@/components/ui/Card/Card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock('@/components/ui/Button/Button', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { fullWidth?: boolean; variant?: string; size?: string }) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('@/components/ui/ProgressBar/ProgressBar', () => ({
  ProgressBar: ({ value }: { value: number; className?: string }) => (
    <div role="progressbar" aria-valuenow={value} />
  ),
}));

vi.mock('@/components/ui/Skeleton/Skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => <div className={className} />,
}));

describe('ContinueCard', () => {
  it('shows "Start Reading" state when lastRead is null', () => {
    render(<ContinueCard lastRead={null} />);
    expect(screen.getByText('Begin your journey')).toBeInTheDocument();
    expect(screen.getByText('Start Reading', { selector: 'p' })).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /start reading/i });
    expect(link).toHaveAttribute('href', '/chapters/1/1');
  });

  it('shows "Start Reading" state when lastRead is undefined', () => {
    render(<ContinueCard />);
    expect(screen.getByText('Begin your journey')).toBeInTheDocument();
  });

  it('shows "Continue Reading" state with chapter info when lastRead is provided', () => {
    render(
      <ContinueCard
        lastRead={{
          chapter:      2,
          verse:        15,
          chapterTitle: 'Sankhya Yoga',
          totalVerses:  72,
          translation:  'O best among men, the person who is not disturbed by happiness and distress.',
        }}
      />,
    );

    expect(screen.getByText('Continue Reading', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('Chapter 2: Sankhya Yoga')).toBeInTheDocument();
    expect(screen.getByText('Verse 15 of 72')).toBeInTheDocument();
  });

  it('shows chapter progress percentage', () => {
    render(
      <ContinueCard
        lastRead={{
          chapter:      1,
          verse:        20,
          chapterTitle: 'Arjuna Visada Yoga',
          totalVerses:  47,
          translation:  'Arjuna, seeing all those relatives.',
        }}
      />,
    );

    // 20/47 ≈ 43%
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '43');
  });

  it('truncates long translation previews to 120 characters', () => {
    const longTranslation = 'A'.repeat(200);
    render(
      <ContinueCard
        lastRead={{
          chapter:      3,
          verse:        1,
          chapterTitle: 'Karma Yoga',
          totalVerses:  43,
          translation:  longTranslation,
        }}
      />,
    );

    // The preview text (in quotes) should be exactly 117 chars + "..."
    const preview = 'A'.repeat(117) + '...';
    expect(screen.getByText(`"${preview}"`)).toBeInTheDocument();
  });

  it('links to the next verse for "Continue Reading"', () => {
    render(
      <ContinueCard
        lastRead={{
          chapter:      2,
          verse:        5,
          chapterTitle: 'Sankhya Yoga',
          totalVerses:  72,
          translation:  'Some verse translation.',
        }}
      />,
    );

    const continueLink = screen.getByRole('link', { name: /continue reading/i });
    expect(continueLink).toHaveAttribute('href', '/chapters/2/6');
  });

  it('does not go past the last verse when already on it', () => {
    render(
      <ContinueCard
        lastRead={{
          chapter:      1,
          verse:        47,
          chapterTitle: 'Arjuna Visada Yoga',
          totalVerses:  47,
          translation:  'Last verse text.',
        }}
      />,
    );

    // nextVerse = min(47+1, 47) = 47
    const continueLink = screen.getByRole('link', { name: /continue reading/i });
    expect(continueLink).toHaveAttribute('href', '/chapters/1/47');
  });
});
