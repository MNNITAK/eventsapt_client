/**
 * eventSteps.js
 *
 * Central config that drives the entire wizard.
 * Each event type declares its own ordered steps array.
 * Each step has:
 *   - id          → used in the URL  /event-wizard/:eventType/:stepId?node=uid
 *   - label       → display name in the stepper
 *   - shortLabel  → compact label for mobile stepper
 *   - description → subtitle shown on the step page
 *   - icon        → lucide-react icon name (string; import in the component)
 *   - fields      → Zod-validated field keys belonging to this step
 *   - optional    → if true, step can be skipped
 *   - category    → groups steps visually in the sidebar (Planning / Logistics / Vendors / Finalize)
 */

// ─── Shared step definitions (reused across event types) ─────────────────────

const SHARED_STEPS = {
  basicInfo: {
    id: "basic-info",
    label: "Basic Information",
    shortLabel: "Basics",
    description: "Name, theme, and a description to set the vision for your event.",
    icon: "FileText",
    fields: ["eventName", "theme", "description", "specialRequirements"],
    category: "Planning",
  },

  dateTime: {
    id: "date-time",
    label: "Date & Time",
    shortLabel: "Date",
    description: "Set your primary date, backup date, and event timings.",
    icon: "Calendar",
    fields: ["eventDate", "alternateDate", "startTime", "endTime"],
    category: "Logistics",
  },

  venue: {
    id: "venue",
    label: "Venue & Location",
    shortLabel: "Venue",
    description: "Where will the event be held? Add address and confirm booking status.",
    icon: "MapPin",
    fields: ["venueName", "venueAddress", "venueCity", "venueState", "isVenueConfirmed", "venueCapacity", "venueNotes"],
    category: "Logistics",
  },

  guestList: {
    id: "guest-list",
    label: "Guest List",
    shortLabel: "Guests",
    description: "Set your guest count and breakdown so vendors can plan accordingly.",
    icon: "Users",
    fields: ["totalGuests", "adultCount", "childCount", "vipCount", "guestListNotes"],
    category: "Planning",
  },

  budget: {
    id: "budget",
    label: "Budget Planner",
    shortLabel: "Budget",
    description: "Set your total budget and distribute it across event categories.",
    icon: "DollarSign",
    fields: ["totalBudget", "budgetBreakdown", "budgetNotes"],
    category: "Planning",
  },

  vendors: {
    id: "vendors",
    label: "Vendor Selection",
    shortLabel: "Vendors",
    description: "Choose which vendor types you need. We'll match you with the best on our platform.",
    icon: "Briefcase",
    fields: ["selectedVendors", "vendorNotes"],
    category: "Vendors",
  },

  catering: {
    id: "catering",
    label: "Food & Catering",
    shortLabel: "Catering",
    description: "Plan your menu style, dietary requirements, and service format.",
    icon: "Utensils",
    fields: ["cateringStyle", "dietaryRestrictions", "barService", "cakeRequired", "cateringNotes"],
    category: "Vendors",
  },

  decor: {
    id: "decor",
    label: "Decor & Ambience",
    shortLabel: "Decor",
    description: "Choose your decoration style, color palette, and floral preferences.",
    icon: "Flower2",
    fields: ["decorStyle", "colorPalette", "floralsRequired", "lightingPreference", "decorNotes"],
    category: "Vendors",
  },

  entertainment: {
    id: "entertainment",
    label: "Entertainment",
    shortLabel: "Fun",
    description: "Plan music, performances, activities and special moments.",
    icon: "Music",
    fields: ["entertainmentType", "musicGenre", "specialPerformances", "activitiesNotes"],
    category: "Vendors",
  },

  invitations: {
    id: "invitations",
    label: "Invitations & RSVPs",
    shortLabel: "Invites",
    description: "Set the invitation style, send dates, and RSVP deadline.",
    icon: "Mail",
    fields: ["inviteStyle", "saveTheDateRequired", "sendDate", "rsvpDeadline", "inviteNotes"],
    category: "Planning",
  },

  transport: {
    id: "transport",
    label: "Transport & Logistics",
    shortLabel: "Transport",
    description: "Plan guest transport, parking, and out-of-town accommodation.",
    icon: "Car",
    fields: ["guestTransportRequired", "transportType", "parkingAvailable", "accommodationRequired", "transportNotes"],
    category: "Logistics",
  },

  photography: {
    id: "photography",
    label: "Photography & Video",
    shortLabel: "Photos",
    description: "Define your photography style, coverage hours, and deliverables.",
    icon: "Camera",
    fields: ["photographyStyle", "coverageHours", "videoRequired", "droneRequired", "photosNotes"],
    category: "Vendors",
  },

  review: {
    id: "review",
    label: "Review & Publish",
    shortLabel: "Review",
    description: "Review all details before creating your event and going live to vendors.",
    icon: "CheckCircle",
    fields: [],
    category: "Finalize",
  },
};

// ─── Event type step lists ────────────────────────────────────────────────────

export const EVENT_STEPS = {

  // ── Wedding ────────────────────────────────────────────────────────────────
  wedding: {
    label: "Wedding",
    icon: "Heart",
    color: "#e11d48",
    description: "Plan your perfect wedding day from venue to vendors.",
    estimatedTime: "20–30 min",
    steps: [
      SHARED_STEPS.basicInfo,
      {
        id: "wedding-details",
        label: "Wedding Details",
        shortLabel: "Wedding",
        description: "Ceremony type, couple names, religion or cultural traditions, and pre-wedding events.",
        icon: "Heart",
        fields: ["groomName", "brideName", "ceremonyType", "religion", "preweddingEvents", "weddingStyle"],
        category: "Planning",
      },
      SHARED_STEPS.dateTime,
      SHARED_STEPS.venue,
      {
        id: "ceremony-reception",
        label: "Ceremony & Reception",
        shortLabel: "Ceremony",
        description: "Plan your ceremony order, reception timeline, vows, rituals, and cultural traditions.",
        icon: "Sparkles",
        fields: ["ceremonyVenue", "receptionVenue", "separateVenues", "ceremonyDuration", "receptionDuration", "rituals", "firstDance", "vows"],
        category: "Planning",
      },
      SHARED_STEPS.guestList,
      SHARED_STEPS.budget,
      SHARED_STEPS.invitations,
      {
        id: "attire",
        label: "Attire & Styling",
        shortLabel: "Attire",
        description: "Bridal wear, groom outfit, wedding party attire, and beauty appointments.",
        icon: "Shirt",
        fields: ["bridalWear", "groomAttire", "bridesmaidsAttire", "groomsmenAttire", "hairMakeup", "attireNotes"],
        category: "Vendors",
      },
      SHARED_STEPS.catering,
      SHARED_STEPS.decor,
      SHARED_STEPS.photography,
      SHARED_STEPS.entertainment,
      SHARED_STEPS.transport,
      {
        id: "honeymoon",
        label: "Honeymoon",
        shortLabel: "Honeymoon",
        description: "Plan post-wedding travel — destination, dates, and accommodation.",
        icon: "Plane",
        fields: ["honeymoonDestination", "honeymoonDates", "honeymoonNotes"],
        optional: true,
        category: "Planning",
      },
      SHARED_STEPS.vendors,
      SHARED_STEPS.review,
    ],
  },

  // ── Birthday Party ────────────────────────────────────────────────────────
  birthday: {
    label: "Birthday Party",
    icon: "PartyPopper",
    color: "#7c3aed",
    description: "Plan a memorable birthday celebration for any age.",
    estimatedTime: "10–15 min",
    steps: [
      SHARED_STEPS.basicInfo,
      {
        id: "birthday-details",
        label: "Birthday Details",
        shortLabel: "Birthday",
        description: "Who is being celebrated, their age milestone, and the party vibe.",
        icon: "Cake",
        fields: ["celebrantName", "celebrantAge", "ageGroup", "partyVibe", "surpriseParty"],
        category: "Planning",
      },
      SHARED_STEPS.dateTime,
      SHARED_STEPS.venue,
      SHARED_STEPS.guestList,
      SHARED_STEPS.budget,
      SHARED_STEPS.invitations,
      SHARED_STEPS.catering,
      SHARED_STEPS.decor,
      SHARED_STEPS.entertainment,
      {
        id: "cake",
        label: "Cake & Desserts",
        shortLabel: "Cake",
        description: "Design your celebration cake, flavours, and dessert spread.",
        icon: "Cake",
        fields: ["cakeFlavour", "cakeTiers", "cakeDesign", "dessertsRequired", "cakeNotes"],
        category: "Vendors",
      },
      SHARED_STEPS.photography,
      SHARED_STEPS.vendors,
      SHARED_STEPS.review,
    ],
  },

  // ── Corporate / Office Event ──────────────────────────────────────────────
  corporate: {
    label: "Corporate Event",
    icon: "Building2",
    color: "#0369a1",
    description: "Plan conferences, team events, product launches & company celebrations.",
    estimatedTime: "15–20 min",
    steps: [
      SHARED_STEPS.basicInfo,
      {
        id: "corporate-details",
        label: "Event Objective",
        shortLabel: "Objective",
        description: "Define the business goal, format, and target audience for your event.",
        icon: "Target",
        fields: ["eventObjective", "eventFormat", "targetAudience", "companyName", "brandingRequired", "internalExternal"],
        category: "Planning",
      },
      SHARED_STEPS.dateTime,
      SHARED_STEPS.venue,
      {
        id: "agenda",
        label: "Agenda & Programme",
        shortLabel: "Agenda",
        description: "Plan the run-of-show, sessions, speakers, and breakout activities.",
        icon: "ClipboardList",
        fields: ["agendaItems", "keynoteSpeakers", "breakoutSessions", "networkingTime", "agendaNotes"],
        category: "Planning",
      },
      SHARED_STEPS.guestList,
      SHARED_STEPS.budget,
      {
        id: "av-tech",
        label: "AV & Technology",
        shortLabel: "AV / Tech",
        description: "Screens, projectors, microphones, live streaming, and hybrid event tech.",
        icon: "Monitor",
        fields: ["avRequired", "projectorRequired", "micType", "liveStream", "hybridEvent", "techNotes"],
        category: "Logistics",
      },
      SHARED_STEPS.catering,
      SHARED_STEPS.decor,
      SHARED_STEPS.invitations,
      SHARED_STEPS.transport,
      SHARED_STEPS.photography,
      {
        id: "branding",
        label: "Branding & Collateral",
        shortLabel: "Branding",
        description: "Event branding, signage, banners, swag, and sponsor visibility.",
        icon: "Tag",
        fields: ["brandingItems", "signageRequired", "swagBags", "sponsorLogos", "brandingNotes"],
        optional: true,
        category: "Vendors",
      },
      SHARED_STEPS.vendors,
      SHARED_STEPS.review,
    ],
  },

  // ── Concert / Music Event ─────────────────────────────────────────────────
  concert: {
    label: "Concert / Show",
    icon: "Music",
    color: "#b45309",
    description: "Plan live music events, shows, and cultural performances.",
    estimatedTime: "15–20 min",
    steps: [
      SHARED_STEPS.basicInfo,
      {
        id: "concert-details",
        label: "Performance Details",
        shortLabel: "Performance",
        description: "Artists, genre, ticketing type, and audience expectations.",
        icon: "Mic",
        fields: ["artistName", "genre", "numberOfActs", "ticketType", "ageRestriction", "concertNotes"],
        category: "Planning",
      },
      SHARED_STEPS.dateTime,
      SHARED_STEPS.venue,
      {
        id: "stage-production",
        label: "Stage & Production",
        shortLabel: "Stage",
        description: "Stage layout, sound system, lighting rigs, and backstage requirements.",
        icon: "Layers",
        fields: ["stageSize", "soundSystem", "lightingRig", "screenRequired", "backstaageRooms", "productionNotes"],
        category: "Logistics",
      },
      SHARED_STEPS.guestList,
      SHARED_STEPS.budget,
      {
        id: "ticketing",
        label: "Ticketing & Entry",
        shortLabel: "Tickets",
        description: "Ticket tiers, pricing, online sales platform, and entry management.",
        icon: "Ticket",
        fields: ["ticketTiers", "ticketPrice", "ticketPlatform", "gateManagement", "ticketingNotes"],
        category: "Planning",
      },
      {
        id: "security-permits",
        label: "Security & Permits",
        shortLabel: "Security",
        description: "Event permits, security staffing, crowd management, and emergency plans.",
        icon: "ShieldCheck",
        fields: ["permitsRequired", "securityStaff", "crowdCapacity", "emergencyPlan", "securityNotes"],
        category: "Logistics",
      },
      SHARED_STEPS.catering,
      SHARED_STEPS.transport,
      SHARED_STEPS.photography,
      SHARED_STEPS.vendors,
      SHARED_STEPS.review,
    ],
  },

  // ── Party / Social Event ──────────────────────────────────────────────────
  party: {
    label: "Social Party",
    icon: "Sparkles",
    color: "#0d9488",
    description: "House parties, theme nights, get-togethers & social celebrations.",
    estimatedTime: "8–12 min",
    steps: [
      SHARED_STEPS.basicInfo,
      {
        id: "party-details",
        label: "Party Details",
        shortLabel: "Party",
        description: "Party type, dress code, vibe, and any special theme elements.",
        icon: "Sparkles",
        fields: ["partyType", "dressCode", "partyTheme", "outdoorIndoor", "partyNotes"],
        category: "Planning",
      },
      SHARED_STEPS.dateTime,
      SHARED_STEPS.venue,
      SHARED_STEPS.guestList,
      SHARED_STEPS.budget,
      SHARED_STEPS.catering,
      SHARED_STEPS.decor,
      SHARED_STEPS.entertainment,
      SHARED_STEPS.invitations,
      SHARED_STEPS.photography,
      SHARED_STEPS.vendors,
      SHARED_STEPS.review,
    ],
  },

  // ── Engagement / Roka ────────────────────────────────────────────────────
  engagement: {
    label: "Engagement / Roka",
    icon: "Gem",
    color: "#be185d",
    description: "Plan your engagement ceremony, roka, or ring ceremony.",
    estimatedTime: "10–15 min",
    steps: [
      SHARED_STEPS.basicInfo,
      {
        id: "engagement-details",
        label: "Ceremony Details",
        shortLabel: "Ceremony",
        description: "Names, ceremony style, religious customs, and ring exchange planning.",
        icon: "Gem",
        fields: ["partnerOneName", "partnerTwoName", "ceremonyStyle", "customTraditions", "engagementNotes"],
        category: "Planning",
      },
      SHARED_STEPS.dateTime,
      SHARED_STEPS.venue,
      SHARED_STEPS.guestList,
      SHARED_STEPS.budget,
      SHARED_STEPS.catering,
      SHARED_STEPS.decor,
      SHARED_STEPS.photography,
      SHARED_STEPS.invitations,
      SHARED_STEPS.vendors,
      SHARED_STEPS.review,
    ],
  },

  // ── Baby Shower ───────────────────────────────────────────────────────────
  babyShower: {
    label: "Baby Shower",
    icon: "Baby",
    color: "#0891b2",
    description: "Celebrate the upcoming arrival with a heartwarming shower event.",
    estimatedTime: "8–12 min",
    steps: [
      SHARED_STEPS.basicInfo,
      {
        id: "shower-details",
        label: "Shower Details",
        shortLabel: "Shower",
        description: "Expecting parent names, due date, gender reveal preference, and registry info.",
        icon: "Baby",
        fields: ["parentName", "dueDate", "genderReveal", "babyGender", "registryLink", "showerNotes"],
        category: "Planning",
      },
      SHARED_STEPS.dateTime,
      SHARED_STEPS.venue,
      SHARED_STEPS.guestList,
      SHARED_STEPS.budget,
      SHARED_STEPS.catering,
      SHARED_STEPS.decor,
      SHARED_STEPS.entertainment,
      SHARED_STEPS.photography,
      SHARED_STEPS.invitations,
      SHARED_STEPS.vendors,
      SHARED_STEPS.review,
    ],
  },

  // ── Puja / Religious Ceremony ─────────────────────────────────────────────
  puja: {
    label: "Puja / Religious Ceremony",
    icon: "Sun",
    color: "#ea580c",
    description: "Plan griha pravesh, satyanarayan puja, naming ceremonies & religious events.",
    estimatedTime: "8–12 min",
    steps: [
      SHARED_STEPS.basicInfo,
      {
        id: "puja-details",
        label: "Ceremony Details",
        shortLabel: "Ceremony",
        description: "Ceremony type, pandit requirements, religious customs, and muhurat timings.",
        icon: "Sun",
        fields: ["ceremonyType", "panditRequired", "muhuratTime", "deity", "customRituals", "pujaItems"],
        category: "Planning",
      },
      SHARED_STEPS.dateTime,
      SHARED_STEPS.venue,
      SHARED_STEPS.guestList,
      SHARED_STEPS.budget,
      SHARED_STEPS.catering,
      SHARED_STEPS.decor,
      SHARED_STEPS.photography,
      SHARED_STEPS.invitations,
      SHARED_STEPS.vendors,
      SHARED_STEPS.review,
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Get ordered steps for a given event type.
 * @param {string} eventType - key from EVENT_STEPS
 * @returns {Array} array of step objects
 */
export function getStepsForEvent(eventType) {
  return EVENT_STEPS[eventType]?.steps ?? EVENT_STEPS.wedding.steps;
}

/**
 * Get a specific step by eventType + stepId
 */
export function getStep(eventType, stepId) {
  return getStepsForEvent(eventType).find((s) => s.id === stepId) ?? null;
}

/**
 * Get step index (0-based) for URL-based routing
 */
export function getStepIndex(eventType, stepId) {
  return getStepsForEvent(eventType).findIndex((s) => s.id === stepId);
}

/**
 * Get next step id given the current stepId
 */
export function getNextStepId(eventType, currentStepId) {
  const steps = getStepsForEvent(eventType);
  const idx   = steps.findIndex((s) => s.id === currentStepId);
  return idx < steps.length - 1 ? steps[idx + 1].id : null;
}

/**
 * Get previous step id
 */
export function getPrevStepId(eventType, currentStepId) {
  const steps = getStepsForEvent(eventType);
  const idx   = steps.findIndex((s) => s.id === currentStepId);
  return idx > 0 ? steps[idx - 1].id : null;
}

/**
 * Get steps grouped by category for sidebar rendering
 */
export function getStepsByCategory(eventType) {
  const steps = getStepsForEvent(eventType);
  return steps.reduce((acc, step) => {
    const cat = step.category ?? "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(step);
    return acc;
  }, {});
}

/**
 * Compute overall progress percentage
 */
export function getProgress(eventType, completedStepIds) {
  const steps = getStepsForEvent(eventType);
  const total  = steps.filter((s) => s.id !== "review").length;
  const done   = completedStepIds.filter((id) => id !== "review").length;
  return Math.round((done / total) * 100);
}
