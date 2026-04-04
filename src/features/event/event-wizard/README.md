# Event Creation Wizard — Production Integration Guide

## Install dependencies

```bash
npm install zustand zod
```

---

## File map

```
src/
├── hooks/
│   └── useEventDraftStore.js          ← Zustand draft store (your file, unchanged)
│
├── config/
│   ├── eventSteps.js                  ← Step config for 8 event types + helper fns
│   └── eventSchemas.js                ← Zod schemas for every step
│
├── components/
│   ├── stepIconMap.js                 ← Maps icon name strings → lucide-react components
│   ├── EventStepsList.jsx             ← Step 0 overview screen (client)
│   ├── WizardShell.jsx                ← Step wrapper: sidebar + form panel + footer (client)
│   └── steps/
│       ├── BasicInfoStep.jsx          ← Reference step form (copy this pattern)
│       ├── DateTimeStep.jsx           ← (build next)
│       ├── VenueStep.jsx              ← (build next)
│       └── ...                        ← one file per step id
│
└── app/
    └── event-wizard/
        └── [eventType]/
            ├── steps/
            │   └── page.jsx           ← /event-wizard/:type/steps?node=:uid
            └── [stepId]/
                └── page.jsx           ← /event-wizard/:type/:stepId?node=:uid
```

---

## URL structure

| Screen | URL |
|---|---|
| Landing page (set title + type) | `/create-event` |
| Step overview | `/event-wizard/wedding/steps?node=abc123` |
| Any step | `/event-wizard/wedding/basic-info?node=abc123` |
| Next step | `/event-wizard/wedding/wedding-details?node=abc123` |

The `node` query param is the event UID — created on the landing page and passed forward through every URL.

---

## Supported event types

| Key | Label | Steps |
|---|---|---|
| `wedding` | Wedding | 16 |
| `birthday` | Birthday Party | 14 |
| `corporate` | Corporate Event | 15 |
| `concert` | Concert / Show | 12 |
| `party` | Social Party | 12 |
| `engagement` | Engagement / Roka | 11 |
| `babyShower` | Baby Shower | 12 |
| `puja` | Puja / Religious Ceremony | 11 |

---

## How draft persistence works

### Store (`useEventDraftStore.js`)

Your Zustand store persists all drafts under one key:

```js
localStorage['event-create-drafts-v1'] = {
  draftsByUid: {
    "abc123": {
      eventName: "Priya & Arjun's Wedding",
      theme: "Royal Rajasthani",
      _completedSteps: ["basic-info", "wedding-details"],
      // ... all other fields flat in the same object
    }
  }
}
```

The `_completedSteps` array is stored inside the draft itself — no separate state needed.

### In WizardShell

```
text input → onChange(field, value)
  → upsertDraftDebounced({ [field]: value }, 400ms)    ← debounced for typing
  → Zustand store updates
  → localStorage synced automatically by Zustand persist

select/checkbox → onChangeImmediate(field, value)
  → upsertDraft({ [field]: value })                    ← instant, no delay
```

### On Continue

```
handleContinue()
  → validateStep(stepId, { field1: draft.field1, ... })  ← Zod per-step
  → if errors → setFieldErrors → show inline + banner
  → if valid  → upsertDraft({ _completedSteps: [..., currentStepId] })
               → router.push next step URL
```

---

## Building a step form

Every step form receives exactly these four props:

```js
function MyStep({ draft, errors, onChange, onChangeImmediate }) { ... }
```

| Prop | Type | Use for |
|---|---|---|
| `draft` | `object` | Read current saved values (`draft.fieldName ?? ''`) |
| `errors` | `object` | Show inline errors (`errors.fieldName`) |
| `onChange` | `fn(field, value)` | Text inputs, textareas — debounced 400ms |
| `onChangeImmediate` | `fn(field, value)` | Select, checkbox, radio — instant |

### Step form template

```jsx
'use client';

export default function MyStep({ draft, errors, onChange, onChangeImmediate }) {
  return (
    <div className="flex flex-col gap-5">

      {/* Text field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Field Label <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          defaultValue={draft?.myField ?? ''}
          onChange={(e) => onChange('myField', e.target.value)}
          className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-colors
            ${errors?.myField
              ? 'border-red-400 focus:ring-red-100'
              : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
        />
        {errors?.myField && (
          <p className="text-xs text-red-600 font-medium">{errors.myField}</p>
        )}
      </div>

      {/* Select (instant) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Category
        </label>
        <select
          value={draft?.category ?? ''}
          onChange={(e) => onChangeImmediate('category', e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
        >
          <option value="">Select…</option>
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </select>
      </div>

      {/* Checkbox (instant) */}
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={draft?.myBool ?? false}
          onChange={(e) => onChangeImmediate('myBool', e.target.checked)}
          className="w-4 h-4 accent-indigo-600"
        />
        Enable this option
      </label>

    </div>
  );
}
```

### Register the form in the step page

In `app/event-wizard/[eventType]/[stepId]/page.jsx`, uncomment and add:

```js
import BasicInfoStep from '@/components/steps/BasicInfoStep';

const STEP_FORMS = {
  'basic-info': BasicInfoStep,
  // add more as you build them
};
```

Until a step form is registered, WizardShell shows a field-list placeholder that turns green for each field already saved in the draft.

---

## Validation

Each step has a Zod schema in `config/eventSchemas.js`.

`validateStep(stepId, fieldData)` returns:

```js
// Success
{ success: true }

// Failure
{ success: false, errors: { fieldName: "Error message" } }
```

Validation only runs on **Continue** — users are never blocked while typing. Completed steps stay green even if they're revisited and left unchanged.

---

## Adding a new event type

1. Add to `EVENT_STEPS` in `config/eventSteps.js`:

```js
anniversary: {
  label: "Anniversary",
  icon: "Heart",
  color: "#db2777",
  description: "...",
  estimatedTime: "8–12 min",
  steps: [
    SHARED_STEPS.basicInfo,
    // add custom steps...
    SHARED_STEPS.review,
  ],
},
```

2. Add Zod schemas for any new step ids in `config/eventSchemas.js`.
3. Build form components in `components/steps/`.
4. Register them in the step page's `STEP_FORMS` map.

No routing changes needed — the dynamic `[eventType]` and `[stepId]` segments handle it automatically.

---

## After successful submission

```js
// In your submit handler / server action result callback:
const { removeDraft } = useEventDraft(eventUID);

await submitEvent(draft);
removeDraft(); // cleans up localStorage
router.push(`/events/${newEventId}`);
```

---

## Responsive behaviour

| Breakpoint | Sidebar | Layout |
|---|---|---|
| `< lg` (mobile/tablet) | Drawer overlay (hamburger toggle) | Full-width step form |
| `≥ lg` (desktop) | Sticky left panel, 224px | Two-column: sidebar + form |

The sticky footer nav (`Save Draft · Back · [Skip] · Continue`) is always visible on all screen sizes.
