import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsGrid } from '@/components/dashboard/StatsGrid';

vi.mock('lucide-react', () => ({
  Flame:    () => <svg data-testid="icon-flame" />,
  BookOpen: () => <svg data-testid="icon-book" />,
  Bookmark: () => <svg data-testid="icon-bookmark" />,
  Trophy:   () => <svg data-testid="icon-trophy" />,
}));

vi.mock('@/components/ui/Card/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/Skeleton/Skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => <div className={className} data-testid="skeleton" />,
}));

const baseStats = {
  versesRead:     47,
  bookmarksCount: 3,
  currentStreak:  7,
  longestStreak:  7,
  totalXp:        350,
};

describe('StatsGrid', () => {
  it('renders skeleton placeholders when stats is null', () => {
    render(<StatsGrid stats={null} />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders skeleton placeholders when stats is undefined', () => {
    render(<StatsGrid />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays versesRead value', () => {
    render(<StatsGrid stats={baseStats} />);
    expect(screen.getByText('47')).toBeInTheDocument();
  });

  it('displays bookmarksCount value', () => {
    render(<StatsGrid stats={baseStats} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays currentStreak value', () => {
    render(<StatsGrid stats={baseStats} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('shows "Personal best!" when currentStreak equals longestStreak', () => {
    render(<StatsGrid stats={{ ...baseStats, currentStreak: 7, longestStreak: 7 }} />);
    expect(screen.getByText('Personal best!')).toBeInTheDocument();
  });

  it('shows "Best: N" when currentStreak is less than longestStreak', () => {
    render(<StatsGrid stats={{ ...baseStats, currentStreak: 3, longestStreak: 7 }} />);
    expect(screen.getByText('Best: 7')).toBeInTheDocument();
  });

  it('shows no streak sub-label when streak is 0', () => {
    render(<StatsGrid stats={{ ...baseStats, currentStreak: 0, longestStreak: 7 }} />);
    expect(screen.queryByText(/Best:/)).not.toBeInTheDocument();
    expect(screen.queryByText('Personal best!')).not.toBeInTheDocument();
  });

  it('displays totalXp below 1000 as a plain number', () => {
    render(<StatsGrid stats={{ ...baseStats, totalXp: 350 }} />);
    expect(screen.getByText('350')).toBeInTheDocument();
  });

  it('displays totalXp >= 1000 in compact "k" format', () => {
    render(<StatsGrid stats={{ ...baseStats, totalXp: 1500 }} />);
    expect(screen.getByText('1.5k')).toBeInTheDocument();
  });

  it('shows the percentage of verses complete', () => {
    // 47 / 700 ≈ 7%
    render(<StatsGrid stats={baseStats} />);
    expect(screen.getByText('7% complete')).toBeInTheDocument();
  });
});
