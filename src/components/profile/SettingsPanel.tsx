'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  User, Lock, Palette, Volume2, Bell, Shield,
  Download, Trash2, ChevronRight, Check,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProfileData {
  name: string;
  email: string;
  image?: string;
  bio?: string;
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  versesRead: number;
  chaptersStarted: number;
  bookmarksCount: number;
  journeyStepsCompleted: number;
  achievementsCount: number;
  createdAt: string;
}

interface SettingsPanelProps {
  profile: ProfileData;
  onUpdate: (updated: ProfileData) => void;
}

type Section = 'account' | 'reading' | 'audio' | 'notifications' | 'privacy' | 'data';

// ─── Section nav ──────────────────────────────────────────────────────────────

const SECTIONS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'account',       label: 'Account',       icon: User },
  { id: 'reading',       label: 'Reading',        icon: Palette },
  { id: 'audio',         label: 'Audio',          icon: Volume2 },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
  { id: 'privacy',       label: 'Privacy',        icon: Shield },
  { id: 'data',          label: 'Data & Export',  icon: Download },
];

// ─── Toggle component ─────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-dark-800 dark:text-warm-200">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-10 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500',
          checked ? 'bg-saffron-500' : 'bg-warm-200 dark:bg-dark-600',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  );
}

// ─── Select row ───────────────────────────────────────────────────────────────

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-dark-800 dark:text-warm-200">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-warm-200 bg-white px-2.5 py-1 text-sm text-dark-900 focus:outline-none focus:ring-1 focus:ring-saffron-400 dark:border-dark-600 dark:bg-dark-700 dark:text-warm-100"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Save button ──────────────────────────────────────────────────────────────

function SaveButton({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <button
      onClick={onSave}
      className={cn(
        'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all',
        saved
          ? 'bg-green-50 text-green-600 dark:bg-green-950/30'
          : 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-medium hover:shadow-large hover:-translate-y-0.5',
      )}
    >
      {saved ? <><Check className="h-4 w-4" /> Saved</> : 'Save changes'}
    </button>
  );
}

// ─── Account section ──────────────────────────────────────────────────────────

function AccountSection({ profile, onUpdate }: { profile: ProfileData; onUpdate: (p: ProfileData) => void }) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio ?? '');
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, bio }),
    }).catch(() => {});
    onUpdate({ ...profile, name, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-warm-500">Display name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-warm-200 bg-white px-3 py-2.5 text-sm text-dark-900 focus:outline-none focus:ring-2 focus:ring-saffron-400 dark:border-dark-600 dark:bg-dark-700 dark:text-warm-100"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-warm-500">Email</label>
        <input
          value={profile.email}
          disabled
          className="w-full rounded-xl border border-warm-100 bg-warm-50 px-3 py-2.5 text-sm text-warm-400 dark:border-dark-700 dark:bg-dark-900"
        />
        <p className="mt-1 text-xs text-warm-300">Email cannot be changed here.</p>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-warm-500">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={200}
          placeholder="Share a little about your spiritual journey…"
          className="w-full resize-none rounded-xl border border-warm-200 bg-white px-3 py-2.5 text-sm text-dark-900 focus:outline-none focus:ring-2 focus:ring-saffron-400 dark:border-dark-600 dark:bg-dark-700 dark:text-warm-100"
        />
        <p className="mt-0.5 text-right text-xs text-warm-300">{bio.length}/200</p>
      </div>

      {/* Change password */}
      <div className="rounded-xl border border-warm-200 p-4 dark:border-dark-700">
        <button
          onClick={() => setShowPw((v) => !v)}
          className="flex w-full items-center justify-between text-sm font-medium text-dark-900 dark:text-warm-100"
        >
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-warm-400" />
            Change password
          </div>
          <ChevronRight className={cn('h-4 w-4 text-warm-400 transition-transform', showPw && 'rotate-90')} />
        </button>
        {showPw && (
          <div className="mt-3 space-y-2">
            <input type="password" placeholder="Current password" className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-saffron-400 dark:border-dark-600 dark:bg-dark-700 dark:text-warm-100" />
            <input type="password" placeholder="New password" className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-saffron-400 dark:border-dark-600 dark:bg-dark-700 dark:text-warm-100" />
            <input type="password" placeholder="Confirm new password" className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-saffron-400 dark:border-dark-600 dark:bg-dark-700 dark:text-warm-100" />
            <button className="rounded-lg bg-saffron-500 px-4 py-2 text-sm font-medium text-white hover:bg-saffron-600">Update password</button>
          </div>
        )}
      </div>

      <SaveButton onSave={handleSave} saved={saved} />
    </div>
  );
}

// ─── Reading prefs section ────────────────────────────────────────────────────

function ReadingSection() {
  const [fontSize, setFontSize] = useState('md');
  const [showTranslit, setShowTranslit] = useState(true);
  const [showWordByWord, setShowWordByWord] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fontSize, showTransliteration: showTranslit, showWordByWord }),
    }).catch(() => {});
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-1">
      <SelectRow
        label="Sanskrit font size"
        value={fontSize}
        options={[
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
          { value: 'xl', label: 'Extra large' },
        ]}
        onChange={setFontSize}
      />
      <div className="h-px bg-warm-100 dark:bg-dark-700" />
      <Toggle label="Show transliteration by default" checked={showTranslit} onChange={setShowTranslit} />
      <div className="h-px bg-warm-100 dark:bg-dark-700" />
      <Toggle label="Show word-by-word breakdown" checked={showWordByWord} onChange={setShowWordByWord} />
      <div className="h-px bg-warm-100 dark:bg-dark-700" />
      <Toggle label="Auto-scroll while listening" checked={autoScroll} onChange={setAutoScroll} />
      <div className="mt-4">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
}

// ─── Audio section ────────────────────────────────────────────────────────────

function AudioSection() {
  const [speed, setSpeed] = useState('1');
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [sleepTimer, setSleepTimer] = useState('off');
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playbackSpeed: parseFloat(speed), autoAdvance }),
    }).catch(() => {});
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-1">
      <SelectRow
        label="Default playback speed"
        value={speed}
        options={[
          { value: '0.5', label: '0.5×' },
          { value: '0.75', label: '0.75×' },
          { value: '1', label: '1× (normal)' },
          { value: '1.25', label: '1.25×' },
          { value: '1.5', label: '1.5×' },
          { value: '2', label: '2×' },
        ]}
        onChange={setSpeed}
      />
      <div className="h-px bg-warm-100 dark:bg-dark-700" />
      <Toggle label="Auto-advance to next verse" checked={autoAdvance} onChange={setAutoAdvance} />
      <div className="h-px bg-warm-100 dark:bg-dark-700" />
      <SelectRow
        label="Default sleep timer"
        value={sleepTimer}
        options={[
          { value: 'off',       label: 'Off' },
          { value: '15',        label: '15 minutes' },
          { value: '30',        label: '30 minutes' },
          { value: '60',        label: '60 minutes' },
          { value: 'end-verse', label: 'End of verse' },
        ]}
        onChange={setSleepTimer}
      />
      <div className="mt-4">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
}

// ─── Notifications section ────────────────────────────────────────────────────

function NotificationsSection() {
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakAlert, setStreakAlert] = useState(true);
  const [achievements, setAchievements] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-1">
      <Toggle label="Daily reading reminder" checked={dailyReminder} onChange={setDailyReminder} />
      <div className="h-px bg-warm-100 dark:bg-dark-700" />
      <Toggle label="Streak at-risk alerts" checked={streakAlert} onChange={setStreakAlert} />
      <div className="h-px bg-warm-100 dark:bg-dark-700" />
      <Toggle label="Achievement unlocked notifications" checked={achievements} onChange={setAchievements} />
      <div className="h-px bg-warm-100 dark:bg-dark-700" />
      <Toggle label="Weekly progress digest" checked={weeklyDigest} onChange={setWeeklyDigest} />
      <div className="mt-4">
        <SaveButton
          onSave={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
          saved={saved}
        />
      </div>
    </div>
  );
}

// ─── Privacy section ──────────────────────────────────────────────────────────

function PrivacySection() {
  const [publicProfile, setPublicProfile] = useState(false);
  const [showStreak, setShowStreak] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-1">
      <Toggle label="Public profile" checked={publicProfile} onChange={setPublicProfile} />
      <p className="text-xs text-warm-400 pb-2">Allow others to see your reading progress and achievements.</p>
      <div className="h-px bg-warm-100 dark:bg-dark-700" />
      <Toggle label="Show streak on profile" checked={showStreak} onChange={setShowStreak} />
      <div className="mt-4">
        <SaveButton
          onSave={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
          saved={saved}
        />
      </div>
    </div>
  );
}

// ─── Data & Export section ────────────────────────────────────────────────────

function DataSection() {
  const [exporting, setExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch('/api/profile/export');
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gitapath-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Export */}
      <div className="rounded-xl border border-warm-200 p-4 dark:border-dark-700">
        <h4 className="mb-1 text-sm font-medium text-dark-900 dark:text-warm-100">Export your data</h4>
        <p className="mb-3 text-xs text-warm-400">
          Download a complete JSON export of your reading progress, bookmarks, notes, and achievements.
        </p>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 rounded-lg bg-saffron-50 px-4 py-2 text-sm font-medium text-saffron-600 hover:bg-saffron-100 disabled:opacity-50 dark:bg-saffron-950/30 dark:text-saffron-400"
        >
          <Download className="h-4 w-4" />
          {exporting ? 'Preparing…' : 'Export JSON'}
        </button>
      </div>

      {/* Delete account */}
      <div className="rounded-xl border border-red-200 p-4 dark:border-red-900">
        <h4 className="mb-1 text-sm font-medium text-red-600 dark:text-red-400">Delete account</h4>
        <p className="mb-3 text-xs text-warm-400">
          Permanently delete your account and all data. This cannot be undone.
        </p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/20"
          >
            <Trash2 className="h-4 w-4" />
            Delete my account
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-warm-500">
              Type <span className="font-mono font-medium text-red-500">DELETE</span> to confirm:
            </p>
            <input
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="DELETE"
              className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-400 dark:border-red-800 dark:bg-dark-800 dark:text-warm-100"
            />
            <div className="flex gap-2">
              <button
                disabled={deleteInput !== 'DELETE'}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 hover:bg-red-600"
                onClick={() => alert('Account deletion is disabled in development.')}
              >
                Confirm delete
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }}
                className="rounded-lg border border-warm-200 px-4 py-2 text-sm text-warm-500 hover:bg-warm-50 dark:border-dark-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main SettingsPanel ───────────────────────────────────────────────────────

export default function SettingsPanel({ profile, onUpdate }: SettingsPanelProps) {
  const [activeSection, setActiveSection] = useState<Section>('account');

  const content: Record<Section, React.ReactNode> = {
    account:       <AccountSection profile={profile} onUpdate={onUpdate} />,
    reading:       <ReadingSection />,
    audio:         <AudioSection />,
    notifications: <NotificationsSection />,
    privacy:       <PrivacySection />,
    data:          <DataSection />,
  };

  return (
    <div className="space-y-4">
      {/* Section list */}
      <div className="rounded-2xl border border-warm-200 bg-white dark:border-dark-700 dark:bg-dark-800 overflow-hidden">
        {SECTIONS.map((sec, i) => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors',
                i < SECTIONS.length - 1 && 'border-b border-warm-100 dark:border-dark-700',
                activeSection === sec.id
                  ? 'bg-saffron-50 text-saffron-600 dark:bg-saffron-950/20 dark:text-saffron-400'
                  : 'text-dark-800 hover:bg-warm-50 dark:text-warm-200 dark:hover:bg-dark-700',
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 text-left font-medium">{sec.label}</span>
              <ChevronRight className={cn('h-4 w-4 flex-shrink-0 text-warm-300 transition-transform', activeSection === sec.id && 'rotate-90 text-saffron-500')} />
            </button>
          );
        })}
      </div>

      {/* Section content */}
      <div className="rounded-2xl border border-warm-200 bg-white p-4 dark:border-dark-700 dark:bg-dark-800">
        <h3 className="mb-4 text-sm font-semibold text-dark-900 dark:text-warm-100">
          {SECTIONS.find((s) => s.id === activeSection)?.label}
        </h3>
        {content[activeSection]}
      </div>
    </div>
  );
}
