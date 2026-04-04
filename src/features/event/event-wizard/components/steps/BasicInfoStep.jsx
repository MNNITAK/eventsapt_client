'use client';

/**
 * components/steps/BasicInfoStep.jsx
 *
 * The "Basic Information" step — shared across all event types.
 * Step id: "basic-info"
 *
 * This is the reference implementation showing exactly how to build
 * any step form. All step forms receive the same four props:
 *
 *   draft              {object}   — current saved draft from Zustand
 *   errors             {object}   — { fieldName: errorMessage } from Zod
 *   onChange           {fn}       — debounced (use for text inputs / textareas)
 *   onChangeImmediate  {fn}       — instant (use for select / checkbox / radio)
 *
 * The component owns ZERO state — it reads from draft and writes via
 * onChange / onChangeImmediate. WizardShell handles all persistence.
 *
 * Field→draft flow:
 *   user types → onChange(field, value)
 *     → upsertDraftDebounced({ [field]: value })  [400ms]
 *       → Zustand store → localStorage
 *
 * On mount, values are pre-filled from draft automatically because
 * we use draft[field] ?? '' as the input value (controlled inputs).
 */

import {
  FileText,
  Palette,
  AlignLeft,
  StickyNote,
  Info,
} from 'lucide-react';

// ─── Shared Tailwind class strings ───────────────────────────────────────────

const inputCls =
  'w-full px-3 py-2.5 text-sm text-gray-900 bg-white border rounded-xl ' +
  'focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors ' +
  'placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500';

const errorInputCls =
  'border-red-400 focus:border-red-400 focus:ring-red-100';

const normalInputCls =
  'border-gray-200 focus:border-indigo-500';

const textareaCls =
  'w-full px-3 py-2.5 text-sm text-gray-900 bg-white border rounded-xl ' +
  'focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors ' +
  'resize-y leading-relaxed placeholder:text-gray-400';

const labelCls = 'text-xs font-semibold text-gray-700 uppercase tracking-wide';

// ─── FieldWrapper ─────────────────────────────────────────────────────────────

function FieldWrapper({ label, hint, error, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className={labelCls}>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-gray-400 leading-snug">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}

// ─── BasicInfoStep ────────────────────────────────────────────────────────────

export default function BasicInfoStep({ draft, errors, onChange, onChangeImmediate }) {
  const eventType = draft?.eventType ?? 'wedding';

  const placeholderName =
    eventType === 'wedding'   ? "e.g. Priya & Arjun's Wedding"     :
    eventType === 'birthday'  ? "e.g. Rohan's 30th Birthday Bash"  :
    eventType === 'corporate' ? "e.g. TechCorp Annual Day 2026"    :
    eventType === 'concert'   ? "e.g. Indie Night — Mumbai Live"   :
    'Give your event a name';

  const placeholderTheme =
    eventType === 'wedding'   ? 'e.g. Royal Rajasthani, Garden, Minimalist' :
    eventType === 'birthday'  ? 'e.g. Retro 90s, Bollywood, Space'          :
    eventType === 'corporate' ? 'e.g. Modern minimal, Futuristic tech'      :
    'e.g. Bohemian, Black-tie, Tropical';

  return (
    <div className="flex flex-col gap-5">

      {/* Event Name */}
      <FieldWrapper
        label="Event Name"
        required
        error={errors?.eventName}
        hint="This name will be visible to vendors you invite."
      >
        <div className="relative">
          <FileText
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            maxLength={80}
            placeholder={placeholderName}
            defaultValue={draft?.eventName ?? ''}
            onChange={(e) => onChange('eventName', e.target.value)}
            className={[
              inputCls,
              'pl-9',
              errors?.eventName ? errorInputCls : normalInputCls,
            ].join(' ')}
          />
        </div>
      </FieldWrapper>

      {/* Theme / Style */}
      <FieldWrapper
        label="Theme / Style"
        error={errors?.theme}
        hint="Optional — helps vendors match your aesthetic."
      >
        <div className="relative">
          <Palette
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            maxLength={80}
            placeholder={placeholderTheme}
            defaultValue={draft?.theme ?? ''}
            onChange={(e) => onChange('theme', e.target.value)}
            className={[
              inputCls,
              'pl-9',
              errors?.theme ? errorInputCls : normalInputCls,
            ].join(' ')}
          />
        </div>
      </FieldWrapper>

      {/* Description */}
      <FieldWrapper
        label="Description"
        error={errors?.description}
        hint="Tell vendors what makes this event special. Max 500 characters."
      >
        <div className="relative">
          <AlignLeft
            size={15}
            className="absolute left-3 top-3 text-gray-400 pointer-events-none"
          />
          <textarea
            rows={4}
            maxLength={500}
            placeholder="Share the story of your event — your vision, style, mood, and anything you want vendors to know…"
            defaultValue={draft?.description ?? ''}
            onChange={(e) => onChange('description', e.target.value)}
            className={[
              textareaCls,
              'pl-9',
              errors?.description ? errorInputCls : normalInputCls,
            ].join(' ')}
          />
        </div>
        <div className="flex justify-end">
          <span className="text-xs text-gray-400">
            {(draft?.description ?? '').length} / 500
          </span>
        </div>
      </FieldWrapper>

      {/* Special Requirements */}
      <FieldWrapper
        label="Special Requirements"
        error={errors?.specialRequirements}
        hint="Dietary restrictions, accessibility needs, language preferences, cultural customs…"
      >
        <div className="relative">
          <StickyNote
            size={15}
            className="absolute left-3 top-3 text-gray-400 pointer-events-none"
          />
          <textarea
            rows={3}
            maxLength={300}
            placeholder="e.g. Jain-friendly menu required · Wheelchair accessible venue · No alcohol"
            defaultValue={draft?.specialRequirements ?? ''}
            onChange={(e) => onChange('specialRequirements', e.target.value)}
            className={[
              textareaCls,
              'pl-9',
              errors?.specialRequirements ? errorInputCls : normalInputCls,
            ].join(' ')}
          />
        </div>
      </FieldWrapper>

      {/* Info callout for wedding */}
      {eventType === 'wedding' && (
        <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-800 text-sm leading-snug">
          <Info size={14} className="flex-shrink-0 mt-0.5" />
          <span>
            You&apos;ll add the couple&apos;s names, ceremony type, and pre-wedding events
            (mehendi, sangeet, haldi) in the next step.
          </span>
        </div>
      )}
    </div>
  );
}
