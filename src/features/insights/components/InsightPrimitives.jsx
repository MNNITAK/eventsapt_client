"use client";

import { PERIODS } from "../utils/insightHelpers_old";

// ─── StatCard ────────────────────────────────────────────────────────────────

export function StatCard({ label, value, sub, delta, icon: Icon, accent }) {
  const isPositive = delta?.positive ?? true;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white p-5 ring-1 ring-black/[0.06] transition-shadow hover:shadow-sm dark:bg-zinc-900 dark:ring-white/[0.08]">
      {/* Top row */}
      <div className="mb-3 flex items-start justify-between">
        <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {label}
        </p>
        {Icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
            <Icon size={13} strokeWidth={1.8} />
          </span>
        )}
      </div>

      {/* Value */}
      <p
        className="text-[28px] font-semibold leading-none tracking-tight text-zinc-900 dark:text-zinc-50"
        style={accent ? { color: accent } : {}}
      >
        {value ?? "—"}
      </p>

      {/* Sub / delta */}
      <div className="mt-3 flex items-center gap-2">
        {delta && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {delta.label}
          </span>
        )}
        {sub && (
          <span className="text-[12px] text-zinc-400 dark:text-zinc-500">
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── SectionHeading ──────────────────────────────────────────────────────────

export function SectionHeading({ children }) {
  return (
    <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
      {children}
    </h2>
  );
}

// ─── PeriodSelector ──────────────────────────────────────────────────────────

export function PeriodSelector({ value, onChange }) {
  return (
    <div className="flex gap-1.5 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/60">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all ${
            value === p.value
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

// ─── AudienceBar ─────────────────────────────────────────────────────────────

export function AudienceBar({ followerPct = 0, nonFollowerPct = 0, total = 0 }) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:ring-white/[0.08]">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Audience breakdown
      </p>

      {/* Segmented bar */}
      <div className="mb-4 flex h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full rounded-l-full bg-zinc-800 transition-all duration-700 dark:bg-zinc-100"
          style={{ width: `${followerPct}%` }}
        />
        <div
          className="h-full rounded-r-full bg-zinc-300 transition-all duration-700 dark:bg-zinc-600"
          style={{ width: `${nonFollowerPct}%` }}
        />
      </div>

      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-800 dark:bg-zinc-100" />
          <div>
            <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-50">
              {followerPct}%
            </p>
            <p className="text-[11px] text-zinc-400">Followers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div>
            <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-50">
              {nonFollowerPct}%
            </p>
            <p className="text-[11px] text-zinc-400">Non-followers</p>
          </div>
        </div>
        <div className="ml-auto">
          <p className="text-right text-[13px] font-semibold text-zinc-900 dark:text-zinc-50">
            {total.toLocaleString()}
          </p>
          <p className="text-right text-[11px] text-zinc-400">Total views</p>
        </div>
      </div>
    </div>
  );
}

// ─── InsightsSkeleton ────────────────────────────────────────────────────────

export function InsightsSkeleton({ cards = 6 }) {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
      >
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800"
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── InsightsError ───────────────────────────────────────────────────────────

export function InsightsError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-50 px-6 py-10 text-center dark:bg-red-900/10">
      <p className="text-[13px] font-medium text-red-600 dark:text-red-400">
        Failed to load insights
      </p>
      {message && (
        <p className="text-[12px] text-red-400 dark:text-red-500">{message}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-lg bg-red-600 px-4 py-1.5 text-[12px] font-medium text-white hover:bg-red-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ─── EngagementRateCard ──────────────────────────────────────────────────────

export function EngagementRateCard({ rate }) {
  const numRate = parseFloat(rate ?? 0);
  // Colour thresholds: <2% low, 2-6% average, >6% good
  const color =
    numRate >= 6
      ? "text-emerald-600 dark:text-emerald-400"
      : numRate >= 2
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-500 dark:text-red-400";

  const label =
    numRate >= 6 ? "Excellent" : numRate >= 2 ? "Average" : "Below average";

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-5 ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:ring-white/[0.08]">
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Engagement rate
        </p>
        <p className={`text-[32px] font-semibold leading-none ${color}`}>
          {rate ?? "0.00"}%
        </p>
        <p className="mt-1.5 text-[12px] text-zinc-400">
          (likes + comments + saves + shares) ÷ reach
        </p>
      </div>
      <div
        className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${
          numRate >= 6
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
            : numRate >= 2
            ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
            : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
