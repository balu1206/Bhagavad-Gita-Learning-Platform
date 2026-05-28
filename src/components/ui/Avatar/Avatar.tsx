import { cn, getInitials } from '@/lib/utils';
import Image from 'next/image';
import type { HTMLAttributes } from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
}

const sizeMap: Record<AvatarSize, { container: string; text: string; px: number }> = {
  xs: { container: 'h-6 w-6', text: 'text-xs', px: 24 },
  sm: { container: 'h-8 w-8', text: 'text-xs', px: 32 },
  md: { container: 'h-10 w-10', text: 'text-sm', px: 40 },
  lg: { container: 'h-12 w-12', text: 'text-base', px: 48 },
  xl: { container: 'h-16 w-16', text: 'text-lg', px: 64 },
};

export function Avatar({ src, alt, name, size = 'md', className, ...props }: AvatarProps) {
  const { container, text, px } = sizeMap[size];
  const initials = name ? getInitials(name) : '?';

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'bg-gradient-primary select-none',
        container,
        className,
      )}
      aria-label={alt ?? name}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? name ?? 'Avatar'}
          width={px}
          height={px}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className={cn('font-semibold text-white', text)} aria-hidden="true">
          {initials}
        </span>
      )}
    </div>
  );
}
