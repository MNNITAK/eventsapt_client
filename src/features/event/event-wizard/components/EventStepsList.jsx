'use client';

/**
 * EventStepsList.jsx
 *
 * The "Step 0" overview screen — rendered at:
 *   /event-wizard/[eventType]/steps?node=[eventUID]
 *
 * Shows the full planning journey for the chosen event type.
 * Uses the Zustand draft store to read completed steps and progress.
 *
 * Layout:
 * ┌──────────────────────────────────┐
 * │  Hero banner (event name,        │
 * │  estimated time, progress bar)   │
 * ├──────────────────────────────────┤
 * │  Step cards grouped by category  │
 * │  (Planning / Logistics / Vendors │
 * │   / Finalize)                    │
 * ├──────────────────────────────────┤
 * │  Bottom CTA button               │
 * └──────────────────────────────────┘
 *
 * Props:
 *   eventType  string  — e.g. "wedding"
 *   eventUID   string  — ?node= query value
 */
import React from 'react';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  Clock,
  Layers,
  ArrowRight,
  Lock,
  Loader2,
} from 'lucide-react';
import { Sparkles, Calendar, User } from 'lucide-react';
import { useEventDraft } from '../hooks/useEventDraftStore.js';
import { EVENT_STEPS, getStepsByCategory, getProgress } from '../config/eventSteps.js';
import { STEP_ICON_MAP } from './stepIconMap.js';

// ─── Category meta ────────────────────────────────────────────────────────────

const CATEGORY_META = {
  Planning: { order: 0, dot: 'bg-violet-500', pill: 'bg-violet-50 text-violet-700 border-violet-200' },
  Logistics: { order: 1, dot: 'bg-blue-500', pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  Vendors: { order: 2, dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Finalize: { order: 3, dot: 'bg-amber-500', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
};
// ---- Aesthetic left panel ===================================================
const Sidebar = ({ eventMeta, userName = "Ujjwal Gupta" }) => {
  // Example progress - you can pass this as a prop
  const progress = 6; 

  return (
    <div className="relative w-[25vw] h-screen overflow-hidden flex flex-col justify-between p-10 text-white shadow-2xl">
      
      {/* AESTHETIC MESH BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-[#4f46e5]">
        {/* Soft Animated-like Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[60%] bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full blur-[80px] opacity-60 animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-10%] w-[80%] h-[50%] bg-pink-500 rounded-full blur-[100px] opacity-40" />
      </div>

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col h-full">
        
        {/* LOGO / BRANDING SECTION */}
        <div className="mb-12 flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg border border-white/30">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="font-bold tracking-widest text-sm uppercase opacity-80">Evently Pro</span>
        </div>

        {/* WELCOME SECTION */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-100 mb-1">
             <span className="h-[1px] w-8 bg-indigo-200 opacity-50"></span>
             <p className="text-xs font-medium uppercase tracking-tighter">Your Dashboard</p>
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            Hello, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
              {userName.split(' ')[0]}
            </span>
          </h1>
          <p className="text-indigo-50 text-lg font-light leading-relaxed pt-4 opacity-90">
            {eventMeta?.description || "Ready to turn your vision into a reality?"}
          </p>
        </div>

        {/* UX FEATURE: MINI PROGRESS TRACKER */}
        <div className="mt-auto mb-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transition-all hover:bg-white/15">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-xs font-semibold text-indigo-100 uppercase mb-1">Planning Progress</p>
                <h4 className="text-xl font-bold">{progress}% Complete</h4>
              </div>
              <CheckCircle2 size={24} className="text-indigo-200" />
            </div>
            
            {/* Custom Progress Bar */}
            <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <p className="text-[10px] mt-4 text-indigo-100/70  italic">
              "Great things are done by a series of small things brought together."
            </p>
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="flex items-center gap-4 text-white/60 text-xs">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>April 2026</span>
          </div>
          <div className="h-1 w-1 bg-white/40 rounded-full"></div>
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>ID: 9921-U</span>
          </div>
        </div>
      </div>
    </div>
  );
};
// ─── EventStepsList ───────────────────────────────────────────────────────────

export default function EventStepsList({ eventType, eventUID }) {
  const router = useRouter();
  const eventMeta = EVENT_STEPS[eventType];

  // ── Zustand draft ─────────────────────────────────────────────────────────
  const { hydrated, draft } = useEventDraft(eventUID);

  const completedStepIds = draft?._completedSteps ?? [];
  const allSteps = eventMeta?.steps ?? [];
  const totalSteps = allSteps.filter((s) => s.id !== 'review').length;
  const completedCount = completedStepIds.filter((id) => id !== 'review').length;
  const progress = getProgress(eventType, completedStepIds);
  const hasProgress = completedCount > 0;

  const stepsByCategory = useMemo(
    () => getStepsByCategory(eventType),
    [eventType]
  );

  // The first step that isn't yet completed, used for "Continue" / "Start"
  const resumeStepId =
    allSteps.find((s) => !completedStepIds.includes(s.id))?.id ??
    allSteps[0]?.id;

  function navigateTo(stepId) {
    router.push(`/event-wizard/${eventType}/${stepId}?node=${eventUID}`);
  }

  // ── Hydration guard ───────────────────────────────────────────────────────
  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 size={26} className="animate-spin" />
          <p className="text-sm">Loading your event…</p>
        </div>
      </div>
    );
  }

  if (!eventMeta) return null;

  const sortedCategories = Object.keys(stepsByCategory).sort(
    (a, b) =>
      (CATEGORY_META[a]?.order ?? 99) - (CATEGORY_META[b]?.order ?? 99)
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className='flex w-[100vw] h-[100vh]'>
      {/* Left panel */}
      {/* <div className='w-[25vw] bg-white flex flex-col justify-center items-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#4f46e5] via-[#818cf8] to-[#c7d2fe] h-[100vh]'>
        <h1 className='w-[90%] text-6xl bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent font-bold'>Welcome!</h1>
        <h3 className='w-[90%] text-4xl font-semibold text-white'>Ujjwal Gupta</h3>
        <p className=" w-[90%] text-2xl text-gray-200 mt-10 leading-relaxed">
          {eventMeta.description}
        </p>
        <p className='w-[90%] text-sm text-gray-200 mt-5'>
          Complete your journey
        </p>
      </div> */}
      <Sidebar eventType={eventType} eventUID={eventUID} />
      {/* Right panel for listing down event steps */}
      <div className="w-[75vw] h-[100vh] overflow-y-auto mx-auto md:px-20 sm:px-6 py-6 sm:py-10">

        {/* ── Hero banner ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">

          {/* Banner body */}
          <div className="px-5 sm:px-8 py-6 sm:py-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                  Your planning journey
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 leading-tight">
                  {eventMeta.label} Planner
                </h1>
                {draft?.eventName && (
                  <p className="text-sm text-indigo-600 font-medium mb-1 truncate">
                    "{draft.eventName}"
                  </p>
                )}
                <p className="text-sm text-gray-500 leading-relaxed">
                  {eventMeta.description}
                </p>
              </div>

              {/* Meta chips */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
                  <Clock size={12} />
                  {eventMeta.estimatedTime}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
                  <Layers size={12} />
                  {totalSteps} steps
                </div>
              </div>
            </div>

            {/* Progress bar — only when work has started */}
            {hasProgress && (
              <div className="mt-5">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-500">
                    {completedCount} of {totalSteps} steps completed
                  </span>
                  <span className="text-xs font-bold text-indigo-600">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Banner footer / CTA */}
          <div className="px-5 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              {hasProgress
                ? 'Pick up where you left off, or jump to any section below.'
                : 'Complete each section in order. You can jump to any step after starting.'}
            </p>
            <button
              type="button"
              onClick={() => navigateTo(resumeStepId)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm whitespace-nowrap flex-shrink-0"
            >
              {hasProgress ? 'Continue Planning' : 'Start Planning'}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* ── Step cards by category ───────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {sortedCategories.map((category) => {
            const catSteps = stepsByCategory[category];
            const catMeta = CATEGORY_META[category] ?? CATEGORY_META.Planning;
            const catDone = catSteps.filter((s) => completedStepIds.includes(s.id)).length;

            return (
              <div
                key={category}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Category header */}
                <div className="flex items-center gap-2.5 px-5 sm:px-6 py-3 border-b border-gray-100 bg-gray-50/60">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${catMeta.dot}`} />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500 flex-1">
                    {category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {catDone}/{catSteps.length}
                  </span>
                </div>

                {/* Steps */}
                <div className="divide-y divide-gray-100">
                  {catSteps.map((step) => {
                    const isCompleted = completedStepIds.includes(step.id);
                    const isReview = step.id === 'review';
                    const isOptional = step.optional === true;
                    const Icon = STEP_ICON_MAP[step.icon] ?? Circle;

                    // Accessibility: a step is clickable if it's the first one,
                    // we have progress, or the step is completed
                    const isClickable = hasProgress || isCompleted || step.id === allSteps[0]?.id;

                    return (
                      <button
                        key={step.id}
                        type="button"
                        disabled={!isClickable}
                        onClick={() => isClickable && navigateTo(step.id)}
                        className={[
                          'w-full flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-4 text-left transition-all group',
                          isClickable
                            ? 'hover:bg-indigo-50/40 cursor-pointer'
                            : 'cursor-not-allowed opacity-45',
                          isCompleted ? 'bg-green-50/30' : '',
                        ].join(' ')}
                      >
                        {/* Status circle */}
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                          {isCompleted ? (
                            <CheckCircle2 size={22} className="text-green-500" strokeWidth={2} />
                          ) : isClickable ? (
                            <div className="w-8 h-8 rounded-full border-2 border-gray-200 group-hover:border-indigo-400 flex items-center justify-center transition-colors">
                              <Icon size={14} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-gray-100 flex items-center justify-center">
                              <Lock size={12} className="text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Step info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span
                              className={[
                                'text-sm font-semibold leading-tight',
                                isCompleted ? 'text-green-700' : 'text-gray-800',
                              ].join(' ')}
                            >
                              {step.label}
                            </span>

                            {isOptional && (
                              <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                Optional
                              </span>
                            )}
                            {isReview && (
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catMeta.pill}`}>
                                Final step
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-1 sm:line-clamp-none">
                            {step.description}
                          </p>
                        </div>

                        {/* Arrow */}
                        {isClickable && (
                          <ChevronRight
                            size={16}
                            className="text-gray-300 group-hover:text-indigo-400 flex-shrink-0 transition-colors"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────────────────── */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => navigateTo(resumeStepId)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
          >
            {hasProgress ? 'Continue where you left off' : 'Begin with Step 1'}
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
