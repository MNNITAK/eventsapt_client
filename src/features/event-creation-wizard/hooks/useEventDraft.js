// hooks/useEventDraft.js
// Standalone hook — reusable across any event-type form

import { useState, useEffect, useCallback, useRef } from "react";

const DEFAULT_OPTIONS = {
  draftKey: "event_creation_draft",
  autosaveDelay: 800, // ms debounce
};

/**
 * useEventDraft
 *
 * Manages multi-step form state with:
 *  - localStorage draft persistence
 *  - debounced autosave
 *  - draft resume / dismiss
 *  - per-step completion tracking
 *
 * @param {object} initialState   - shape of the form data
 * @param {object} options        - { draftKey, autosaveDelay }
 */
export function useEventDraft(initialState, options = {}) {
  const { draftKey, autosaveDelay } = { ...DEFAULT_OPTIONS, ...options };

  const [formData, setFormData] = useState(initialState);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [pendingDraft, setPendingDraft] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState("idle"); // idle | saving | saved
  const autosaveTimer = useRef(null);

  // ── Load existing draft on mount ──────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft?.data?.eventType || draft?.data?.eventName) {
        setPendingDraft(draft);
      }
    } catch { /* ignore */ }
  }, [draftKey]);

  // ── Debounced autosave ────────────────────────────────────────────────────
  useEffect(() => {
    if (!formData.eventType && !formData.eventName) return;

    clearTimeout(autosaveTimer.current);
    setAutoSaveStatus("saving");

    autosaveTimer.current = setTimeout(() => {
      try {
        const draft = {
          data: formData,
          currentStep,
          completedSteps,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(draftKey, JSON.stringify(draft));
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      } catch {
        setAutoSaveStatus("idle");
      }
    }, autosaveDelay);

    return () => clearTimeout(autosaveTimer.current);
  }, [formData, currentStep, draftKey, autosaveDelay, completedSteps]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateNestedField = useCallback((parentField, childField, value) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value,
      },
    }));
  }, []);

  const goToStep = useCallback((stepIdx) => {
    setCurrentStep(stepIdx);
  }, []);

  const markStepComplete = useCallback((stepIdx) => {
    setCompletedSteps((prev) =>
      prev.includes(stepIdx) ? prev : [...prev, stepIdx]
    );
  }, []);

  const resumeDraft = useCallback(() => {
    if (!pendingDraft) return;
    setFormData({ ...initialState, ...pendingDraft.data });
    setCurrentStep(pendingDraft.currentStep ?? 0);
    setCompletedSteps(pendingDraft.completedSteps ?? []);
    setPendingDraft(null);
  }, [pendingDraft, initialState]);

  const dismissDraft = useCallback(() => {
    setPendingDraft(null);
  }, []);

  const clearDraft = useCallback(() => {
    try { localStorage.removeItem(draftKey); } catch { /* ignore */ }
    setFormData(initialState);
    setCurrentStep(0);
    setCompletedSteps([]);
    setPendingDraft(null);
  }, [draftKey, initialState]);

  const saveDraftNow = useCallback(() => {
    try {
      const draft = {
        data: formData,
        currentStep,
        completedSteps,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draft));
      setAutoSaveStatus("saved");
      setTimeout(() => setAutoSaveStatus("idle"), 2000);
    } catch { /* ignore */ }
  }, [formData, currentStep, completedSteps, draftKey]);

  return {
    // State
    formData,
    currentStep,
    completedSteps,
    pendingDraft,
    autoSaveStatus,

    // Actions
    updateField,
    updateNestedField,
    goToStep,
    markStepComplete,
    resumeDraft,
    dismissDraft,
    clearDraft,
    saveDraftNow,
    setFormData,
  };
}
