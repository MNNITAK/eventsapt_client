"use client";

import { useEffect, useRef } from "react";

// Chart.js is loaded dynamically to keep SSR clean
let ChartJS = null;
const loadChart = () =>
  import("chart.js/auto").then((m) => {
    ChartJS = m.default ?? m.Chart;
    return ChartJS;
  });

// ─── Helper: detect dark mode ────────────────────────────────────────────────

const isDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

// ─── Engagement Donut ────────────────────────────────────────────────────────
// Shows likes / comments / saves / shares breakdown

export function EngagementDonut({ likes = 0, comments = 0, saves = 0, shares = 0 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const data = { likes, comments, saves, shares };
  const total = likes + comments + saves + shares;

  useEffect(() => {
    let destroyed = false;
    loadChart().then((Chart) => {
      if (destroyed || !canvasRef.current) return;
      if (chartRef.current) chartRef.current.destroy();

      const dark = isDark();
      chartRef.current = new Chart(canvasRef.current, {
        type: "doughnut",
        data: {
          labels: ["Likes", "Comments", "Saves", "Shares"],
          datasets: [
            {
              data: [likes, comments, saves, shares],
              backgroundColor: dark
                ? ["#a78bfa", "#2dd4bf", "#fbbf24", "#fb7c5a"]
                : ["#6b5ce7", "#0f9b76", "#f59e0b", "#e05a3a"],
              borderWidth: 0,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "72%",
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  ` ${ctx.label}: ${ctx.parsed.toLocaleString()} (${
                    total > 0
                      ? Math.round((ctx.parsed / total) * 100)
                      : 0
                  }%)`,
              },
            },
          },
        },
      });
    });

    return () => {
      destroyed = true;
      chartRef.current?.destroy();
    };
  }, [likes, comments, saves, shares]);

  const legends = [
    { label: "Likes", value: likes, color: "#6b5ce7" },
    { label: "Comments", value: comments, color: "#0f9b76" },
    { label: "Saves", value: saves, color: "#f59e0b" },
    { label: "Shares", value: shares, color: "#e05a3a" },
  ];

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:ring-white/[0.08]">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Engagement breakdown
      </p>
      <div className="flex items-center gap-6">
        {/* Chart */}
        <div className="relative h-[120px] w-[120px] shrink-0">
          <canvas ref={canvasRef} />
          {/* Center total */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[18px] font-semibold leading-none text-zinc-900 dark:text-zinc-50">
              {total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total}
            </p>
            <p className="text-[10px] text-zinc-400">total</p>
          </div>
        </div>
        {/* Legends */}
        <div className="flex flex-col gap-3">
          {legends.map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ background: color }}
              />
              <span className="min-w-[68px] text-[12px] text-zinc-500 dark:text-zinc-400">
                {label}
              </span>
              <span className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-50">
                {value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── WatchTime Bar ───────────────────────────────────────────────────────────
// Horizontal bar: avg watch time vs video duration

export function WatchTimeBar({ averageSeconds = 0, durationSeconds = 1, completionRate = 0 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const pct = Math.min(Math.round((averageSeconds / durationSeconds) * 100), 100);

  useEffect(() => {
    let destroyed = false;
    loadChart().then((Chart) => {
      if (destroyed || !canvasRef.current) return;
      if (chartRef.current) chartRef.current.destroy();

      const dark = isDark();
      chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels: ["Avg watched", "Remaining"],
          datasets: [
            {
              data: [averageSeconds, Math.max(durationSeconds - averageSeconds, 0)],
              backgroundColor: dark
                ? ["#2dd4bf", "#3a3a3a"]
                : ["#0f9b76", "#f0f0f0"],
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const s = Math.round(ctx.parsed.x);
                  return ` ${s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`}`;
                },
              },
            },
          },
          scales: {
            x: {
              stacked: true,
              display: false,
              max: durationSeconds,
            },
            y: {
              stacked: true,
              display: false,
            },
          },
        },
      });
    });

    return () => {
      destroyed = true;
      chartRef.current?.destroy();
    };
  }, [averageSeconds, durationSeconds]);

  const fmt = (s) =>
    s >= 60 ? `${Math.floor(s / 60)}m ${Math.round(s % 60)}s` : `${Math.round(s)}s`;

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:ring-white/[0.08]">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Watch time
      </p>
      <div className="mb-3 flex items-end gap-2">
        <p className="text-[28px] font-semibold leading-none text-zinc-900 dark:text-zinc-50">
          {fmt(averageSeconds)}
        </p>
        <p className="mb-0.5 text-[12px] text-zinc-400">avg per play</p>
      </div>
      <div className="relative h-[40px]">
        <canvas ref={canvasRef} />
      </div>
      <div className="mt-3 flex justify-between text-[11px] text-zinc-400">
        <span>
          {pct}% of {fmt(durationSeconds)}
        </span>
        <span>{Math.round(completionRate)}% completion rate</span>
      </div>
    </div>
  );
}
