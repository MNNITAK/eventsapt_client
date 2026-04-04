import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Event draft structure (JS version).
 * You can extend this freely based on your form fields.
 */

const STORAGE_KEY = 'event-create-drafts-v1';

function isBrowser() {
  return typeof window !== 'undefined';
}

function sanitizeUid(uid) {
  const value = (uid || '').trim();
  if (!value) {
    throw new Error('Event uid must be a non-empty string.');
  }
  return value;
}

export const useEventDraftStore = create(
  persist(
    (set, get) => ({
      draftsByUid: {},
      hydrated: false,

      /** Merge partial fields */
      upsertDraft: (uid, patch) => {
        const safeUid = sanitizeUid(uid);

        set((state) => ({
          draftsByUid: {
            ...state.draftsByUid,
            [safeUid]: {
              ...(state.draftsByUid[safeUid] || {}),
              ...patch,
            },
          },
        }));
      },

      /** Replace entire draft */
      setDraft: (uid, draft) => {
        const safeUid = sanitizeUid(uid);

        set((state) => ({
          draftsByUid: {
            ...state.draftsByUid,
            [safeUid]: draft,
          },
        }));
      },

      /** Get draft */
      getDraft: (uid) => {
        const safeUid = sanitizeUid(uid);
        return get().draftsByUid[safeUid];
      },

      /** Remove one draft */
      removeDraft: (uid) => {
        const safeUid = sanitizeUid(uid);

        set((state) => {
          if (!(safeUid in state.draftsByUid)) return state;

          const next = { ...state.draftsByUid };
          delete next[safeUid];
          return { draftsByUid: next };
        });
      },

      /** Clear all drafts */
      clearAllDrafts: () => set({ draftsByUid: {} }),

      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (!isBrowser()) {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({ draftsByUid: state.draftsByUid }),
      version: 1,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate event drafts store:', error);
        }
        state && state.setHydrated(true);
      },
    }
  )
);

/**
 * Simple debounce utility (per key)
 */
const debounceMap = new Map();

function debounceByKey(key, fn, delay = 400) {
  if (debounceMap.has(key)) {
    clearTimeout(debounceMap.get(key));
  }
  const t = setTimeout(() => {
    fn();
    debounceMap.delete(key);
  }, delay);
  debounceMap.set(key, t);
}

/**
 * Main hook per uid
 */
export function useEventDraft(uid) {
  const safeUid = uid ? sanitizeUid(uid) : undefined;

  const hydrated = useEventDraftStore((s) => s.hydrated);
  const draft = useEventDraftStore((s) =>
    safeUid ? s.draftsByUid[safeUid] : undefined
  );

  const upsertDraftBase = useEventDraftStore((s) => s.upsertDraft);
  const setDraftBase = useEventDraftStore((s) => s.setDraft);
  const removeDraftBase = useEventDraftStore((s) => s.removeDraft);
  const clearAllDrafts = useEventDraftStore((s) => s.clearAllDrafts);

  return {
    hydrated,
    draft,

    /**
     * Instant update (no debounce)
     */
    upsertDraft: (patch) => {
      if (!safeUid) throw new Error('uid is required');
      upsertDraftBase(safeUid, patch);
    },

    /**
     * Debounced update (recommended for inputs)
     * Default delay = 400ms (can override)
     */
    upsertDraftDebounced: (patch, delay = 400) => {
      if (!safeUid) throw new Error('uid is required');

      const key = `draft-${safeUid}`;

      debounceByKey(key, () => {
        upsertDraftBase(safeUid, patch);
      }, delay);
    },

    setDraft: (nextDraft) => {
      if (!safeUid) throw new Error('uid is required');
      setDraftBase(safeUid, nextDraft);
    },

    removeDraft: () => {
      if (!safeUid) throw new Error('uid is required');
      removeDraftBase(safeUid);
    },

    clearAllDrafts,
  };
}

/**
 * Optional helper to merge draft into form state
 */
export function mergeDraftIntoFormState(formState, draft) {
  if (!draft) return formState;
  return {
    ...formState,
    ...draft,
  };
}
