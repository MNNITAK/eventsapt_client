# Event Creation Wizard — Integration Guide

## File Structure

```
EventCreationWizard/
├── components/
│   ├── EventCreationWizard.jsx        ← Main wizard component
│   └── EventCreationWizard.module.css ← All styles
├── hooks/
│   └── useEventDraft.js               ← Reusable draft management hook
└── app/events/create/
    └── page.jsx                       ← Next.js page (App Router)
```

---

## Setup

### 1. Copy files into your project

```
src/
  components/
    EventCreationWizard.jsx
    EventCreationWizard.module.css
  hooks/
    useEventDraft.js
  app/events/create/page.jsx
```

### 2. Required: lucide-react

Already installed if you're using it. If not:
```bash
npm install lucide-react
```

### 3. No other dependencies needed
Pure React + Next.js. No external form library, no date picker library, no drag-and-drop.

---

## Features

### Multi-step wizard (7 steps)
| Step | What it collects |
|------|-----------------|
| 1. Event Type | Type selector (Wedding, Birthday, Corporate, Concert, Party) |
| 2. Basic Info | Event name, theme, description, special requirements |
| 3. Date & Venue | Primary date, alternate date, start/end time, full venue address |
| 4. Guests | Total guests, adult/child/VIP breakdown with mismatch warning |
| 5. Budget | Total budget, 8-category breakdown, auto-distribute, progress bar |
| 6. Vendors | Multi-select vendor categories (8 types), vendor notes |
| 7. Review | Full summary before submission |

### Draft / Autosave (localStorage)
- **Autosave** triggers on every data or step change (debounced)
- **Draft banner** appears on next visit if a draft exists
- **Resume** loads exact step and data from the draft
- **Save as Draft** button in footer forces an immediate save
- **"Saved" indicator** appears briefly in the header after each save
- Draft is cleared after successful submission

### Validation
- Per-step validation before advancing (no spammy full-form validation)
- Friendly error banner appears at the top of the step
- Fields: eventType (step 1), eventName (step 2), eventDate (step 3), totalGuests (step 4), totalBudget (step 5)

### Stepper navigation
- Completed steps show a green checkmark
- Clicking a completed or current step jumps directly to it
- Keyboard accessible (Enter key)

### Budget planner
- Progress bar tracks allocated vs. total
- "Over budget" shown in red, remaining shown in green
- Auto-distribute button fills all 8 categories using industry-standard % splits

---

## Extending for more event types

The wizard uses a single unified UI across all event types. This is the optimal approach because:
- 80% of fields (date, guests, budget, vendors) are **identical** across event types
- Event-type-specific fields are easy to add conditionally using `data.eventType === "wedding"` checks
- No code duplication, no separate routes to maintain

### Adding wedding-specific fields
In `StepBasics` or `StepDateTime`, add conditionally:
```jsx
{data.eventType === "wedding" && (
  <div className={styles.formGroup}>
    <label className={styles.label}>Ceremony Type</label>
    <select className={styles.input} value={data.ceremonyType} onChange={...}>
      <option value="hindu">Hindu</option>
      <option value="christian">Christian</option>
      <option value="civil">Civil / Court</option>
    </select>
  </div>
)}
```

### Adding a new event type
In `EventCreationWizard.jsx`, add to `EVENT_TYPES`:
```js
{ id: "anniversary", label: "Anniversary", icon: Heart, color: "#db2777" },
```

---

## Using the `useEventDraft` hook separately

If you want to decouple state from the UI:

```jsx
import { useEventDraft } from "@/hooks/useEventDraft";

const INITIAL = { eventType: "", eventName: "", ... };

function MyForm() {
  const {
    formData,
    currentStep,
    updateField,
    pendingDraft,
    resumeDraft,
    dismissDraft,
    autoSaveStatus,
    saveDraftNow,
  } = useEventDraft(INITIAL, { draftKey: "my_event_draft" });

  return ( ... );
}
```

---

## Planned improvements (suggested next steps)

- [ ] **Vendor availability calendar** — date range picker that checks vendor blocked dates via API
- [ ] **Invite co-organizers** — share event planning with a partner or family member
- [ ] **Budget vs. actual tracking** — after vendors respond with quotes, compare vs. planned
- [ ] **Checklist / timeline** — auto-generated task checklist based on event type and date
- [ ] **File attachments** — mood boards, vendor contracts, invitations
- [ ] **SMS / email reminders** — for pending vendor responses
- [ ] **Backend sync** — replace localStorage with API calls for multi-device access

---

## Notes

- All styles use CSS Modules — no Tailwind dependency
- Fully responsive down to 375px
- Keyboard accessible (tab, enter navigation)
- No `form` HTML elements used — all `div` + `button` to avoid unintentional submission
