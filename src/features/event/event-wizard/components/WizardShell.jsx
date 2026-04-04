'use client';

/**
 * WizardShell.jsx
 *
 * The root client shell for every step page inside the event wizard.
 * URL pattern: /event-wizard/[eventType]/[stepId]?node=[eventUID]
 *
 * Layout (desktop):
 * ┌────────────────────────────────────────────────────────────┐
 * │  Sticky top header  (event title · step label · autosave) │
 * ├─────────────────┬──────────────────────────────────────────┤
 * │  Left sidebar   │  Right panel: step form                  │
 * │  (progress +    │  (scrollable, max-w-2xl centred)         │
 * │   step list)    │                                          │
 * ├─────────────────┴──────────────────────────────────────────┤
 * │  Sticky footer  (Save Draft · Back · Skip · Continue)     │
 * └────────────────────────────────────────────────────────────┘
 *
 * Layout (mobile):
 * ─ Top header (hamburger opens sidebar drawer)
 * ─ Step form (full width)
 * ─ Sticky footer nav
 *
 * State management:
 * - Zustand + localStorage via useEventDraft(uid)  ← your store
 * - Per-step Zod validation on "Continue"
 * - completedSteps tracked inside the draft object
 *
 * Props (all passed from the Next.js server page):
 *   eventType   string   — e.g. "wedding"
 *   eventUID    string   — the ?node= query value
 *   allSteps    array    — from getStepsForEvent(eventType)
 *   currentStep object   — the step config for this URL segment
 *   stepIndex   number   — 0-based
 *   nextStepId  string|null
 *   prevStepId  string|null
 *   StepForm    component — the actual form for this step (passed as prop)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Sparkles,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

import { useEventDraft } from '@/store/useEventDraftStore';
import { validateStep } from '@/config/eventSchemas';
import { getProgress, EVENT_STEPS } from '@/config/eventSteps';
import { STEP_ICON_MAP } from './stepIconMap';

// ─── Category accent colours ──────────────────────────────────────────────────

const CATEGORY_DOT = {
  Planning:  'bg-violet-500',
  Logistics: 'bg-blue-500',
  Vendors:   'bg-emerald-500',
  Finalize:  'bg-amber-500',
};

// ─── WizardShell ──────────────────────────────────────────────────────────────

export default function WizardShell({
  eventType,
  eventUID,
  allSteps,
  currentStep,
  stepIndex,
  nextStepId,
  prevStepId,
  StepForm, // optional — if not passed, renders field-list placeholder
}) {
  const router = useRouter();

  // ── Zustand draft store ───────────────────────────────────────────────────
  const {
    hydrated,
    draft,
    upsertDraft,
    upsertDraftDebounced,
    removeDraft,
  } = useEventDraft(eventUID);

  // ── Local UI state ────────────────────────────────────────────────────────
  const [fieldErrors,       setFieldErrors]       = useState({});
  const [saveStatus,        setSaveStatus]         = useState('idle'); // idle | saving | saved | error
  const [mobileSidebarOpen, setMobileSidebarOpen]  = useState(false);
  const saveTimer = useRef(null);

  // ── Derive completed steps from draft ─────────────────────────────────────
  const completedStepIds = draft?._completedSteps ?? [];
  const eventMeta        = EVENT_STEPS[eventType] ?? {};
  const totalSteps       = allSteps.filter((s) => s.id !== 'review').length;
  const completedCount   = completedStepIds.filter((id) => id !== 'review').length;
  const progress         = getProgress(eventType, completedStepIds);
  const isLastStep       = !nextStepId;
  const errorCount       = Object.keys(fieldErrors).length;

  // ── Field change handler — debounced write to Zustand ─────────────────────
  const handleChange = useCallback(
    (field, value) => {
      // Clear inline error immediately so user sees response
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
      // Debounced draft write (400 ms) — safe for typing fields
      upsertDraftDebounced({ [field]: value }, 400);
    },
    [upsertDraftDebounced]
  );

  // ── Instant change for select/checkbox/radio (no typing delay needed) ─────
  const handleChangeImmediate = useCallback(
    (field, value) => {
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
      upsertDraft({ [field]: value });
    },
    [upsertDraft]
  );

  // ── Navigate to another step ──────────────────────────────────────────────
  const navigateTo = useCallback(
    (stepId) => {
      router.push(`/event-wizard/${eventType}/${stepId}?node=${eventUID}`);
    },
    [router, eventType, eventUID]
  );

  // ── Back ──────────────────────────────────────────────────────────────────
  function handleBack() {
    if (prevStepId) {
      navigateTo(prevStepId);
    } else {
      router.push(`/event-wizard/${eventType}/steps?node=${eventUID}`);
    }
  }

  // ── Save draft (manual button) ────────────────────────────────────────────
  function handleSaveDraft() {
    clearTimeout(saveTimer.current);
    setSaveStatus('saving');
    // upsertDraft with empty patch just forces a store sync
    upsertDraft({});
    saveTimer.current = setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 300);
  }

  // ── Continue (validate → mark complete → navigate) ────────────────────────
  function handleContinue() {
    // Pull current step's fields out of draft
    const stepData = {};
    (currentStep.fields ?? []).forEach((f) => {
      stepData[f] = draft?.[f];
    });

    const result = validateStep(currentStep.id, stepData);
    if (!result.success) {
      setFieldErrors(result.errors ?? {});
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Mark step complete — stored inside the draft itself
    const already = completedStepIds.includes(currentStep.id);
    if (!already) {
      upsertDraft({
        _completedSteps: [...completedStepIds, currentStep.id],
      });
    }

    if (nextStepId) {
      navigateTo(nextStepId);
    } else {
      // Final step — navigate to review / submit
      navigateTo('review');
    }
  }

  // ── Skip optional step ────────────────────────────────────────────────────
  function handleSkip() {
    if (nextStepId) navigateTo(nextStepId);
  }

  // ── Close mobile sidebar on route change ─────────────────────────────────
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [currentStep.id]);

  // ── Show hydration guard — avoid flash of empty form ─────────────────────
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 size={28} className="animate-spin" />
          <p className="text-sm font-medium">Loading your draft…</p>
        </div>
      </div>
    );
  }

  // ── Sidebar step item ─────────────────────────────────────────────────────
  function SidebarItem({ step, idx }) {
    const isActive    = step.id === currentStep.id;
    const isCompleted = completedStepIds.includes(step.id);
    const Icon        = STEP_ICON_MAP[step.icon] ?? STEP_ICON_MAP.Circle;
    const catDot      = CATEGORY_DOT[step.category] ?? 'bg-gray-400';

    return (
      <button
        type="button"
        onClick={() => {
          navigateTo(step.id);
          setMobileSidebarOpen(false);
        }}
        title={step.label}
        className={[
          'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 group',
          isActive
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        ].join(' ')}
      >
        {/* Step circle */}
        <div
          className={[
            'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
            isCompleted
              ? 'bg-green-500 text-white'
              : isActive
              ? 'bg-indigo-600 text-white'
              : 'border-2 border-gray-300 text-gray-400',
          ].join(' ')}
        >
          {isCompleted ? (
            <CheckCircle2 size={12} strokeWidth={2.5} />
          ) : (
            <Icon size={11} />
          )}
        </div>

        {/* Label */}
        <span
          className={[
            'text-xs leading-tight truncate flex-1',
            isActive   ? 'font-semibold text-indigo-700' : '',
            isCompleted ? 'text-gray-700' : '',
          ].join(' ')}
        >
          {step.shortLabel}
        </span>

        {/* Optional badge */}
        {step.optional && (
          <span className="text-[9px] italic text-gray-400 flex-shrink-0">opt</span>
        )}
      </button>
    );
  }

  // ── Sidebar panel content ─────────────────────────────────────────────────
  function SidebarContent() {
    // Group steps by category preserving order
    const grouped = allSteps.reduce((acc, step) => {
      const cat = step.category ?? 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(step);
      return acc;
    }, {});

    const catOrder = ['Planning', 'Logistics', 'Vendors', 'Finalize'];
    const sortedCats = Object.keys(grouped).sort(
      (a, b) => catOrder.indexOf(a) - catOrder.indexOf(b)
    );

    return (
      <div className="flex flex-col h-full">
        {/* Event type badge */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
            {eventMeta.label ?? eventType}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {draft?.eventName || 'Untitled Event'}
          </p>
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-gray-400">{completedCount}/{totalSteps} steps</span>
              <span className="text-[10px] font-semibold text-indigo-600">{progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step list by category */}
        <div className="flex-1 overflow-y-auto py-3 px-2">
          {sortedCats.map((cat) => (
            <div key={cat} className="mb-3">
              <div className="flex items-center gap-1.5 px-2 mb-1">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${CATEGORY_DOT[cat] ?? 'bg-gray-400'}`} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  {cat}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                {grouped[cat].map((step, idx) => (
                  <SidebarItem key={step.id} step={step} idx={idx} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Back to overview link */}
        <div className="flex-shrink-0 px-3 py-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() =>
              router.push(`/event-wizard/${eventType}/steps?node=${eventUID}`)
            }
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors w-full"
          >
            <ArrowLeft size={12} />
            Back to overview
          </button>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ══ Sticky top header ══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-14 flex items-center px-4 sm:px-6 gap-3">

        {/* Mobile sidebar toggle */}
        <button
          type="button"
          aria-label="Toggle step list"
          onClick={() => setMobileSidebarOpen((v) => !v)}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex-shrink-0 transition-colors"
        >
          <Menu size={16} />
        </button>

        {/* Step meta */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 leading-none mb-0.5 hidden sm:block">
            Step {stepIndex + 1} of {allSteps.length} &nbsp;·&nbsp; {currentStep.category}
          </p>
          <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate leading-tight">
            {currentStep.label}
          </h1>
        </div>

        {/* Autosave indicator */}
        <div className="flex-shrink-0">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Loader2 size={11} className="animate-spin" />
              Saving…
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              <Save size={11} /> Saved
            </span>
          )}
        </div>
      </header>

      {/* ══ Body ═══════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Desktop sidebar ────────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-56 xl:w-60 flex-shrink-0 bg-white border-r border-gray-200 sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden">
          <SidebarContent />
        </aside>

        {/* ── Mobile sidebar overlay ─────────────────────────────────────── */}
        {mobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            <aside className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col lg:hidden shadow-xl">
              {/* Mobile sidebar header */}
              <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 flex-shrink-0">
                <span className="text-sm font-semibold text-gray-800">Planning Steps</span>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <SidebarContent />
              </div>
            </aside>
          </>
        )}

        {/* ── Main step content panel ────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-32">

            {/* Step description */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 leading-relaxed">
                {currentStep.description}
              </p>
              {currentStep.optional && (
                <span className="inline-block mt-2 text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                  This step is optional — you can skip it
                </span>
              )}
            </div>

            {/* ── Validation error summary ───────────────────────────────── */}
            {errorCount > 0 && (
              <div
                role="alert"
                className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6"
              >
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">
                    Fix {errorCount} error{errorCount !== 1 ? 's' : ''} before continuing
                  </p>
                  <ul className="list-disc list-inside text-xs text-red-600 space-y-0.5">
                    {Object.values(fieldErrors).map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ── Step form ─────────────────────────────────────────────── */}
            {StepForm ? (
              <StepForm
                draft={draft ?? {}}
                errors={fieldErrors}
                onChange={handleChange}
                onChangeImmediate={handleChangeImmediate}
              />
            ) : (
              <StepFieldPlaceholder step={currentStep} draft={draft ?? {}} />
            )}

          </div>
        </main>
      </div>

      {/* ══ Sticky footer nav ══════════════════════════════════════════════ */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-3 flex-wrap">

          {/* Left: Save Draft */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800 text-xs sm:text-sm rounded-xl bg-white transition-colors"
          >
            <Save size={13} />
            <span className="hidden xs:inline">Save Draft</span>
          </button>

          {/* Right: Back · Skip · Continue */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium rounded-xl bg-white transition-colors"
            >
              <ChevronLeft size={14} />
              <span>Back</span>
            </button>

            {currentStep.optional && !isLastStep && (
              <button
                type="button"
                onClick={handleSkip}
                className="px-3 sm:px-4 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors hidden sm:block"
              >
                Skip
              </button>
            )}

            <button
              type="button"
              onClick={handleContinue}
              className={[
                'flex items-center gap-1.5 px-4 sm:px-5 py-2 text-white text-sm font-semibold rounded-xl transition-all active:scale-95',
                isLastStep
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 shadow-md shadow-indigo-200'
                  : 'bg-indigo-600 hover:bg-indigo-700',
              ].join(' ')}
            >
              {isLastStep ? (
                <>
                  <Sparkles size={13} />
                  Create Event
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Development placeholder ──────────────────────────────────────────────────
// Shows the field list for a step until the real form component is built.

function StepFieldPlaceholder({ step, draft }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
        Step form placeholder
      </p>
      <p className="text-sm font-semibold text-indigo-600 mb-3">{step.label}</p>
      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
        Create{' '}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
          components/steps/{step.id}.jsx
        </code>{' '}
        and pass it as the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">StepForm</code> prop.
        Zod validation is already wired via{' '}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">eventSchemas.js</code>.
      </p>
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
        Fields in this step:
      </p>
      <div className="flex flex-wrap gap-1.5">
        {step.fields.length > 0 ? (
          step.fields.map((f) => (
            <span
              key={f}
              className={[
                'text-xs font-mono px-2.5 py-1 rounded-full',
                draft[f] !== undefined
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500',
              ].join(' ')}
            >
              {f}
              {draft[f] !== undefined && ' ✓'}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400 italic">
            No fields — read-only review step
          </span>
        )}
      </div>
    </div>
  );
}
