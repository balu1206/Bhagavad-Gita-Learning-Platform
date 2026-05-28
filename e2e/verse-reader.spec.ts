import { test, expect } from '@playwright/test';

/**
 * Smoke tests for the verse reader flow.
 * These hit the live dev server (started by playwright.config.ts webServer).
 */

test.describe('Verse Reader — Chapter 1, Verse 1', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chapters/1/1');
  });

  test('renders the chapter/verse label', async ({ page }) => {
    await expect(page.getByText(/Chapter 1.*Verse 1/)).toBeVisible();
  });

  test('renders Sanskrit text', async ({ page }) => {
    // The Sanskrit section heading should appear
    await expect(page.getByRole('heading', { name: /sanskrit/i }).or(
      page.getByText('Sanskrit'),
    )).toBeVisible();
  });

  test('renders a Listen button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /listen/i })).toBeVisible();
  });

  test('renders a Translation section', async ({ page }) => {
    await expect(page.getByRole('region', { name: /translation/i })).toBeVisible();
  });

  test('transliteration toggle hides and shows the transliteration', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /hide transliteration/i });
    await expect(toggle).toBeVisible();
    await toggle.click();

    // After hiding, the toggle label should switch
    await expect(page.getByRole('button', { name: /show transliteration/i })).toBeVisible();
  });

  test('shows a Reflect prompt', async ({ page }) => {
    await expect(page.getByText('Reflect')).toBeVisible();
  });

  test('prev/next navigation links are present', async ({ page }) => {
    // The shell provides chapter navigation; at minimum there should be a "next" link
    // (verse 1 has no previous)
    const nextLink = page.getByRole('link', { name: /next/i });
    await expect(nextLink).toBeVisible();
  });
});

test.describe('Chapter listing page', () => {
  test('shows all 18 chapters', async ({ page }) => {
    await page.goto('/chapters');
    // Wait for content to load (client-side fetch)
    await expect(page.getByText('Chapter 18')).toBeVisible({ timeout: 10_000 });
    const chapterCards = page.locator('[data-testid="chapter-card"]').or(
      page.getByRole('link', { name: /chapter \d+/i }),
    );
    await expect(chapterCards).toHaveCount(18, { timeout: 10_000 });
  });
});

test.describe('Dashboard redirect', () => {
  test('redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});
