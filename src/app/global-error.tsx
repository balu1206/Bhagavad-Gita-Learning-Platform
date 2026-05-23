'use client';

// DS-003: global-error.tsx runs outside the Tailwind layer (after critical CSS failures),
// so we MUST use inline styles. These hex values intentionally match the design tokens:
//   #FFF9F5 = warm-50, #0F0F0F = dark-900, #666666 = dark-500, #E67A00 = saffron-600
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#FFF9F5' }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🕉️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F0F0F', marginBottom: '0.5rem' }}>
            Critical error
          </h1>
          <p style={{ color: '#666666', marginBottom: '2rem' }}>
            Something went deeply wrong. Please refresh the page.
          </p>
          <button
            onClick={reset}
            style={{ background: '#E67A00', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Refresh
          </button>
        </div>
      </body>
    </html>
  );
}
