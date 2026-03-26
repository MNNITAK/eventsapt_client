"use client";

import { useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Filter,
    Sparkles,
    TrendingUp,
    Users,
    Calendars
} from "lucide-react";
import EventCard from "./EventCard.js";
import { PAST_EVENTS, UPCOMING_EVENTS } from "./eventData.js";

const FILTERS = [
    { key: "all", label: "All events" },
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Hosted" },
];

export function EventsOverview() {
    const [activeFilter, setActiveFilter] = useState("all");

    const counts = useMemo(() => {
        return {
            upcoming: UPCOMING_EVENTS.length,
            past: PAST_EVENTS.length,
            total: UPCOMING_EVENTS.length + PAST_EVENTS.length,
        };
    }, []);

    const showUpcoming = activeFilter === "all" || activeFilter === "upcoming";
    const showPast = activeFilter === "all" || activeFilter === "past";

    return (
        <div className="space-y-6 w-[95%] mx-auto mt-5">
            <div className="rounded-[32px] border relative border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <button className="absolute right-5 flex items-center gap-2 rounded-lg bg-[#C94C73] px-4 py-2 text-sm font-medium text-white">
                    <Calendars />
                    Create Event
                </button>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl relative">

                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f1c6d5] bg-[#fff7fa] px-3 py-1 text-xs font-medium text-[#9a2143]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Event planning dashboard
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                            Track upcoming events and hosted milestones
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                            See what is scheduled next, how much of each event plan is done, and
                            review completed events from one clean dashboard.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <StatCard icon={CalendarDays} label="Upcoming" value={counts.upcoming} />
                        <StatCard icon={CheckCircle2} label="Hosted" value={counts.past} />
                        <StatCard icon={TrendingUp} label="Total" value={counts.total} />
                    </div>
                </div>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-1">
                    <div className="grid grid-cols-3 gap-1">
                        {FILTERS.map((item) => {
                            const active = activeFilter === item.key;
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => setActiveFilter(item.key)}
                                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${active
                                            ? "bg-white text-[#9a2143] shadow-sm"
                                            : "text-slate-500 hover:text-slate-900"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {showUpcoming && (
                <section className="space-y-4">
                    <SectionTitle
                        title="Upcoming events"
                        subtitle="Cards show progress, days left, and the latest update count."
                    />
                    <div className="grid gap-5">
                        {UPCOMING_EVENTS.map((item) => (
                            <EventCard key={item.id} item={item} status="upcoming" />
                        ))}
                    </div>
                </section>
            )}

            {showPast && (
                <section className="space-y-4">
                    <SectionTitle
                        title="Hosted / past events"
                        subtitle="Completed events keep the same card style with recap details."
                    />
                    <div className="grid gap-5">
                        {PAST_EVENTS.map((item) => (
                            <EventCard key={item.id} item={item} status="past" />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

function SectionTitle({ title, subtitle }) {
    return (
        <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
    );
}

function StatCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Icon className="h-3.5 w-3.5 text-[#C94C73]" />
                {label}
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {value}
            </div>
        </div>
    );
}