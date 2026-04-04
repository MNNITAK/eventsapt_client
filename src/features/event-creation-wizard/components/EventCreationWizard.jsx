"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Save,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Briefcase,
  FileText,
  Star,
  AlertCircle,
  X,
  Heart,
  PartyPopper,
  Building2,
  Music,
  Camera,
  Utensils,
  Flower2,
  Car,
  Sparkles,
  Info,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const DRAFT_KEY = "event_creation_draft";

const EVENT_TYPES = [
  { id: "wedding",   label: "Wedding",   icon: Heart,       color: "#e11d48" },
  { id: "birthday",  label: "Birthday",  icon: PartyPopper, color: "#7c3aed" },
  { id: "corporate", label: "Corporate", icon: Building2,   color: "#0369a1" },
  { id: "concert",   label: "Concert",   icon: Music,       color: "#b45309" },
  { id: "party",     label: "Party",     icon: Sparkles,    color: "#0d9488" },
];

const VENDOR_CATEGORIES = [
  { id: "photographer", label: "Photographer",  icon: Camera    },
  { id: "catering",     label: "Catering",      icon: Utensils  },
  { id: "decorator",    label: "Decorator",     icon: Flower2   },
  { id: "music",        label: "DJ / Band",     icon: Music     },
  { id: "transport",    label: "Transport",     icon: Car       },
  { id: "venue",        label: "Venue",         icon: Building2 },
  { id: "makeup",       label: "Makeup Artist", icon: Sparkles  },
  { id: "other",        label: "Other",         icon: Star      },
];

const BUDGET_CATEGORIES = [
  { id: "venue",         label: "Venue",                 defaultPct: 30 },
  { id: "catering",      label: "Catering & Food",       defaultPct: 25 },
  { id: "photography",   label: "Photography / Video",   defaultPct: 12 },
  { id: "decor",         label: "Decor & Flowers",       defaultPct: 10 },
  { id: "music",         label: "Music & Entertainment", defaultPct: 8  },
  { id: "attire",        label: "Attire & Grooming",     defaultPct: 7  },
  { id: "transport",     label: "Transport",             defaultPct: 4  },
  { id: "miscellaneous", label: "Miscellaneous",         defaultPct: 4  },
];

const STEPS = [
  { id: "event-type", label: "Event Type",      icon: Star,       shortLabel: "Type"    },
  { id: "basics",     label: "Basic Info",      icon: FileText,   shortLabel: "Basics"  },
  { id: "datetime",   label: "Date & Venue",    icon: Calendar,   shortLabel: "Date"    },
  { id: "guests",     label: "Guest List",      icon: Users,      shortLabel: "Guests"  },
  { id: "budget",     label: "Budget Planner",  icon: DollarSign, shortLabel: "Budget"  },
  { id: "vendors",    label: "Vendors",         icon: Briefcase,  shortLabel: "Vendors" },
  { id: "review",     label: "Review & Submit", icon: Check,      shortLabel: "Review"  },
];

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_STATE = {
  eventType: "",
  eventName: "",
  description: "",
  theme: "",
  specialRequirements: "",
  eventDate: "",
  alternateDate: "",
  startTime: "",
  endTime: "",
  venueName: "",
  venueAddress: "",
  venueCity: "",
  venueState: "",
  isVenueConfirmed: false,
  totalGuests: "",
  adultCount: "",
  childCount: "",
  vipCount: "",
  guestListNotes: "",
  totalBudget: "",
  budgetBreakdown: BUDGET_CATEGORIES.reduce((acc, c) => {
    acc[c.id] = { allocated: "", notes: "" };
    return acc;
  }, {}),
  selectedVendors: [],
  vendorNotes: "",
};

// ─── Utility ─────────────────────────────────────────────────────────────────

function saveDraft(data, currentStep) {
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ data, currentStep, savedAt: new Date().toISOString() })
    );
  } catch {}
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

// ─── Shared class strings ─────────────────────────────────────────────────────

const inputCls =
  "w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg " +
  "focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors placeholder:text-gray-400";

const textareaCls =
  "w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg " +
  "focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors resize-y leading-relaxed placeholder:text-gray-400";

const labelCls = "text-xs font-semibold text-gray-700 uppercase tracking-wide";

// ─── StepperHeader ────────────────────────────────────────────────────────────

function StepperHeader({ currentStep, onStepClick, completedSteps }) {
  return (
    <div className="flex items-center overflow-x-auto pb-0" style={{ scrollbarWidth: "none" }}>
      {STEPS.map((step, idx) => {
        const isActive    = idx === currentStep;
        const isCompleted = completedSteps.includes(idx);
        const isClickable = isCompleted || idx <= currentStep;
        const StepIcon    = step.icon;

        return (
          <div
            key={step.id}
            className={`flex items-center gap-1.5 flex-shrink-0 py-3 transition-opacity
              ${isClickable ? "opacity-100 cursor-pointer" : "opacity-35 cursor-default"}`}
            onClick={() => isClickable && onStepClick(idx)}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={(e) => e.key === "Enter" && isClickable && onStepClick(idx)}
            aria-label={`Step ${idx + 1}: ${step.label}`}
          >
            {/* Step circle */}
            <div
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${isCompleted
                  ? "border-green-500 bg-green-500 text-white"
                  : isActive
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-gray-300 bg-white text-gray-400"}`}
            >
              {isCompleted ? <Check size={13} /> : <StepIcon size={13} />}
            </div>

            {/* Label — visible sm and above */}
            <span
              className={`text-xs font-medium whitespace-nowrap hidden sm:block
                ${isCompleted ? "text-green-600" : isActive ? "text-indigo-600" : "text-gray-500"}`}
            >
              {step.shortLabel}
            </span>

            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-shrink-0 mx-1 rounded-full w-4 sm:w-5 transition-colors
                  ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── DraftBanner ─────────────────────────────────────────────────────────────

function DraftBanner({ draft, onResume, onDismiss }) {
  if (!draft) return null;
  const savedAt = new Date(draft.savedAt).toLocaleString("en-IN");
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-7 py-3 bg-yellow-50 border-b border-yellow-200"
      role="alert"
    >
      <div className="flex items-center gap-2 text-yellow-800 text-sm">
        <Save size={15} className="flex-shrink-0" />
        <span>
          Draft saved on <strong>{savedAt}</strong> — resume from where you left off.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onResume}
          className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Resume Draft
        </button>
        <button
          onClick={onDismiss}
          className="w-7 h-7 flex items-center justify-center border border-yellow-400 text-yellow-600 rounded-md hover:bg-yellow-100 transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 1 — Event Type ──────────────────────────────────────────────────────

function StepEventType({ data, onChange }) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
        What kind of event are you planning?
      </h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Choose an event type to get a tailored planning experience. You can change this later.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
        {EVENT_TYPES.map((type) => {
          const Icon       = type.icon;
          const isSelected = data.eventType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange("eventType", type.id)}
              className={`relative flex flex-col items-center justify-center gap-2 py-4 sm:py-5 px-2 border-2 rounded-xl transition-all
                ${isSelected
                  ? "border-indigo-500 bg-indigo-50 -translate-y-0.5 shadow-sm"
                  : "border-gray-200 bg-white hover:border-indigo-200 hover:bg-violet-50 hover:-translate-y-0.5"}`}
            >
              <div style={{ color: isSelected ? type.color : "#9ca3af" }}>
                <Icon size={24} />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center leading-tight">
                {type.label}
              </span>
              {isSelected && (
                <div
                  className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: type.color }}
                >
                  <Check size={9} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {data.eventType === "wedding" && (
        <div className="flex items-start gap-2 mt-5 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-800 text-sm leading-snug">
          <Info size={14} className="mt-0.5 flex-shrink-0" />
          <span>
            Wedding mode is active — you&apos;ll get wedding-specific fields like ceremony time,
            mehendi &amp; sangeet planning, and more in upcoming steps.
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Step 2 — Basic Info ──────────────────────────────────────────────────────

function StepBasics({ data, onChange }) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">Tell us about your event</h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Give your event an identity — this helps vendors understand your vision.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            className={inputCls}
            type="text"
            placeholder={
              data.eventType === "wedding"
                ? "e.g. Priya & Arjun's Wedding"
                : "Give your event a name"
            }
            value={data.eventName}
            onChange={(e) => onChange("eventName", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Theme / Style</label>
          <input
            className={inputCls}
            type="text"
            placeholder={
              data.eventType === "wedding"
                ? "e.g. Royal Rajasthani, Garden, Minimalist"
                : "e.g. Bollywood Night, Vintage"
            }
            value={data.theme}
            onChange={(e) => onChange("theme", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelCls}>Description</label>
          <textarea
            className={textareaCls}
            rows={4}
            placeholder="Share the story of your event — what makes it special, your vision, style preferences, anything you want vendors to know..."
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
          <span className="text-xs text-gray-400 text-right">{data.description.length} / 500</span>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelCls}>Special Requirements / Notes</label>
          <textarea
            className={textareaCls}
            rows={3}
            placeholder="Dietary restrictions, accessibility needs, cultural or religious requirements, language preferences..."
            value={data.specialRequirements}
            onChange={(e) => onChange("specialRequirements", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 — Date & Venue ────────────────────────────────────────────────────

function StepDateTime({ data, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
          When &amp; Where is your event?
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Setting dates early helps you check vendor availability. You can mark dates as tentative.
        </p>
      </div>

      {/* Date & Time card */}
      <div className="border border-gray-200 rounded-xl p-4 sm:p-5">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-4">
          <Calendar size={14} /> Date &amp; Time
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>
              Primary Event Date <span className="text-red-500">*</span>
            </label>
            <input
              className={inputCls}
              type="date"
              value={data.eventDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => onChange("eventDate", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Alternate / Backup Date</label>
            <input
              className={inputCls}
              type="date"
              value={data.alternateDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => onChange("alternateDate", e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-0.5">
              Useful when checking vendor availability for multiple dates.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Start Time</label>
            <input
              className={inputCls}
              type="time"
              value={data.startTime}
              onChange={(e) => onChange("startTime", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>End Time (approx.)</label>
            <input
              className={inputCls}
              type="time"
              value={data.endTime}
              onChange={(e) => onChange("endTime", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Venue card */}
      <div className="border border-gray-200 rounded-xl p-4 sm:p-5">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-4">
          <MapPin size={14} /> Venue Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className={labelCls}>Venue Name</label>
            <input
              className={inputCls}
              type="text"
              placeholder="e.g. Taj Palace Banquet Hall"
              value={data.venueName}
              onChange={(e) => onChange("venueName", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className={labelCls}>Address</label>
            <input
              className={inputCls}
              type="text"
              placeholder="Street address"
              value={data.venueAddress}
              onChange={(e) => onChange("venueAddress", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>City</label>
            <input
              className={inputCls}
              type="text"
              placeholder="City"
              value={data.venueCity}
              onChange={(e) => onChange("venueCity", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>State</label>
            <input
              className={inputCls}
              type="text"
              placeholder="State"
              value={data.venueState}
              onChange={(e) => onChange("venueState", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={data.isVenueConfirmed}
                onChange={(e) => onChange("isVenueConfirmed", e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
              <span>Venue is confirmed / booked</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4 — Guests ──────────────────────────────────────────────────────────

function StepGuests({ data, onChange }) {
  const total    = parseInt(data.totalGuests) || 0;
  const adults   = parseInt(data.adultCount)  || 0;
  const children = parseInt(data.childCount)  || 0;
  const vip      = parseInt(data.vipCount)    || 0;
  const subTotal = adults + children;

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
        Guest count &amp; planning
      </h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Accurate guest numbers help with catering, seating, and vendor estimates.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelCls}>
            Total Expected Guests <span className="text-red-500">*</span>
          </label>
          <input
            className={inputCls}
            type="number"
            placeholder="e.g. 250"
            min={1}
            value={data.totalGuests}
            onChange={(e) => onChange("totalGuests", e.target.value)}
          />
        </div>

        {/* Guest breakdown inner card */}
        <div className="sm:col-span-2 border border-gray-200 rounded-xl p-4 bg-gray-50">
          <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            Guest Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Adults</label>
              <input
                className={inputCls}
                type="number"
                placeholder="0"
                min={0}
                value={data.adultCount}
                onChange={(e) => onChange("adultCount", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Children (under 12)</label>
              <input
                className={inputCls}
                type="number"
                placeholder="0"
                min={0}
                value={data.childCount}
                onChange={(e) => onChange("childCount", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>VIP / Special Guests</label>
              <input
                className={inputCls}
                type="number"
                placeholder="0"
                min={0}
                value={data.vipCount}
                onChange={(e) => onChange("vipCount", e.target.value)}
              />
            </div>
          </div>

          {subTotal > 0 && total > 0 && subTotal !== total && (
            <div className="flex items-center gap-1.5 text-amber-700 text-xs mt-3">
              <AlertCircle size={13} />
              <span>
                Adults + Children = {subTotal}, but total guests = {total}. Please verify.
              </span>
            </div>
          )}
          {vip > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {vip} VIP guests will need special seating or arrangements.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelCls}>Guest List Notes</label>
          <textarea
            className={textareaCls}
            rows={3}
            placeholder="Out-of-town guests needing accommodation, guests with dietary restrictions, accessibility needs..."
            value={data.guestListNotes}
            onChange={(e) => onChange("guestListNotes", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 5 — Budget ─────────────────────────────────────────────────────────

function StepBudget({ data, onChange }) {
  const total = parseFloat(data.totalBudget) || 0;

  const handleBudgetBreakdown = (catId, field, value) => {
    onChange("budgetBreakdown", {
      ...data.budgetBreakdown,
      [catId]: { ...data.budgetBreakdown[catId], [field]: value },
    });
  };

  const autoDistribute = () => {
    if (!total) return;
    const updated = { ...data.budgetBreakdown };
    BUDGET_CATEGORIES.forEach((c) => {
      updated[c.id] = {
        ...updated[c.id],
        allocated: ((total * c.defaultPct) / 100).toFixed(0),
      };
    });
    onChange("budgetBreakdown", updated);
  };

  const allocated = BUDGET_CATEGORIES.reduce(
    (sum, c) => sum + (parseFloat(data.budgetBreakdown[c.id]?.allocated) || 0),
    0
  );
  const remaining = total - allocated;

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">Plan your budget</h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Set a total budget and distribute it across categories. Use auto-distribute for recommended splits.
      </p>

      {/* Total input + auto-distribute */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mb-5">
        <div className="flex flex-col gap-1.5 flex-1 w-full">
          <label className={labelCls}>
            Total Event Budget (₹) <span className="text-red-500">*</span>
          </label>
          <input
            className={inputCls}
            type="number"
            placeholder="e.g. 500000"
            min={0}
            value={data.totalBudget}
            onChange={(e) => onChange("totalBudget", e.target.value)}
          />
        </div>
        {total > 0 && (
          <button
            type="button"
            onClick={autoDistribute}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-50 border border-violet-300 text-violet-700 text-sm font-medium rounded-lg hover:bg-violet-100 transition-colors whitespace-nowrap flex-shrink-0 self-end"
          >
            <Sparkles size={13} /> Auto-distribute
          </button>
        )}
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="mb-5">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                remaining < 0 ? "bg-red-500" : "bg-green-500"
              }`}
              style={{ width: `${Math.min((allocated / total) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Allocated: ₹{allocated.toLocaleString("en-IN")}</span>
            <span className={remaining < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              {remaining < 0
                ? `Over by ₹${Math.abs(remaining).toLocaleString("en-IN")}`
                : `₹${remaining.toLocaleString("en-IN")} remaining`}
            </span>
          </div>
        </div>
      )}

      {/* Budget table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* Table header — desktop only */}
        <div className="hidden sm:grid sm:grid-cols-[2fr_0.8fr_1.5fr_2fr] gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <span>Category</span>
          <span className="text-center">Suggested %</span>
          <span>Amount (₹)</span>
          <span>Notes</span>
        </div>

        {BUDGET_CATEGORIES.map((cat, i) => (
          <div
            key={cat.id}
            className={`flex flex-col sm:grid sm:grid-cols-[2fr_0.8fr_1.5fr_2fr] gap-2 px-4 py-3 sm:items-center
              hover:bg-gray-50 transition-colors
              ${i < BUDGET_CATEGORIES.length - 1 ? "border-b border-gray-100" : ""}`}
          >
            {/* Mobile: label + pct badge on same row */}
            <div className="flex items-center justify-between sm:block">
              <span className="text-sm font-medium text-gray-800">{cat.label}</span>
              <span className="sm:hidden text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {cat.defaultPct}%
              </span>
            </div>
            {/* Desktop % */}
            <span className="hidden sm:block text-xs text-gray-400 text-center">{cat.defaultPct}%</span>

            <input
              className={inputCls + " sm:text-right"}
              type="number"
              placeholder={
                total ? Math.round((total * cat.defaultPct) / 100).toString() : "0"
              }
              value={data.budgetBreakdown[cat.id]?.allocated || ""}
              onChange={(e) => handleBudgetBreakdown(cat.id, "allocated", e.target.value)}
            />
            <input
              className={inputCls}
              type="text"
              placeholder="Notes..."
              value={data.budgetBreakdown[cat.id]?.notes || ""}
              onChange={(e) => handleBudgetBreakdown(cat.id, "notes", e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 6 — Vendors ─────────────────────────────────────────────────────────

function StepVendors({ data, onChange }) {
  const toggleVendor = (vendorId) => {
    const selected = data.selectedVendors.includes(vendorId)
      ? data.selectedVendors.filter((v) => v !== vendorId)
      : [...data.selectedVendors, vendorId];
    onChange("selectedVendors", selected);
  };

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">Vendors you need</h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Select the types of vendors you want for your event. We&apos;ll help you find the best matches
        from our platform.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
        {VENDOR_CATEGORIES.map((vendor) => {
          const Icon       = vendor.icon;
          const isSelected = data.selectedVendors.includes(vendor.id);
          return (
            <button
              key={vendor.id}
              type="button"
              onClick={() => toggleVendor(vendor.id)}
              className={`relative flex flex-col items-center justify-center gap-2 py-4 px-2 border-2 rounded-xl transition-all
                ${isSelected
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-indigo-200 hover:bg-violet-50 hover:-translate-y-0.5"}`}
            >
              <div className={isSelected ? "text-indigo-600" : "text-gray-400"}>
                <Icon size={22} />
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
                {vendor.label}
              </span>
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <Check size={9} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {data.selectedVendors.length > 0 && (
        <p className="text-xs text-gray-400 mt-3">
          {data.selectedVendors.length} vendor
          {data.selectedVendors.length !== 1 ? " types" : " type"} selected. You&apos;ll be able to
          browse and invite specific vendors after creating your event.
        </p>
      )}

      <div className="flex flex-col gap-1.5 mt-6">
        <label className={labelCls}>Additional Vendor Notes</label>
        <textarea
          className={textareaCls}
          rows={3}
          placeholder="Any specific requirements for vendors — style preferences, certifications, language, etc."
          value={data.vendorNotes}
          onChange={(e) => onChange("vendorNotes", e.target.value)}
        />
      </div>
    </div>
  );
}

// ─── Step 7 — Review ─────────────────────────────────────────────────────────

function StepReview({ data }) {
  const eventTypeLabel = EVENT_TYPES.find((t) => t.id === data.eventType)?.label || "—";
  const selectedVendorLabels = VENDOR_CATEGORIES.filter((v) =>
    data.selectedVendors.includes(v.id)
  ).map((v) => v.label);

  const total     = parseFloat(data.totalBudget) || 0;
  const allocated = BUDGET_CATEGORIES.reduce(
    (sum, c) => sum + (parseFloat(data.budgetBreakdown[c.id]?.allocated) || 0),
    0
  );

  const card  = "bg-gray-50 border border-gray-200 rounded-xl p-3.5";
  const title = "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2";
  const val   = "text-sm sm:text-base font-semibold text-gray-900";
  const sub   = "text-xs text-gray-500 mt-0.5";

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">Review your event</h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Everything looks good? Go ahead and create your event. You can always edit it later.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className={card}>
          <h3 className={title}><Star size={12} /> Event Type</h3>
          <p className={val}>{eventTypeLabel}</p>
        </div>
        <div className={card}>
          <h3 className={title}><FileText size={12} /> Event Name</h3>
          <p className={val}>{data.eventName || "—"}</p>
          {data.theme && <p className={sub}>Theme: {data.theme}</p>}
        </div>
        <div className={card}>
          <h3 className={title}><Calendar size={12} /> Date &amp; Time</h3>
          <p className={val}>{formatDate(data.eventDate)}</p>
          {data.alternateDate && <p className={sub}>Alt: {formatDate(data.alternateDate)}</p>}
          {data.startTime && (
            <p className={sub}>{data.startTime}{data.endTime ? ` — ${data.endTime}` : ""}</p>
          )}
        </div>
        <div className={card}>
          <h3 className={title}><MapPin size={12} /> Venue</h3>
          <p className={val}>{data.venueName || "Not specified"}</p>
          {data.venueCity && (
            <p className={sub}>{data.venueCity}{data.venueState ? `, ${data.venueState}` : ""}</p>
          )}
          {data.isVenueConfirmed && (
            <span className="inline-block mt-1.5 text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Confirmed
            </span>
          )}
        </div>
        <div className={card}>
          <h3 className={title}><Users size={12} /> Guests</h3>
          <p className={val}>{data.totalGuests || "—"} guests</p>
          {data.vipCount > 0 && <p className={sub}>{data.vipCount} VIP guests</p>}
        </div>
        <div className={card}>
          <h3 className={title}><DollarSign size={12} /> Budget</h3>
          <p className={val}>₹{total ? total.toLocaleString("en-IN") : "—"}</p>
          {allocated > 0 && <p className={sub}>₹{allocated.toLocaleString("en-IN")} planned</p>}
        </div>

        {/* Vendors — full width */}
        <div className={`${card} col-span-2 sm:col-span-3`}>
          <h3 className={title}><Briefcase size={12} /> Vendors Needed</h3>
          {selectedVendorLabels.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {selectedVendorLabels.map((l) => (
                <span
                  key={l}
                  className="text-xs font-medium bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full"
                >
                  {l}
                </span>
              ))}
            </div>
          ) : (
            <p className={val}>None selected</p>
          )}
        </div>

        {/* Description — full width */}
        {data.description && (
          <div className={`${card} col-span-2 sm:col-span-3`}>
            <h3 className={title}><FileText size={12} /> Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed mt-0.5">{data.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export default function EventCreationWizard() {
  const [currentStep,    setCurrentStep]    = useState(0);
  const [formData,       setFormData]       = useState(INITIAL_STATE);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [draftInfo,      setDraftInfo]      = useState(null);
  const [autoSaved,      setAutoSaved]      = useState(false);
  const [submitted,      setSubmitted]      = useState(false);
  const [errors,         setErrors]         = useState({});

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft && draft.data?.eventType) setDraftInfo(draft);
  }, []);

  // Autosave on data/step change
  useEffect(() => {
    if (formData.eventType || formData.eventName) {
      saveDraft(formData, currentStep);
      setAutoSaved(true);
      const timer = setTimeout(() => setAutoSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [formData, currentStep]);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev)   => ({ ...prev, [field]: "" }));
  }, []);

  const validate = (stepIdx) => {
    const errs = {};
    if (stepIdx === 0 && !formData.eventType)        errs.eventType   = "Please select an event type.";
    if (stepIdx === 1 && !formData.eventName.trim()) errs.eventName   = "Event name is required.";
    if (stepIdx === 2 && !formData.eventDate)        errs.eventDate   = "Please pick a date.";
    if (stepIdx === 3 && !formData.totalGuests)      errs.totalGuests = "Please enter expected guest count.";
    if (stepIdx === 4 && !formData.totalBudget)      errs.totalBudget = "Please enter a total budget.";
    return errs;
  };

  const goNext = () => {
    const errs = validate(currentStep);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setCompletedSteps((prev) =>
      prev.includes(currentStep) ? prev : [...prev, currentStep]
    );
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => { setSubmitted(true); clearDraft(); };

  const resumeDraft = () => {
    if (draftInfo) {
      setFormData(draftInfo.data);
      setCurrentStep(draftInfo.currentStep || 0);
      setDraftInfo(null);
    }
  };

  const dismissDraft = () => setDraftInfo(null);

  const resetForm = () => {
    setFormData(INITIAL_STATE);
    setCurrentStep(0);
    setCompletedSteps([]);
    setSubmitted(false);
    clearDraft();
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-12 sm:mt-20 text-center px-6 py-10 sm:py-14 bg-white rounded-2xl border border-gray-200 shadow-lg">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-5">
          <Check size={30} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Event Created Successfully!
        </h2>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          <strong>{formData.eventName}</strong> has been saved. You can now browse vendors and start
          building your team.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            type="button"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Browse Vendors
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium rounded-lg transition-colors"
          >
            Create Another Event
          </button>
        </div>
      </div>
    );
  }

  const stepComponents = [
    <StepEventType data={formData} onChange={handleChange} key="type"     />,
    <StepBasics    data={formData} onChange={handleChange} key="basics"   />,
    <StepDateTime  data={formData} onChange={handleChange} key="datetime" />,
    <StepGuests    data={formData} onChange={handleChange} key="guests"   />,
    <StepBudget    data={formData} onChange={handleChange} key="budget"   />,
    <StepVendors   data={formData} onChange={handleChange} key="vendors"  />,
    <StepReview    data={formData}                         key="review"   />,
  ];

  const isLastStep    = currentStep === STEPS.length - 1;
  const currentErrors = Object.values(errors).filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">

      {/* Draft resume banner */}
      <DraftBanner draft={draftInfo} onResume={resumeDraft} onDismiss={dismissDraft} />

      {/* ── Header ── */}
      <div className="px-4 sm:px-7 pt-5 pb-0 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Create New Event</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep].label}
            </p>
          </div>
          {autoSaved && (
            <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
              <Save size={11} /> Saved
            </div>
          )}
        </div>

        <StepperHeader
          currentStep={currentStep}
          onStepClick={setCurrentStep}
          completedSteps={completedSteps}
        />

        {/* Thin progress bar */}
        <div className="h-0.5 bg-gray-100 mt-3">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-4 sm:px-7 py-6 sm:py-8 min-h-[420px]">
        {currentErrors.length > 0 && (
          <div
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5"
            role="alert"
          >
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{currentErrors[0]}</span>
          </div>
        )}
        {stepComponents[currentStep]}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 sm:px-7 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            saveDraft(formData, currentStep);
            setAutoSaved(true);
            setTimeout(() => setAutoSaved(false), 2000);
          }}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-600 text-xs sm:text-sm rounded-lg bg-white transition-colors"
        >
          <Save size={13} /> Save as Draft
        </button>

        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium rounded-lg bg-white transition-colors"
            >
              <ChevronLeft size={14} /> Back
            </button>
          )}
          {!isLastStep ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-1 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-lg transition-all"
            >
              Continue <ChevronRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 active:scale-95 text-white text-sm font-semibold rounded-lg transition-all shadow-md shadow-indigo-200"
            >
              <Sparkles size={13} /> Create Event
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
