import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="bg-cream-50 dark:bg-dark-950 border-t border-warm-200/60 dark:border-dark-800/60">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">

          {/* Brand */}
          <div>
            <p className="font-display text-xl font-semibold text-dark-900 dark:text-cream-100 mb-1">GitaPath</p>
            <p className="text-sm text-dark-400 dark:text-dark-500 font-light">Ancient wisdom, modern reading experience</p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { href: '/chapters',  label: 'Browse verses' },
              { href: '/listen',    label: 'Listen' },
              { href: '/login',     label: 'Sign in' },
              { href: '/register',  label: 'Create account' },
              { href: '/privacy',   label: 'Privacy' },
              { href: '/terms',     label: 'Terms' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="text-sm text-dark-400 dark:text-dark-500 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors duration-300">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-warm-200/60 dark:border-dark-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-dark-400 dark:text-dark-600">
          <p>© {new Date().getFullYear()} GitaPath. Free for everyone.</p>
          <p className="font-sanskrit text-saffron-400 dark:text-saffron-600 text-base">ॐ</p>
        </div>
      </div>
    </footer>
  );
}
