'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  User, Activity, Trophy, Settings,
  BookOpen, Bookmark, Flame, Zap, Star,
  Calendar, TrendingUp,
} from 'lucide-react';
import ActivityHeatmap from '@/components/profile/ActivityHeatmap';
import AchievementBadge from '@/components/journey/AchievementBadge';
import type { Achievement } from '@/components/journey/AchievementBadge';
import SettingsPanel from '@/components/profile/SettingsPanel';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProfileData {
  name: string;
  email: string;
  image?: string;
  bio?: string;
  createdAt: string;
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  versesRead: number;
  chaptersStarted: number;
  bookmarksCount: number;
  journeyStepsCompleted: number;
  achievementsCount: number;
}

type Tab = 'overview' | 'activity' | 'achievements' | 'settings';

// ─── Static fallback ──────────────────────────────────────────────────────────

const STATIC_PROFILE: ProfileData = {
  name: 'Bhaskar',
  email: 'balu.svb000@gmail.com',
  createdAt: '2026-05-01T00:00:00Z',
  totalXp: 650,
  level: 3,
  currentStreak: 12,
  longestStreak: 21,
  versesRead: 127,
  chaptersStarted: 3,
  bookmarksCount: 18,
  journeyStepsCompleted: 2,
  achievementsCount: 4,
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

function ProfileAvatar({ name, image, size = 'lg' }: { name: string; image?: string; size?: 'sm' | 'lg' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const dim = size === 'lg' ? 'h-20 w-20 text-2xl' : 'h-10 w-10 text-sm';

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt={name} className={cn('rounded-2xl object-cover', dim)} />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 font-bold text-white',
        dim,
      )}
    >
      {initials}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-warm-200 bg-white p-4 shadow-soft dark:border-dark-700 dark:bg-dark-800">
      <div className="mb-2 flex items-center gap-2">
        <Icon className={cn('h-4 w-4', accent ?? 'text-saffron-500')} />
        <span className="text-xs text-warm-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-dark-900 dark:text-warm-50">{value}</div>
    </div>
  );
}

// ─── XP / level bar ──────────────────────────────────────────────────────────

function LevelBar({ xp, level }: { xp: number; level: number }) {
  const xpForLevel = level * 200;
  const xpPrev = ((level - 1) * level * 200) / 2;
  const progress = Math.min(100, Math.round(((xp - xpPrev) / xpForLevel) * 100));

  return (
    <div className="rounded-2xl border border-warm-200 bg-white p-4 shadow-soft dark:border-dark-700 dark:bg-dark-800">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-saffron-500" />
          <span className="text-sm font-medium text-dark-900 dark:text-warm-100">Level {level}</span>
        </div>
        <span className="text-xs text-warm-400">{xp.toLocaleString()} XP total</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-warm-100 dark:bg-dark-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-saffron-400 to-saffron-600 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-warm-400">
        <span>{progress}% to level {level + 1}</span>
        <span>{xpForLevel - ((xp - xpPrev) > 0 ? (xp - xpPrev) : 0)} XP to go</span>
      </div>
    </div>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ profile }: { profile: ProfileData }) {
  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-4">
      <LevelBar xp={profile.totalXp} level={profile.level} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Verses read"       value={profile.versesRead}           icon={BookOpen}  accent="text-saffron-500" />
        <StatCard label="Bookmarks"         value={profile.bookmarksCount}       icon={Bookmark}  accent="text-gold-500" />
        <StatCard label="Current streak"    value={`${profile.currentStreak}d`}  icon={Flame}     accent="text-orange-500" />
        <StatCard label="Longest streak"    value={`${profile.longestStreak}d`}  icon={TrendingUp} accent="text-green-500" />
        <StatCard label="Journey steps"     value={`${profile.journeyStepsCompleted}/8`} icon={Star} accent="text-purple-500" />
        <StatCard label="Achievements"      value={profile.achievementsCount}    icon={Trophy}    accent="text-blue-500" />
      </div>

      {/* Bio + member since */}
      <div className="rounded-2xl border border-warm-200 bg-white p-4 dark:border-dark-700 dark:bg-dark-800">
        <h3 className="mb-2 text-sm font-medium text-dark-900 dark:text-warm-100">About</h3>
        {profile.bio ? (
          <p className="text-sm text-warm-500">{profile.bio}</p>
        ) : (
          <p className="text-sm italic text-warm-300">No bio yet — add one in Settings.</p>
        )}
        <div className="mt-3 flex items-center gap-2 text-xs text-warm-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>Member since {memberSince}</span>
        </div>
      </div>

      {/* Quick verse of the day */}
      <div className="rounded-2xl border border-saffron-200 bg-saffron-50/60 p-4 dark:border-saffron-800 dark:bg-saffron-950/20">
        <div className="mb-2 text-xs font-medium text-saffron-600">Today&apos;s verse</div>
        <p className="text-base text-dark-800 dark:text-warm-200" style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}>
          कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।
        </p>
        <p className="mt-1 text-xs italic text-warm-500">Bhagavad Gita 2.47</p>
      </div>
    </div>
  );
}

// ─── Activity tab ─────────────────────────────────────────────────────────────

function ActivityTab({ userId }: { userId?: string }) {
  return (
    <div className="space-y-4">
      <ActivityHeatmap userId={userId} />

      <div className="rounded-2xl border border-warm-200 bg-white p-4 dark:border-dark-700 dark:bg-dark-800">
        <h3 className="mb-3 text-sm font-medium text-dark-900 dark:text-warm-100">Recent activity</h3>
        <div className="space-y-3">
          {[
            { icon: '📖', text: 'Read Chapter 2, Verses 45–50', time: '2 hours ago' },
            { icon: '🎧', text: 'Listened to Chapter 4, Verse 7', time: 'Yesterday' },
            { icon: '🔖', text: 'Bookmarked Verse 11.32', time: '2 days ago' },
            { icon: '🏆', text: 'Completed Step 2: Key Concepts', time: '3 days ago' },
            { icon: '🔥', text: 'Extended streak to 12 days', time: '3 days ago' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-base">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-dark-800 dark:text-warm-200">{item.text}</p>
              </div>
              <span className="shrink-0 text-xs text-warm-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Achievements tab ─────────────────────────────────────────────────────────

function AchievementsTab() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    fetch('/api/achievements')
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setAchievements(d))
      .catch(() => {});
  }, []);

  const unlocked = achievements.filter((a) => !!a.unlockedAt);
  const locked = achievements.filter((a) => !a.unlockedAt);

  return (
    <div className="space-y-4">
      {unlocked.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-dark-900 dark:text-warm-100">
            Unlocked ({unlocked.length})
          </h3>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {unlocked.map((a) => (
              <div key={a.id} className="flex flex-col items-center gap-1.5 rounded-xl border border-warm-200 bg-white p-2.5 dark:border-dark-700 dark:bg-dark-800">
                <AchievementBadge achievement={a} size="sm" showDetails={false} />
                <p className="text-center text-xs font-medium text-dark-800 dark:text-warm-200 leading-tight">{a.title}</p>
                <p className="text-xs text-saffron-500">+{a.xpReward} XP</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-warm-400">
            Locked ({locked.length})
          </h3>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {locked.map((a) => (
              <div key={a.id} className="flex flex-col items-center gap-1.5 rounded-xl border border-warm-100 bg-warm-50 p-2.5 opacity-50 dark:border-dark-800 dark:bg-dark-900">
                <AchievementBadge achievement={a} size="sm" showDetails={false} />
                <p className="text-center text-xs text-warm-400 leading-tight">{a.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {achievements.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Trophy className="h-10 w-10 text-warm-300" />
          <p className="text-warm-400">Loading achievements…</p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',     label: 'Overview',     icon: User },
  { id: 'activity',     label: 'Activity',     icon: Activity },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'settings',     label: 'Settings',     icon: Settings },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(STATIC_PROFILE);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((d) => d.name && setProfile(d))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-warm-50 pb-24 pt-6 dark:bg-dark-950">
      <div className="mx-auto max-w-2xl px-4">

        {/* Profile header card */}
        <div className="mb-6 rounded-2xl border border-warm-200 bg-white p-5 shadow-soft dark:border-dark-700 dark:bg-dark-800">
          <div className="flex items-start gap-4">
            <ProfileAvatar name={profile.name} image={profile.image} size="lg" />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-dark-900 dark:text-warm-50 truncate">
                {profile.name}
              </h1>
              <p className="mt-0.5 text-sm text-warm-400 truncate">{profile.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-lg bg-saffron-50 px-2.5 py-1 text-xs font-medium text-saffron-600 dark:bg-saffron-950/30">
                  <Zap className="h-3 w-3" /> Level {profile.level}
                </span>
                <span className="flex items-center gap-1 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600 dark:bg-orange-950/30">
                  <Flame className="h-3 w-3" /> {profile.currentStreak} day streak
                </span>
                <span className="flex items-center gap-1 rounded-lg bg-warm-100 px-2.5 py-1 text-xs font-medium text-warm-600 dark:bg-dark-700">
                  <BookOpen className="h-3 w-3" /> {profile.versesRead} verses
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex gap-1 rounded-xl border border-warm-200 bg-white p-1 dark:border-dark-700 dark:bg-dark-800">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-saffron-500 text-white shadow-sm'
                    : 'text-warm-500 hover:bg-warm-50 dark:hover:bg-dark-700',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'overview'     && <OverviewTab profile={profile} />}
        {activeTab === 'activity'     && <ActivityTab />}
        {activeTab === 'achievements' && <AchievementsTab />}
        {activeTab === 'settings'     && <SettingsPanel profile={profile} onUpdate={setProfile} />}
      </div>
    </div>
  );
}
