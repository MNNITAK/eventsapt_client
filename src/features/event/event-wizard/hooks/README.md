# Event Draft Store for Next.js + Zustand

A simple, production-friendly draft persistence setup for multi-step event creation flows.

This store saves event form progress in `localStorage` using the event `uid` as the key inside a shared draft object.

---

## What this solves

When a user is creating an event step by step, they may fill fields like:

* title
* description
* date and time
* venue details
* ticket data
* SEO metadata
* images and tags

If they refresh the page or come back later, the same draft can be restored using the same `uid`.

---

## How the data is stored

The store keeps everything under one persisted object:

```js
{
  draftsByUid: {
    "event-123": {
      title: "My Wedding Event",
      description: "...",
      venueName: "Grand Hall"
    },
    "event-456": {
      title: "Conference 2026"
    }
  }
}
```

So:

* each event gets its own entry
* the `uid` is the unique identifier
* drafts survive refresh because Zustand persists them to `localStorage`

---

## File to use

Use the hook file as a client-side store, for example:

```bash
/store/useEventDraftStore.js
```

---

## Installation

If Zustand is not installed yet:

```bash
npm install zustand
```

---

## Important Next.js note

Because `localStorage` only exists in the browser, this store must be used from a **Client Component**.

At the top of your component file:

```js
'use client';
```

Without that, Next.js may try to render the component on the server first, which can cause issues when browser storage is accessed.

---

## Main API

The store exposes a custom hook:

```js
const {
  hydrated,
  draft,
  upsertDraft,
  upsertDraftDebounced,
  setDraft,
  removeDraft,
  clearAllDrafts,
} = useEventDraft(uid);
```

---

## What each field does

### `draft`

Returns the saved draft object for the given `uid`.

### `hydrated`

Becomes `true` after Zustand has loaded data from `localStorage`.
Use this to avoid showing empty form values before the store is ready.

### `upsertDraft(patch)`

Immediately merges new fields into the saved draft.

Use this for:

* step changes
* save buttons
* important events where you want instant persistence

### `upsertDraftDebounced(patch, delay = 400)`

Waits a short time before saving.

Use this for:

* text inputs
* textarea changes
* sliders
* frequent typing

This avoids too many storage writes while the user types.

### `setDraft(fullDraft)`

Replaces the entire draft object for that UID.

### `removeDraft()`

Deletes one draft from storage.

### `clearAllDrafts()`

Deletes all saved drafts.

---

## Basic usage example

```js
'use client';

import { useEffect, useState } from 'react';
import { useEventDraft } from '@/store/useEventDraftStore';

export default function EventStepOne({ uid }) {
  const {
    draft,
    hydrated,
    upsertDraftDebounced,
  } = useEventDraft(uid);

  const [title, setTitle] = useState('');

  useEffect(() => {
    if (draft?.title) {
      setTitle(draft.title);
    }
  }, [draft]);

  if (!hydrated) {
    return null;
  }

  return (
    <div>
      <input
        value={title}
        onChange={(e) => {
          const value = e.target.value;
          setTitle(value);
          upsertDraftDebounced({ title: value });
        }}
        placeholder="Event title"
      />
    </div>
  );
}
```

---

## Saving multiple fields

You can update any subset of fields at any time.

```js
upsertDraftDebounced({
  title: 'My Event',
  description: 'A great event',
  category: 'Wedding'
});
```

Or save instantly:

```js
upsertDraft({
  title: 'My Event'
});
```

---

## Loading data back into the form

A common pattern is:

1. get the saved `draft`
2. prefill your local component state with it
3. let the user continue editing

Example:

```js
useEffect(() => {
  if (draft) {
    setFormValues((prev) => ({
      ...prev,
      ...draft,
    }));
  }
}, [draft]);
```

If you are using a form library, map the draft values into `defaultValues` or call your form reset method.

---

## When to use debounced updates

Debounced updates are recommended for fields that change often.

Use them for:

* text inputs
* large textareas
* live search-like fields
* repeated typing

Use instant updates for:

* final save buttons
* moving to the next step
* explicit user actions
* submit/review screen

---

## Example flow for a step-based form

A typical flow may look like this:

### Step 1

User enters basic details.

```js
upsertDraftDebounced({
  title,
  description,
});
```

### Step 2

User adds date and venue.

```js
upsertDraft({
  startDate,
  endDate,
  venueName,
});
```

### Step 3

User adds pricing and media.

```js
upsertDraft({
  ticketPrice,
  coverImageUrl,
  galleryImageUrls,
});
```

### Final submit

Send the entire draft to the backend.

```js
const { draft } = useEventDraft(uid);

await fetch('/api/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(draft),
});
```

---

## Recommended behavior in production

Keep these habits in place:

* always use a stable `uid`
* use `upsertDraftDebounced` for fast typing fields
* use `upsertDraft` for important step transitions
* guard UI rendering with `hydrated`
* clean up old drafts after successful submit with `removeDraft()`

---

## Example cleanup after successful submission

```js
await submitEvent(draft);
removeDraft();
```

That prevents old draft data from showing up again after the event is already created.

---

## Notes for teammates

* This store is meant for **temporary draft persistence**, not permanent database storage.
* The final source of truth should still be your backend after submission.
* The local draft helps users recover from refreshes, accidental navigation, or temporary browser closure.

---

## Summary

This setup gives you:

* UID-based draft storage
* refresh-safe persistence
* debounced auto-save
* easy restore on revisit
* simple integration with Next.js and Zustand

It is a strong fit for multi-step event creation workflows where users should never lose progress.
