'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DayActivity {
  date: string;   // YYYY-MM-DD
  count: number;  // verses read that day
}

interface ActivityHeatmapProps {
  userId?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysInYear(): string[] {
  const today = new Date();
  const days: string[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function getIntensity(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 2)  return 1;
  if (count <= 5)  return 2;
  if (count <= 10) return 3;
  return 4;
}

const INTENSITY_CLASSES: Record<number, string> = {
  0: 'bg-warm-100 dark:bg-dark-700',
  1: 'bg-saffron-100 dark:bg-saffron-900/40',
  2: 'bg-saffron-300 dark:bg-saffron-700/60',
  3: 'bg-saffron-500 dark:bg-saffron-500',
  4: 'bg-saffron-700 dark:bg-saffron-400',
};

// Build static demo data (realistic-looking activity)
function buildDemoActivity(): DayActivity[] {
  const days = getDaysInYear();
  return days.map((date, i) => {
    // Simulate gradual engagement increase + occasional off days
    const weekday = new Date(date).getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const recentBias = i > 300 ? 3 : i > 200 ? 1.5 : 0.8;
    const base = Math.random() * recentBias;
    const count = base > 0.6 ? Math.floor(base * 8) : isWeekend && Math.random() > 0.4 ? Math.floor(Math.random() * 5) : 0;
    return { date, count };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActivityHeatmap({ userId }: ActivityHeatmapProps) {
  const [activity, setActivity] = useState<DayActivity[]>([]);
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetch('/api/profile/activity')
        .then((r) => r.json())
        .then((d) => Array.isArray(d) && setActivity(d))
        .catch(() => setActivity(buildDemoActivity()))
        .finally(() => setLoading(false));
    } else {
      setActivity(buildDemoActivity());
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="h-28 animate-pulse rounded-2xl bg-warm-100 dark:bg-dark-700" />
    );
  }

  // Group days into weeks (columns)
  const weeks: DayActivity[][] = [];
  let week: DayActivity[] = [];

  // Pad start so first day aligns to correct weekday
  const firstDay = new Date(activity[0]?.date ?? new Date());
  const startPad = firstDay.getDay(); // 0=Sun
  for (let i = 0; i < startPad; i++) {
    week.push({ date: '', count: -1 }); // placeholder
  }

  for (const day of activity) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push({ date: '', count: -1 });
    weeks.push(week);
  }

  const totalVerses = activity.reduce((s, d) => s + d.count, 0);
  const activeDays = activity.filter((d) => d.count > 0).length;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((wk, wi) => {
    const firstReal = wk.find((d) => d.date);
    if (firstReal?.date) {
      const m = new Date(firstReal.date).getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ label: months[m], col: wi });
        lastMonth = m;
      }
    }
  });

  return (
    <div className="rounded-2xl border border-warm-200 bg-white p-4 dark:border-dark-700 dark:bg-dark-800">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-dark-900 dark:text-warm-100">Reading activity</h3>
        <div className="flex items-center gap-3 text-xs text-warm-400">
          <span>{totalVerses} verses</span>
          <span>·</span>
          <span>{activeDays} active days</span>
        </div>
      </div>

      {/* Month labels */}
      <div className="relative mb-1 overflow-x-auto">
        <div className="flex" style={{ gap: '2px' }}>
          {weeks.map((_, wi) => {
            const lbl = monthLabels.find((m) => m.col === wi);
            return (
              <div key={wi} className="flex-shrink-0" style={{ width: '10px' }}>
                {lbl && (
                  <span className="whitespace-nowrap text-xs text-warm-300" style={{ fontSize: '9px' }}>
                    {lbl.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div
          className="flex overflow-x-auto pb-1"
          style={{ gap: '2px' }}
          onMouseLeave={() => setTooltip(null)}
        >
          {weeks.map((wk, wi) => (
            <div key={wi} className="flex flex-shrink-0 flex-col" style={{ gap: '2px' }}>
              {wk.map((day, di) => {
                if (!day.date) {
                  return <div key={di} style={{ width: '10px', height: '10px' }} />;
                }
                const intensity = getIntensity(day.count);
                return (
                  <div
                    key={di}
                    className={cn(
                      'cursor-default rounded-sm transition-opacity hover:opacity-70',
                      INTENSITY_CLASSES[intensity],
                    )}
                    style={{ width: '10px', height: '10px' }}
                    onMouseEnter={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({ date: day.date, count: day.count, x: rect.left, y: rect.top });
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-xs text-warm-300">Less</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn('h-2.5 w-2.5 rounded-sm', INTENSITY_CLASSES[i])}
          />
        ))}
        <span className="text-xs text-warm-300">More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg bg-dark-900 px-2.5 py-1.5 text-xs text-white shadow-large"
          style={{ top: tooltip.y - 36, left: tooltip.x - 20 }}
        >
          <span className="font-medium">{tooltip.count} verse{tooltip.count !== 1 ? 's' : ''}</span>
          <span className="ml-1 text-warm-400">
            {new Date(tooltip.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      )}
    </div>
  );
}
