import Link from 'next/link';
import { Flame, GitBranch, Globe } from 'lucide-react';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Read', href: '/chapters' },
    { label: 'Listen', href: '/listen' },
    { label: 'Journey', href: '/journey' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  Learn: [
    { label: 'About the Gita', href: '/about' },
    { label: 'Sanskrit Guide', href: '/sanskrit' },
    { label: 'Commentaries', href: '/commentaries' },
    { label: 'Blog', href: '/blog' },
  ],
  Account: [
    { label: 'Sign Up', href: '/register' },
    { label: 'Log In', href: '/login' },
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Contact', href: '/contact' },
  ],
};

export function LandingFooter() {
  return (
    <footer className="bg-dark-950 border-t border-dark-800 text-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-xl text-white">Gita Learning</span>
            </Link>
            <p className="text-sm leading-relaxed text-dark-400 max-w-xs">
              A modern platform for exploring the timeless wisdom of the Bhagavad Gita — thoughtfully designed for the contemporary seeker.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center hover:bg-dark-700 transition-colors"
              >
                <GitBranch className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center hover:bg-dark-700 transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark-400 hover:text-saffron-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dark-500">
            © {new Date().getFullYear()} Gita Learning. All rights reserved.
          </p>
          <p className="text-xs text-dark-500 font-sanskrit">
            सर्वे भवन्तु सुखिनः — May all beings be happy
          </p>
        </div>
      </div>
    </footer>
  );
}
