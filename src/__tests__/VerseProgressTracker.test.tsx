import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { VerseProgressTracker } from '@/components/reader/VerseProgressTracker';

describe('VerseProgressTracker', () => {
  const fetchSpy = vi.fn(() => Promise.resolve(new Response(JSON.stringify({ success: true }))));

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('renders nothing (returns null)', () => {
    const { container } = render(
      <VerseProgressTracker verseId="v1" chapterId="c1" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('fires a POST request to /api/progress on mount', async () => {
    render(<VerseProgressTracker verseId="verse-abc" chapterId="chapter-xyz" />);

    // useEffect is async — wait a tick
    await vi.waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledOnce();
    });

    const [url, options] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/progress');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body as string)).toEqual({
      verseId:   'verse-abc',
      chapterId: 'chapter-xyz',
    });
  });

  it('does not throw if the fetch fails (fire-and-forget)', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('Network error'));

    expect(() =>
      render(<VerseProgressTracker verseId="v2" chapterId="c2" />),
    ).not.toThrow();

    // Give the effect time to settle — no unhandled rejections
    await new Promise((r) => setTimeout(r, 50));
  });
});
