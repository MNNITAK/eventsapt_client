'use client';

/**
 * WizardShell.jsx
 *
 * The root client shell for every step page inside the event wizard.
 * URL pattern: /event-wizard/[eventType]/[stepId]?node=[eventUID]
 *
 * Layout (desktop ≥ lg):
 * ┌───────────────────┬────────────────────────────────────────────┐
 * │                   │  Glassmorphism header (step title + save)  │
 * │  Left sidebar     ├────────────────────────────────────────────┤
 * │  22vw wide        │  Scrollable form area                      │
 * │  100vh tall       │  (flex-1, overflow-y-auto)                 │
 * │  (progress +      ├────────────────────────────────────────────┤
 * │   step list)      │  Footer nav (Save Draft · Back · Continue) │
 * └───────────────────┴────────────────────────────────────────────┘
 *
 * Layout (mobile < lg):
 * ┌────────────────────────────────────────────────────────────────┐
 * │  Header (hamburger · step title · autosave)                   │
 * ├────────────────────────────────────────────────────────────────┤
 * │  Scrollable form area                                         │
 * ├────────────────────────────────────────────────────────────────┤
 * │  Footer nav                                                   │
 * └────────────────────────────────────────────────────────────────┘
 * Sidebar slides in as an overlay drawer triggered by hamburger.
 *
 * KEY LAYOUT RULES:
 *  - Outer shell: `flex-row`, `w-[100vw]`, `h-[100vh]`, `overflow-hidden`
 *  - Sidebar:     `w-[22vw]`, `h-[100vh]`, `overflow-y-auto` — no sticky/fixed
 *  - Right panel: `flex-col`, `w-[78vw]`, `h-[100vh]` — natural flow
 *    ├─ Header:   `flex-shrink-0` — glassmorphism effect
 *    ├─ Body:     `flex-1`, `overflow-y-auto` — scrolls independently
 *    └─ Footer:   `flex-shrink-0` — always visible at bottom
 *
 * ✅ Zero logic changes from original — only className strings changed.
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

import { useEventDraft } from '../hooks/useEventDraftStore.js';
import { validateStep } from '../config/eventSchemas.js';
import { getProgress, EVENT_STEPS } from '../config/eventSteps.js';
import { STEP_ICON_MAP } from './stepIconMap.js';

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
  StepForm,
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
  const [saveStatus,        setSaveStatus]         = useState('idle');
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
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
      upsertDraftDebounced({ [field]: value }, 400);
    },
    [upsertDraftDebounced]
  );

  // ── Instant change for select/checkbox/radio ──────────────────────────────
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
    upsertDraft({});
    saveTimer.current = setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 300);
  }

  // ── Continue (validate → mark complete → navigate) ────────────────────────
  function handleContinue() {
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

    const already = completedStepIds.includes(currentStep.id);
    if (!already) {
      upsertDraft({
        _completedSteps: [...completedStepIds, currentStep.id],
      });
    }

    if (nextStepId) {
      navigateTo(nextStepId);
    } else {
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
      <div className="w-[100vw] h-[100vh] flex items-center justify-center bg-gray-50">
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
            isActive    ? 'font-semibold text-indigo-700' : '',
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
    const grouped = allSteps.reduce((acc, step) => {
      const cat = step.category ?? 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(step);
      return acc;
    }, {});

    const catOrder   = ['Planning', 'Logistics', 'Vendors', 'Finalize'];
    const sortedCats = Object.keys(grouped).sort(
      (a, b) => catOrder.indexOf(a) - catOrder.indexOf(b)
    );

    return (
      /* fill the full sidebar height, split into 3 rows:
         top info block | scrollable step list | bottom back-link */
      <div className="flex flex-col h-full">

        {/* ── Top: event badge + progress ── */}
        <div className="px-4 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
            {eventMeta.label ?? eventType}
          </p>
          <p className="text-xs font-medium text-gray-700 truncate">
            {draft?.eventName || 'Untitled Event'}
          </p>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1.5">
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

        {/* ── Middle: scrollable step list ── */}
        <div className="flex-1 overflow-y-auto py-3 px-2">
          {sortedCats.map((cat) => (
            <div key={cat} className="mb-4">
              {/* Category label */}
              <div className="flex items-center gap-1.5 px-2 mb-1.5">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${CATEGORY_DOT[cat] ?? 'bg-gray-400'}`} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  {cat}
                </span>
              </div>
              {/* Step buttons */}
              <div className="flex flex-col gap-0.5">
                {grouped[cat].map((step, idx) => (
                  <SidebarItem key={step.id} step={step} idx={idx} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom: back to overview ── */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-100">
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
    /*
      Root: full viewport, flex-row.
      Sidebar fills the left 22vw, right panel fills the remaining 78vw.
      Both are 100vh tall. No fixed/sticky anywhere.
    */
    <div className="flex flex-row w-[100vw] h-[100vh] overflow-hidden bg-gray-50">

      {/* ══ LEFT SIDEBAR — desktop only ════════════════════════════════════ */}
      <aside
        className="
          hidden lg:flex flex-col
          w-[22vw] h-[100vh]
          bg-white border-r border-gray-200
          flex-shrink-0
          overflow-hidden
        "
      >
        <SidebarContent />
      </aside>

      {/* ══ MOBILE SIDEBAR OVERLAY ═════════════════════════════════════════ */}
      {mobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside
            className="
              fixed left-0 top-0 z-50
              w-[80vw] max-w-[320px] h-[100vh]
              bg-white border-r border-gray-200
              flex flex-col
              shadow-2xl
              lg:hidden
            "
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 h-[7vh] border-b border-gray-100 flex-shrink-0">
              <span className="text-sm font-semibold text-gray-800">Planning Steps</span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            {/* Drawer body */}
            <div className="flex-1 overflow-hidden">
              <SidebarContent />
            </div>
          </aside>
        </>
      )}

      {/* ══ RIGHT PANEL ════════════════════════════════════════════════════ */}
      {/*
        flex-col, takes remaining width (78vw on desktop, 100vw on mobile).
        Internally split into: header | scrollable body | footer.
        Nothing is fixed or sticky — the column itself is 100vh and each
        section either flex-shrinks or flex-1-grows to fill it perfectly.
      */}
      <div
        className="
          flex flex-col
          flex-1
          w-full lg:w-[78vw]
          h-[100vh]
          overflow-hidden
        "
      >

        {/* ── HEADER — glassmorphism, natural flow, flex-shrink-0 ────────── */}
        <header
          className="
            flex-shrink-0
            flex items-center gap-3
            px-4 sm:px-8
            h-[8vh] min-h-[56px]
            border-b border-white/30
            backdrop-blur-md
            bg-white/70
            z-10
          "
          style={{
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 1px 0 0 rgba(0,0,0,0.06), 0 4px 16px 0 rgba(99,102,241,0.04)',
          }}
        >
          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle step list"
            onClick={() => setMobileSidebarOpen((v) => !v)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white/80 flex-shrink-0 transition-colors"
          >
            <Menu size={16} />
          </button>

          {/* Step meta text */}
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

        {/* ── SCROLLABLE FORM BODY — flex-1 so it fills space between header and footer ── */}
        <main
          className="
            flex-1
            overflow-y-auto
            bg-gray-50
          "
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-8">

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

            {/* Validation error summary */}
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

            {/* Step form */}
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

        {/* ── FOOTER — flex-shrink-0, always pinned at bottom of right panel ── */}
        <footer
          className="
            flex-shrink-0
            flex items-center justify-between gap-3
            flex-wrap
            px-4 sm:px-8
            h-[8vh] min-h-[56px]
            bg-white
            border-t border-gray-200
          "
        >
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
        </footer>

      </div>
      {/* ── end right panel ── */}

    </div>
  );
}

// ─── Development placeholder ──────────────────────────────────────────────────

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
        and pass it as the{' '}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">StepForm</code> prop.
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
