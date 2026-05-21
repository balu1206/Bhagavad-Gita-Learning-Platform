'use client';

import Image from 'next/image';
import { Flame } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface WelcomeBannerProps {
  name?: string | null;
  image?: string | null;
}

const GREETINGS = [
  { time: [5, 11],  text: 'Good morning', sanskrit: 'सुप्रभातम्' },
  { time: [11, 17], text: 'Good afternoon', sanskrit: 'नमस्ते' },
  { time: [17, 21], text: 'Good evening', sanskrit: 'शुभ संध्या' },
  { time: [21, 24], text: 'Good night', sanskrit: 'शुभ रात्रि' },
  { time: [0, 5],   text: 'Welcome back', sanskrit: 'स्वागतम्' },
];

function getGreeting() {
  const h = new Date().getHours();
  return GREETINGS.find(({ time: [s, e] }) => h >= s && h < e) ?? GREETINGS[1];
}

export function WelcomeBanner({ name, image }: WelcomeBannerProps) {
  const greeting = getGreeting();
  const displayName = name?.split(' ')[0] ?? 'Seeker';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-saffron-500 via-saffron-600 to-gold-600 p-6 sm:p-8">
      {/* Background orb */}
      <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 right-24 w-64 h-64 bg-gold-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex items-center justify-between gap-6">
        <div>
          <p className="text-white/70 text-sm uppercase tracking-widest mb-1">
            {greeting.sanskrit}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-white mb-2">
            {greeting.text}, {displayName}
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-md">
            Every verse you read is a step toward wisdom. Continue your journey today.
          </p>
        </div>

        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center border-2 border-white/30">
            {image ? (
              <Image src={image} alt={name ?? 'User'} width={80} height={80} className="object-cover" />
            ) : (
              <span className="font-serif text-2xl text-white">
                {name ? getInitials(name) : <Flame className="w-8 h-8" />}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
