import {
  ArrowUpRight,
  Bell,
  BadgeCheck,
  CalendarDays,
  Clock3,
  MapPin,
  MessagesSquare,
  Users,
} from "lucide-react";
import CircularProgress from "./CircularProgress.js";
import { EVENT_ICON_MAP } from "./eventData.js";

export default function EventCard({ item, status = "upcoming" }) {
  const Icon = EVENT_ICON_MAP[item.icon] || CalendarDays;
  const isPast = status === "past";

  return (
    <article className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f4d8e1] text-[#9a2143] shadow-sm">
            <Icon className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {isPast ? "Hosted" : "Upcoming"}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                  item.priority === "High"
                    ? "bg-rose-50 text-rose-700"
                    : item.priority === "Medium"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {item.priority}
              </span>
            </div>

            <h3 className="truncate text-lg font-semibold tracking-tight text-slate-900">
              {item.title}
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {item.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <MetaPill icon={<MapPin className="h-3.5 w-3.5" />} text={item.location} />
              <MetaPill icon={<Users className="h-3.5 w-3.5" />} text={`${item.guestCount} guests`} />
              <MetaPill icon={<MessagesSquare className="h-3.5 w-3.5" />} text={`${item.updates} updates`} />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-start gap-4 lg:flex-col lg:items-end">
          <CircularProgress
            progress={item.progress}
            label={isPast ? "100%" : `${item.progress}%`}
          />

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            {!isPast ? (
              <>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Clock3 className="h-3.5 w-3.5 text-[#C94C73]" />
                  Days left
                </div>
                <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  {item.daysLeft}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Completed on
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {item.completedOn}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
            <Bell className="h-4 w-4 text-[#C94C73]" />
            {item.updates} new updates
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
            <Clock3 className="h-4 w-4 text-slate-400" />
            Last updated {item.lastUpdated}
          </span>

          {isPast && (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
              Rating {item.rating}
            </span>
          )}
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
          {isPast ? "View recap" : "View event"}
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function MetaPill({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
      {icon}
      {text}
    </span>
  );
}