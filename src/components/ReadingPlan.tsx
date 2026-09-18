'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSafeUser } from '@/lib/use-safe-user';
import ReadingRefLinks from './ReadingRefLinks';
import { readingPlan, TOTAL_DAYS, type ReadingDay } from '@/lib/reading-plan';

const STORAGE_KEY = 'gnBiblePlanProgress';
const IMPORTED_KEY = 'gnBiblePlanImportedToAccount';

type Progress = Record<number, { ot?: boolean; nt?: boolean }>;

function loadLocalProgress(): Progress {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalProgress(p: Progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // Stockage indisponible — la progression ne sera pas mémorisée.
  }
}

export default function ReadingPlan() {
  const { isLoaded, isSignedIn } = useSafeUser();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [synced, setSynced] = useState(false);
  const [jumpValue, setJumpValue] = useState('');
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const [highlightDay, setHighlightDay] = useState<number | null>(null);
  const didSync = useRef(false);

  // Affichage immédiat depuis le stockage local (invité), le temps que
  // Clerk confirme s'il y a un compte connecté à synchroniser.
  useEffect(() => {
    setProgress(loadLocalProgress());
  }, []);

  useEffect(() => {
    if (!isLoaded || didSync.current) return;
    didSync.current = true;

    if (!isSignedIn) return;

    const local = loadLocalProgress();
    const alreadyImported = window.localStorage.getItem(IMPORTED_KEY) === '1';
    const hasLocalData = Object.values(local).some((r) => r.ot || r.nt);

    const run = async () => {
      try {
        if (hasLocalData && !alreadyImported) {
          const res = await fetch('/api/reading-plan/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ progress: local })
          });
          if (res.ok) {
            const data = await res.json();
            setProgress(data.progress);
            window.localStorage.setItem(IMPORTED_KEY, '1');
            window.localStorage.removeItem(STORAGE_KEY);
          }
        } else {
          const res = await fetch('/api/reading-plan/progress');
          if (res.ok) {
            const data = await res.json();
            setProgress(data.progress);
          }
        }
        setSynced(true);
      } catch {
        // Réseau indisponible — on reste sur la progression locale affichée.
      }
    };
    run();
  }, [isLoaded, isSignedIn]);

  const isDayDone = (day: number, p: Progress) => Boolean(p[day]?.ot && p[day]?.nt);

  const currentDay = useMemo(() => {
    if (!progress) return 1;
    const next = readingPlan.find((d) => !isDayDone(d.day, progress));
    return next ? next.day : TOTAL_DAYS;
  }, [progress]);

  useEffect(() => {
    if (progress) setOpenWeek(Math.ceil(currentDay / 7));
  }, [progress, currentDay]);

  const { done, total, pct } = useMemo(() => {
    const totalBoxes = TOTAL_DAYS * 2;
    if (!progress) return { done: 0, total: totalBoxes, pct: 0 };
    let doneCount = 0;
    for (const d of readingPlan) {
      if (progress[d.day]?.ot) doneCount++;
      if (progress[d.day]?.nt) doneCount++;
    }
    return { done: doneCount, total: totalBoxes, pct: totalBoxes ? Math.round((doneCount / totalBoxes) * 100) : 0 };
  }, [progress]);

  const toggle = (day: number, part: 'ot' | 'nt') => {
    setProgress((prev) => {
      const base = prev ?? {};
      const dayRecord = { ...base[day] };
      const value = !dayRecord[part];
      dayRecord[part] = value;
      const next = { ...base, [day]: dayRecord };

      if (isSignedIn && synced) {
        fetch('/api/reading-plan/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ day, part, value })
        }).catch(() => {});
      } else {
        saveLocalProgress(next);
      }
      return next;
    });
  };

  const handleReset = () => {
    if (!window.confirm('Réinitialiser toute ta progression de lecture ?')) return;
    const empty: Progress = {};
    if (isSignedIn && synced) {
      fetch('/api/reading-plan/progress', { method: 'DELETE' }).catch(() => {});
    } else {
      saveLocalProgress(empty);
    }
    setProgress(empty);
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(jumpValue, 10);
    if (!n || n < 1 || n > TOTAL_DAYS) return;
    setOpenWeek(Math.ceil(n / 7));
    setHighlightDay(n);
    requestAnimationFrame(() => {
      document.getElementById(`plan-day-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    setTimeout(() => setHighlightDay(null), 2200);
  };

  if (!progress) return null;

  const today = readingPlan.find((d) => d.day === currentDay) ?? readingPlan[0];
  const weeks: ReadingDay[][] = [];
  for (let i = 0; i < readingPlan.length; i += 7) weeks.push(readingPlan.slice(i, i + 7));

  return (
    <div>
      {isLoaded && !isSignedIn && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gn-line bg-white px-5 py-3.5 text-sm text-gn-ink/70">
          <span>Créez un compte pour retrouver votre progression sur tous vos appareils.</span>
          <Link href="/compte/inscription" className="shrink-0 font-semibold text-gn-gold-line hover:underline">
            Créer un compte
          </Link>
        </div>
      )}

      {/* Aujourd'hui */}
      <div className="mb-8 rounded-2xl border border-gn-gold/30 bg-gn-black-soft p-6 text-gn-cream">
        <p className="font-serif text-base italic font-medium text-gn-gold">
          {done === total ? 'Plan terminé — bravo !' : `À lire — Jour ${String(today.day).padStart(3, '0')}`}
        </p>
        <div className="mt-3 flex flex-col gap-2.5 text-base">
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={Boolean(progress[today.day]?.ot)}
              onChange={() => toggle(today.day, 'ot')}
              className="h-[18px] w-[18px] accent-gn-gold"
            />
            <span>
              <span className="mr-1.5 text-gn-muted">AT —</span>
              <ReadingRefLinks label={today.ot} />
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={Boolean(progress[today.day]?.nt)}
              onChange={() => toggle(today.day, 'nt')}
              className="h-[18px] w-[18px] accent-gn-gold"
            />
            <span>
              <span className="mr-1.5 text-gn-muted">NT —</span>
              <ReadingRefLinks label={today.nt} />
              {today.ntPass === 2 && <span className="ml-1 text-xs text-gn-gold">(2e lecture)</span>}
            </span>
          </div>
        </div>
      </div>

      {/* Progression */}
      <div className="mb-8 rounded-2xl border border-gn-line bg-white p-5">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-serif text-base font-bold text-gn-ink">Ta progression</p>
          <span className="font-bold text-gn-gold-line">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gn-line">
          <div className="gn-progress-fill h-full bg-gradient-to-r from-gn-gold-dark to-gn-gold" style={{ width: `${pct}%` }} />
        </div>
        <button type="button" onClick={handleReset} className="mt-3 text-xs text-gn-gold-line underline hover:text-gn-gold-dark">
          Réinitialiser ma progression
        </button>
      </div>

      {/* Aller à un jour */}
      <form onSubmit={handleJump} className="mb-8 flex flex-wrap gap-2.5">
        <input
          type="number"
          min={1}
          max={TOTAL_DAYS}
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value)}
          placeholder={`Aller au jour n° (1–${TOTAL_DAYS})`}
          className="min-w-0 flex-1 rounded-full border border-gn-line bg-white px-4 py-2.5 text-sm text-gn-ink placeholder:text-gn-ink/40 focus:border-gn-gold-line focus:outline-none focus:ring-2 focus:ring-gn-gold/30"
        />
        <button type="submit" className="shrink-0 rounded-full bg-gn-black px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-gn-cream hover:bg-gn-black-soft">
          Aller
        </button>
      </form>

      {/* Semaines */}
      <div className="flex flex-col gap-2.5">
        {weeks.map((week, i) => {
          const weekNum = i + 1;
          const first = week[0].day;
          const last = week[week.length - 1].day;
          const label = weekNum <= 52 ? `Semaine ${String(weekNum).padStart(2, '0')}` : 'Jour supplémentaire';
          const rangeLabel = first === last ? `Jour ${String(first).padStart(3, '0')}` : `Jours ${String(first).padStart(3, '0')}–${String(last).padStart(3, '0')}`;

          return (
            <details key={weekNum} open={openWeek === weekNum} className="overflow-hidden rounded-lg border border-gn-line bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-serif text-sm font-bold text-gn-ink">
                <span>{label}</span>
                <span className="text-xs font-normal text-gn-muted-strong">{rangeLabel}</span>
              </summary>
              <div className="border-t border-gn-line">
                {week.map((d) => {
                  const rec = progress[d.day] || {};
                  return (
                    <div
                      id={`plan-day-${d.day}`}
                      key={d.day}
                      className={`grid grid-cols-[36px_1fr_22px_1fr_22px] items-center gap-2 border-b border-gn-line px-4 py-2.5 text-xs last:border-b-0 sm:text-sm ${
                        highlightDay === d.day ? 'bg-gn-highlight' : ''
                      }`}
                    >
                      <span className="font-serif font-bold text-gn-gold-line">{String(d.day).padStart(3, '0')}</span>
                      <ReadingRefLinks label={d.ot} className="text-gn-ink/80" />
                      <input
                        type="checkbox"
                        checked={Boolean(rec.ot)}
                        onChange={() => toggle(d.day, 'ot')}
                        className="h-[17px] w-[17px] accent-gn-gold-dark"
                      />
                      <span className="text-gn-ink/80">
                        <ReadingRefLinks label={d.nt} />
                        {d.ntPass === 2 && <sup className="ml-0.5 text-gn-gold-line">(2)</sup>}
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(rec.nt)}
                        onChange={() => toggle(d.day, 'nt')}
                        className="h-[17px] w-[17px] accent-gn-gold-dark"
                      />
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
