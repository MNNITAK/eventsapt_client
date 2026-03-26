"use client";

import React, { useMemo } from "react";
import {
  ArrowUpRight,
  BadgeIndianRupee,
  BrainCircuit,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Video,
  UtensilsCrossed,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MARKET_GROWTH = [
  { year: "2024", value: 103.93 },
  { year: "2025", value: 117.45 },
  { year: "2030", value: 228.69 },
];

const PAYMENT_MIX = [
  { name: "Digital", value: 38 },
  { name: "Cash / Other", value: 62 },
];

const DESTINATION_LOCATION_MIX = [
  { name: "Within India", value: 89 },
  { name: "International", value: 11 },
];

const DESTINATION_TYPE_MIX = [
  { name: "Beach & Island", value: 33.21 },
  { name: "Other destination formats", value: 66.79 },
];

const VENDOR_PRIORITY = [
  { name: "Catering & Venue", value: 100, accent: "primary" },
  { name: "Photography & Videography", value: 88, accent: "secondary" },
  { name: "Decor & Ambience", value: 82, accent: "primary" },
  { name: "Event Planning", value: 78, accent: "secondary" },
  { name: "Travel & Stay", value: 72, accent: "primary" },
  { name: "Makeup & Grooming", value: 68, accent: "secondary" },
  { name: "Music & DJ", value: 60, accent: "primary" },
  { name: "Invites & Gifting", value: 54, accent: "secondary" },
];

const LOCATION_FIT = [
  { name: "Jaipur", value: 100 },
  { name: "Udaipur", value: 96 },
  { name: "Goa", value: 93 },
  { name: "Kerala", value: 89 },
  { name: "Delhi NCR", value: 83 },
  { name: "Mumbai", value: 79 },
  { name: "Bengaluru", value: 75 },
  { name: "Hyderabad", value: 73 },
];

const INSIGHTS = [
  {
    title: "Venue + catering wins the budget",
    value: "Top spend category",
    icon: UtensilsCrossed,
    tone: "from-rose-50 to-white",
    text:
      "Catering & venue is the largest service segment in India wedding services, so these vendors should be surfaced first in planning flows.",
  },
  {
    title: "Destination weddings are local-first",
    value: "89% domestic",
    icon: MapPin,
    tone: "from-indigo-50 to-white",
    text:
      "Most destination weddings are still hosted within India, which makes Indian destination cities the most practical recommendation layer.",
  },
  {
    title: "Premium spend is concentrated",
    value: "₹73L Jaipur avg.",
    icon: BadgeIndianRupee,
    tone: "from-amber-50 to-white",
    text:
      "Jaipur leads major-city spend in the latest report, making it a strong signal for premium venue and luxury vendor discovery.",
  },
  {
    title: "Digital planning is rising",
    value: "38% digital pay",
    icon: CircleDollarSign,
    tone: "from-emerald-50 to-white",
    text:
      "A meaningful share of couples already use digital modes, so payment milestones and booking reminders can be surfaced natively.",
  },
  {
    title: "Trust is a conversion factor",
    value: "1 in 3 read reviews",
    icon: ShieldCheck,
    tone: "from-sky-50 to-white",
    text:
      "Reviews, referrals, and visible proof of work should be emphasized because they influence booking decisions.",
  },
  {
    title: "AI-ready vendors are ahead",
    value: "24% adoption",
    icon: BrainCircuit,
    tone: "from-violet-50 to-white",
    text:
      "Early AI adopters are already gaining an advantage, so your product can promote vendors with fast response times and smart workflows.",
  },
];

const ACTION_STEPS = [
  {
    step: "01",
    title: "Choose your wedding mode",
    text: "Start with local vs destination, because that changes venue, logistics, and guest-stay planning immediately.",
  },
  {
    step: "02",
    title: "Book the scarce items early",
    text: "Venue, catering, photographer, and destination stay inventory should be prioritized first because availability is a pain point.",
  },
  {
    step: "03",
    title: "Optimize for trust",
    text: "Show reviews, response speed, and proof-of-work so couples can decide faster with less uncertainty.",
  },
];

const PALETTE = ["#C94C73", "#f4d8e1", "#7c3aed", "#93c5fd", "#10b981", "#f59e0b"];

export  function WeddingMarketInsightsDashboard() {
  const marketDelta = useMemo(() => {
    const start = MARKET_GROWTH[0].value;
    const end = MARKET_GROWTH[MARKET_GROWTH.length - 1].value;
    return (((end - start) / start) * 100).toFixed(0);
  }, []);

  return (
    <div className="min-h-screen  text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(201,76,115,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(124,58,237,0.10),_transparent_22%),linear-gradient(180deg,rgba(255,255,255,1),rgba(247,244,246,0.85))]">
            <div className="border-b border-slate-200/70 px-6 py-6 md:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f1c6d5] bg-[#fff7fa] px-3 py-1 text-xs font-medium text-[#9a2143]">
                    <Sparkles className="h-3.5 w-3.5" />
                    India wedding market intelligence
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                    Plan weddings with market-backed direction
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                    Use the latest market signals to guide couples toward the right
                    vendors, cities, and booking priorities.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <StatChip label="Market growth" value={`${marketDelta}%`} icon={TrendingUp} />
                  <StatChip label="Avg spend" value="₹39.5L" icon={BadgeIndianRupee} />
                  <StatChip label="Digital payments" value="38%" icon={CircleDollarSign} />
                  <StatChip label="AI adoption" value="24%" icon={BrainCircuit} />
                </div>
              </div>
            </div>

            <div className="grid gap-4 px-6 py-6 md:px-8 xl:grid-cols-3">
              {INSIGHTS.slice(0, 3).map((item) => (
                <InsightCard key={item.title} item={item} />
              ))}
            </div>
          </div>

          <div className="grid gap-6 px-6 pb-6 md:px-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              <Panel title="Market growth trajectory" subtitle="Revenue projection from current market reports">
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MARKET_GROWTH} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C94C73" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#C94C73" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}B`} />
                      <Tooltip formatter={(v) => [`$${v}B`, "Market size"]} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#C94C73"
                        strokeWidth={3}
                        fill="url(#growthFill)"
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#9a2143"
                        strokeWidth={0}
                        dot={{ r: 5, fill: "#9a2143", strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              <Panel title="Where vendors should focus" subtitle="Priority index is product-side inference based on market signals">
                <div className="h-[360px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={VENDOR_PRIORITY}
                      layout="vertical"
                      margin={{ top: 10, right: 18, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={160}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip />
                      <Bar dataKey="value" radius={[0, 12, 12, 0]}>
                        {VENDOR_PRIORITY.map((entry, index) => (
                          <Cell
                            key={`cell-${entry.name}`}
                            fill={index % 2 === 0 ? "#C94C73" : "#f4d8e1"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <Panel title="Payment behavior" subtitle="More couples are already using digital modes">
                <DonutChart
                  data={PAYMENT_MIX}
                  centerLabel="Payment"
                  accentColor="#C94C73"
                />
                <div className="mt-4 space-y-2">
                  <MiniLegend label="Digital" value="38%" color="#C94C73" />
                  <MiniLegend label="Cash / Other" value="62%" color="#f4d8e1" />
                </div>
              </Panel>

              <Panel title="Destination preference" subtitle="Most destination weddings stay inside India">
                <DonutChart
                  data={DESTINATION_LOCATION_MIX}
                  centerLabel="Destination"
                  accentColor="#7c3aed"
                />
                <div className="mt-4 space-y-2">
                  <MiniLegend label="Within India" value="89%" color="#7c3aed" />
                  <MiniLegend label="International" value="11%" color="#ddd6fe" />
                </div>
              </Panel>
            </div>
          </div>

          <div className="grid gap-6 px-6 pb-8 md:px-8 xl:grid-cols-12">
            <div className="xl:col-span-7 space-y-6">
              <Panel title="Best places to recommend" subtitle="Fit score is a planning inference from current market signals">
                <div className="h-[330px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={LOCATION_FIT} margin={{ top: 10, right: 14, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                        {LOCATION_FIT.map((entry, index) => (
                          <Cell key={entry.name} fill={PALETTE[index % PALETTE.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              <Panel title="Destination format mix" subtitle="Beach & island leads the destination sub-type mix in the India market">
                <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={DESTINATION_TYPE_MIX}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={72}
                          outerRadius={108}
                          paddingAngle={3}
                        >
                          {DESTINATION_TYPE_MIX.map((_, index) => (
                            <Cell
                              key={`dest-${index}`}
                              fill={index === 0 ? "#C94C73" : "#f4d8e1"}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex flex-col justify-center rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-semibold text-slate-900">
                      What this means for planning
                    </div>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                      <li className="flex gap-3">
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#C94C73]" />
                        Beach and island setups are strong for premium, photo-friendly destination weddings.
                      </li>
                      <li className="flex gap-3">
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#C94C73]" />
                        Rajasthan, Goa, Kerala, and Udaipur remain highly suitable destination options.
                      </li>
                      <li className="flex gap-3">
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#C94C73]" />
                        Use venue availability alerts because supply pressure is a real frustration point.
                      </li>
                    </ul>
                  </div>
                </div>
              </Panel>
            </div>

            <div className="xl:col-span-5 space-y-6">
              <Panel title="What users care about before booking" subtitle="Trust, speed, and proof matter">
                <div className="grid gap-3 sm:grid-cols-2">
                  {INSIGHTS.slice(3).map((item) => (
                    <InsightCard key={item.title} item={item} compact />
                  ))}
                </div>
              </Panel>

              <Panel title="Planning playbook" subtitle="A guided decision path for the user">
                <div className="space-y-4">
                  {ACTION_STEPS.map((item) => (
                    <StepCard key={item.step} item={item} />
                  ))}
                </div>
              </Panel>

              <Panel title="Quick market callout" subtitle="The clearest actionable signals">
                <div className="space-y-3 text-sm leading-6 text-slate-600">
                  <Callout
                    icon={UtensilsCrossed}
                    title="Book venues and catering first"
                    text="That segment leads the market, so inventory and date availability will matter most."
                  />
                  <Callout
                    icon={Video}
                    title="Push photography and reels-friendly content"
                    text="Demand is visibly moving toward experience-first celebrations and shareable moments."
                  />
                  <Callout
                    icon={Users}
                    title="Surface reviews and response speed"
                    text="A third of couples already check reviews, and fast response is a meaningful trust signal."
                  />
                  <Callout
                    icon={HeartHandshake}
                    title="Promote local destination clusters"
                    text="Jaipur, Udaipur, Goa, and Kerala should be highlighted as first-class recommendations."
                  />
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function InsightCard({ item, compact = false }) {
  const Icon = item.icon;
  return (
    <div className={`rounded-[24px] border border-slate-200 bg-gradient-to-br ${item.tone} p-5 shadow-sm`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Icon className="h-5 w-5 text-[#C94C73]" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {item.title}
          </div>
          <div className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
            {item.value}
          </div>
        </div>
      </div>
      <p className={`mt-3 text-sm leading-6 text-slate-600 ${compact ? "min-h-[72px]" : "min-h-[88px]"}`}>
        {item.text}
      </p>
    </div>
  );
}

function StatChip({ label, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon className="h-3.5 w-3.5 text-[#C94C73]" />
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold tracking-tight text-slate-900">{value}</div>
    </div>
  );
}

function DonutChart({ data, centerLabel, accentColor }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative mx-auto h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={72}
            outerRadius={106}
            paddingAngle={4}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={index === 0 ? accentColor : "#ede9fe"}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            {centerLabel}
          </div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {total}%
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniLegend({ label, value, color }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function StepCard({ item }) {
  return (
    <div className="flex gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-sm font-semibold text-[#9a2143] shadow-sm">
        {item.step}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
      </div>
    </div>
  );
}

function Callout({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-3 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
      <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm">
        <Icon className="h-4.5 w-4.5 text-[#C94C73]" />
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}