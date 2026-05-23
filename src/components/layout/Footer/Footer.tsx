import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Flame } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        'border-t border-warm-100 dark:border-dark-700 py-6 px-6',
        'bg-white dark:bg-dark-900',
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-dark-500 dark:text-dark-400">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-primary flex items-center justify-center">
            <Flame className="h-3 w-3 text-white" aria-hidden="true" />
          </div>
          <span className="font-medium text-dark-700 dark:text-dark-200">Gita Learning</span>
        </div>

        <nav aria-label="Footer navigation" className="flex items-center gap-4">
          <Link href="/about" className="hover:text-saffron-600 transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-saffron-600 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-saffron-600 transition-colors">Terms</Link>
        </nav>

        <p className="text-xs">
          © {new Date().getFullYear()} Gita Learning. Made with 🕉️
        </p>
      </div>
    </footer>
  );
}
