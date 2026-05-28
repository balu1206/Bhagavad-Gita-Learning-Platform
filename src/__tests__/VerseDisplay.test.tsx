import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VerseDisplay } from '@/components/reader/VerseDisplay';

// ── Stubs ──────────────────────────────────────────────────────────────────

vi.mock('@/components/bookmarks/BookmarkButton', () => ({
  BookmarkButton: () => <button aria-label="Bookmark" />,
}));

vi.mock('@/components/ui/Toast/Toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// Lucide icons render as SVGs; just stub them with their label so aria queries work
vi.mock('lucide-react', () => ({
  Volume2:    () => <svg data-testid="icon-volume2" />,
  Square:     () => <svg data-testid="icon-square" />,
  ChevronDown: () => <svg data-testid="icon-chevron-down" />,
  ChevronUp:  () => <svg data-testid="icon-chevron-up" />,
  Eye:        () => <svg data-testid="icon-eye" />,
  EyeOff:    () => <svg data-testid="icon-eye-off" />,
  Loader2:    () => <svg data-testid="icon-loader" />,
}));

// SpeechSynthesis mock
const mockCancel = vi.fn();
const mockSpeak  = vi.fn();
const mockGetVoices = vi.fn(() => []);

beforeEach(() => {
  Object.defineProperty(window, 'speechSynthesis', {
    writable: true,
    value: { cancel: mockCancel, speak: mockSpeak, getVoices: mockGetVoices },
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

// ── Base props ─────────────────────────────────────────────────────────────

const baseProps = {
  chapter:        1,
  verse:          1,
  sanskrit:       'धृतराष्ट्र उवाच',
  transliteration: 'dhṛtarāṣṭra uvāca',
  translation:    'Dhritarashtra said: O Sanjaya...',
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('VerseDisplay', () => {
  it('renders the Sanskrit text', () => {
    render(<VerseDisplay {...baseProps} />);
    expect(screen.getByText('धृतराष्ट्र उवाच')).toBeInTheDocument();
  });

  it('renders the translation', () => {
    render(<VerseDisplay {...baseProps} />);
    expect(screen.getByText(/Dhritarashtra said/)).toBeInTheDocument();
  });

  it('shows the chapter and verse label', () => {
    render(<VerseDisplay {...baseProps} />);
    expect(screen.getByText(/Chapter 1/)).toBeInTheDocument();
    expect(screen.getByText(/Verse 1/)).toBeInTheDocument();
  });

  it('shows transliteration by default', () => {
    render(<VerseDisplay {...baseProps} />);
    expect(screen.getByText('dhṛtarāṣṭra uvāca')).toBeInTheDocument();
  });

  it('hides transliteration when toggle is clicked', () => {
    render(<VerseDisplay {...baseProps} />);
    const toggle = screen.getByRole('button', { name: /hide transliteration/i });
    fireEvent.click(toggle);
    expect(screen.queryByText('dhṛtarāṣṭra uvāca')).not.toBeInTheDocument();
  });

  it('shows transliteration again after two toggles', () => {
    render(<VerseDisplay {...baseProps} />);
    const toggle = screen.getByRole('button', { name: /hide transliteration/i });
    fireEvent.click(toggle);
    const showToggle = screen.getByRole('button', { name: /show transliteration/i });
    fireEvent.click(showToggle);
    expect(screen.getByText('dhṛtarāṣṭra uvāca')).toBeInTheDocument();
  });

  it('renders a Listen button in idle state', () => {
    render(<VerseDisplay {...baseProps} />);
    expect(screen.getByRole('button', { name: /play audio/i })).toBeInTheDocument();
  });

  it('calls speechSynthesis.speak when Listen is clicked', () => {
    render(<VerseDisplay {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: /play audio/i }));
    expect(mockSpeak).toHaveBeenCalledOnce();
  });

  it('does not render a commentary section when commentary is omitted', () => {
    render(<VerseDisplay {...baseProps} />);
    expect(screen.queryByRole('button', { name: /commentary/i })).not.toBeInTheDocument();
  });

  it('renders a Commentary toggle button when commentary is provided', () => {
    render(<VerseDisplay {...baseProps} commentary="This verse begins the Mahabharata." />);
    expect(screen.getByRole('button', { name: /commentary/i })).toBeInTheDocument();
  });

  it('expands commentary when the toggle is clicked', () => {
    render(<VerseDisplay {...baseProps} commentary="This verse begins the Mahabharata." />);
    const toggle = screen.getByRole('button', { name: /commentary/i });
    // Hidden by default (max-h-0 / opacity-0) — aria-expanded should be false
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows the Reflect prompt', () => {
    render(<VerseDisplay {...baseProps} />);
    expect(screen.getByText('Reflect')).toBeInTheDocument();
  });

  it('renders a BookmarkButton when verseId and chapterId are provided', () => {
    render(<VerseDisplay {...baseProps} verseId="v1" chapterId="c1" />);
    expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
  });

  it('does not render a BookmarkButton when verseId is absent', () => {
    render(<VerseDisplay {...baseProps} />);
    expect(screen.queryByRole('button', { name: /bookmark/i })).not.toBeInTheDocument();
  });
});
