/**
 * eventSchemas.js
 *
 * Zod validation schemas for every field in the wizard.
 * Organised by step — each export matches a step "id" from eventSteps.js.
 *
 * Usage in a Next.js route / server action:
 *   import { schemas } from "@/config/eventSchemas";
 *   const result = schemas["basic-info"].safeParse(formData);
 *
 * NOTE: Install zod →  npm install zod
 */

import { z } from "zod";

// ─── Reusable primitives ─────────────────────────────────────────────────────

const shortText = (label, max = 100) =>
  z.string()
    .min(1, `${label} is required`)
    .max(max, `${label} must be ${max} characters or fewer`)
    .trim();

const optionalShortText = (max = 100) =>
  z.string().max(max, `Must be ${max} characters or fewer`).trim().optional();

const longText = (label, max = 500) =>
  z.string()
    .max(max, `${label} must be ${max} characters or fewer`)
    .trim()
    .optional();

const positiveInt = (label) =>
  z.coerce
    .number({ invalid_type_error: `${label} must be a number` })
    .int(`${label} must be a whole number`)
    .positive(`${label} must be greater than 0`);

const nonNegativeInt = (label) =>
  z.coerce
    .number({ invalid_type_error: `${label} must be a number` })
    .int()
    .min(0, `${label} cannot be negative`);

const futureDate = (label) =>
  z.string()
    .min(1, `${label} is required`)
    .refine((val) => {
      const d = new Date(val);
      return !isNaN(d.getTime()) && d >= new Date(new Date().setHours(0, 0, 0, 0));
    }, `${label} must be today or a future date`);

const optionalFutureDate = () =>
  z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const d = new Date(val);
      return !isNaN(d.getTime()) && d >= new Date(new Date().setHours(0, 0, 0, 0));
    }, "Must be today or a future date");

const timeString = () =>
  z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^([01]\d|2[0-3]):([0-5]\d)$/.test(val);
    }, "Invalid time format (HH:MM)");

const indianPhone = () =>
  z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^[6-9]\d{9}$/.test(val.replace(/\s/g, ""));
    }, "Enter a valid 10-digit Indian mobile number");

const positiveAmount = (label) =>
  z.coerce
    .number({ invalid_type_error: `${label} must be a number` })
    .positive(`${label} must be greater than 0`);

// ─── Step schemas ─────────────────────────────────────────────────────────────

export const schemas = {

  // ── basic-info ─────────────────────────────────────────────────────────────
  "basic-info": z.object({
    eventName: shortText("Event name", 80),
    theme: optionalShortText(80),
    description: longText("Description", 500),
    specialRequirements: longText("Special requirements", 300),
  }),

  // ── date-time ──────────────────────────────────────────────────────────────
  "date-time": z.object({
    eventDate: futureDate("Event date"),
    alternateDate: optionalFutureDate(),
    startTime: timeString(),
    endTime: timeString(),
  }).refine((data) => {
    if (!data.startTime || !data.endTime) return true;
    return data.startTime < data.endTime;
  }, {
    message: "End time must be after start time",
    path: ["endTime"],
  }).refine((data) => {
    if (!data.alternateDate || !data.eventDate) return true;
    return data.alternateDate !== data.eventDate;
  }, {
    message: "Alternate date must be different from the primary date",
    path: ["alternateDate"],
  }),

  // ── venue ──────────────────────────────────────────────────────────────────
  "venue": z.object({
    venueName: optionalShortText(120),
    venueAddress: optionalShortText(200),
    venueCity: optionalShortText(60),
    venueState: optionalShortText(60),
    isVenueConfirmed: z.boolean().optional(),
    venueCapacity: z.coerce.number().int().positive().optional(),
    venueNotes: longText("Venue notes", 300),
  }),

  // ── guest-list ─────────────────────────────────────────────────────────────
  "guest-list": z.object({
    totalGuests: positiveInt("Total guests"),
    adultCount: nonNegativeInt("Adult count").optional(),
    childCount: nonNegativeInt("Child count").optional(),
    vipCount: nonNegativeInt("VIP count").optional(),
    guestListNotes: longText("Guest list notes", 300),
  }).refine((data) => {
    const adults   = data.adultCount   ?? 0;
    const children = data.childCount   ?? 0;
    const sub      = adults + children;
    if (sub === 0) return true; // user hasn't filled breakdown yet — OK
    return sub <= data.totalGuests;
  }, {
    message: "Adults + Children cannot exceed total guests",
    path: ["adultCount"],
  }),

  // ── budget ─────────────────────────────────────────────────────────────────
  "budget": z.object({
    totalBudget: positiveAmount("Total budget"),
    budgetNotes: longText("Budget notes", 300),
    budgetBreakdown: z.record(
      z.string(),
      z.object({
        allocated: z.coerce.number().min(0).optional(),
        notes: z.string().max(150).trim().optional(),
      })
    ).optional(),
  }),

  // ── vendors ────────────────────────────────────────────────────────────────
  "vendors": z.object({
    selectedVendors: z.array(z.string()).min(1, "Select at least one vendor type"),
    vendorNotes: longText("Vendor notes", 300),
  }),

  // ── catering ──────────────────────────────────────────────────────────────
  "catering": z.object({
    cateringStyle: z.enum(["buffet", "plated", "live-stations", "finger-food", "cocktail", "home-cooked", "unsure"], {
      invalid_type_error: "Select a catering style",
    }).optional(),
    dietaryRestrictions: z.array(z.string()).optional(),
    barService: z.enum(["full-bar", "beer-wine", "mocktails-only", "none"]).optional(),
    cakeRequired: z.boolean().optional(),
    cateringNotes: longText("Catering notes", 300),
  }),

  // ── decor ──────────────────────────────────────────────────────────────────
  "decor": z.object({
    decorStyle: z.enum([
      "traditional", "modern", "rustic", "luxury", "minimalist",
      "floral-heavy", "bohemian", "royal", "outdoor-garden", "unsure",
    ]).optional(),
    colorPalette: optionalShortText(100),
    floralsRequired: z.boolean().optional(),
    lightingPreference: z.enum(["fairy-lights", "chandeliers", "neon", "candlelit", "spotlights", "natural", "none"]).optional(),
    decorNotes: longText("Decor notes", 300),
  }),

  // ── entertainment ─────────────────────────────────────────────────────────
  "entertainment": z.object({
    entertainmentType: z.array(z.enum([
      "dj", "live-band", "classical-music", "folk-music", "comedian",
      "magician", "dance-performance", "karaoke", "games", "photo-booth", "none",
    ])).optional(),
    musicGenre: optionalShortText(80),
    specialPerformances: longText("Special performances", 200),
    activitiesNotes: longText("Activities notes", 300),
  }),

  // ── invitations ────────────────────────────────────────────────────────────
  "invitations": z.object({
    inviteStyle: z.enum(["digital", "printed", "both", "none"]).optional(),
    saveTheDateRequired: z.boolean().optional(),
    sendDate: optionalFutureDate(),
    rsvpDeadline: optionalFutureDate(),
    inviteNotes: longText("Invitation notes", 200),
  }).refine((data) => {
    if (!data.sendDate || !data.rsvpDeadline) return true;
    return new Date(data.rsvpDeadline) >= new Date(data.sendDate);
  }, {
    message: "RSVP deadline must be on or after the send date",
    path: ["rsvpDeadline"],
  }),

  // ── transport ──────────────────────────────────────────────────────────────
  "transport": z.object({
    guestTransportRequired: z.boolean().optional(),
    transportType: z.enum(["bus", "car-pool", "luxury-cars", "shuttle", "none"]).optional(),
    parkingAvailable: z.boolean().optional(),
    accommodationRequired: z.boolean().optional(),
    transportNotes: longText("Transport notes", 300),
  }),

  // ── photography ────────────────────────────────────────────────────────────
  "photography": z.object({
    photographyStyle: z.enum(["candid", "traditional", "cinematic", "documentary", "fine-art", "mixed"]).optional(),
    coverageHours: z.coerce.number().min(1).max(24).optional(),
    videoRequired: z.boolean().optional(),
    droneRequired: z.boolean().optional(),
    photosNotes: longText("Photography notes", 300),
  }),

  // ── Wedding-specific steps ─────────────────────────────────────────────────
  "wedding-details": z.object({
    groomName: shortText("Groom name", 60),
    brideName: shortText("Bride name", 60),
    ceremonyType: z.enum([
      "hindu", "christian", "muslim", "sikh", "jain", "buddhist", "civil", "inter-faith",
    ], { invalid_type_error: "Select a ceremony type" }),
    religion: optionalShortText(50),
    weddingStyle: z.enum(["intimate", "grand", "destination", "court-marriage", "unsure"]).optional(),
    preweddingEvents: z.array(z.enum([
      "mehendi", "sangeet", "haldi", "bachelor-party", "bachelorette", "roka", "engagement",
    ])).optional(),
  }),

  "ceremony-reception": z.object({
    separateVenues: z.boolean().optional(),
    ceremonyVenue: optionalShortText(120),
    receptionVenue: optionalShortText(120),
    ceremonyDuration: z.coerce.number().min(15).max(480).optional(), // minutes
    receptionDuration: z.coerce.number().min(30).max(720).optional(),
    rituals: longText("Rituals", 300),
    firstDance: z.boolean().optional(),
    vows: z.enum(["traditional", "custom", "both"]).optional(),
  }),

  "attire": z.object({
    bridalWear: optionalShortText(100),
    groomAttire: optionalShortText(100),
    bridesmaidsAttire: optionalShortText(100),
    groomsmenAttire: optionalShortText(100),
    hairMakeup: z.boolean().optional(),
    attireNotes: longText("Attire notes", 300),
  }),

  "honeymoon": z.object({
    honeymoonDestination: optionalShortText(100),
    honeymoonDates: optionalShortText(50),
    honeymoonNotes: longText("Honeymoon notes", 200),
  }),

  // ── Birthday-specific ──────────────────────────────────────────────────────
  "birthday-details": z.object({
    celebrantName: shortText("Celebrant name", 60),
    celebrantAge: z.coerce.number().int().min(1).max(120),
    ageGroup: z.enum(["toddler", "child", "teen", "adult", "senior"]).optional(),
    partyVibe: z.enum(["intimate", "medium", "big-bash", "surprise"]).optional(),
    surpriseParty: z.boolean().optional(),
  }),

  "cake": z.object({
    cakeFlavour: optionalShortText(80),
    cakeTiers: z.coerce.number().int().min(1).max(10).optional(),
    cakeDesign: optionalShortText(100),
    dessertsRequired: z.boolean().optional(),
    cakeNotes: longText("Cake notes", 200),
  }),

  // ── Corporate-specific ─────────────────────────────────────────────────────
  "corporate-details": z.object({
    companyName: optionalShortText(100),
    eventObjective: z.enum([
      "team-building", "product-launch", "conference", "awards-gala",
      "client-entertainment", "annual-day", "training", "networking", "other",
    ], { invalid_type_error: "Select an event objective" }),
    eventFormat: z.enum(["in-person", "virtual", "hybrid"]),
    targetAudience: z.enum(["employees-only", "clients", "media", "mixed", "public"]).optional(),
    brandingRequired: z.boolean().optional(),
    internalExternal: z.enum(["internal", "external", "both"]).optional(),
  }),

  "agenda": z.object({
    agendaItems: z.array(z.object({
      time: optionalShortText(20),
      title: shortText("Item title", 80),
      duration: z.coerce.number().min(5).optional(),
    })).optional(),
    keynoteSpeakers: z.coerce.number().int().min(0).optional(),
    breakoutSessions: z.coerce.number().int().min(0).optional(),
    networkingTime: z.boolean().optional(),
    agendaNotes: longText("Agenda notes", 300),
  }),

  "av-tech": z.object({
    avRequired: z.boolean().optional(),
    projectorRequired: z.boolean().optional(),
    micType: z.enum(["lapel", "handheld", "podium", "multiple", "none"]).optional(),
    liveStream: z.boolean().optional(),
    hybridEvent: z.boolean().optional(),
    techNotes: longText("Tech notes", 300),
  }),

  "branding": z.object({
    brandingItems: z.array(z.string()).optional(),
    signageRequired: z.boolean().optional(),
    swagBags: z.boolean().optional(),
    sponsorLogos: z.boolean().optional(),
    brandingNotes: longText("Branding notes", 300),
  }),

  // ── Concert-specific ───────────────────────────────────────────────────────
  "concert-details": z.object({
    artistName: shortText("Artist / band name", 100),
    genre: optionalShortText(60),
    numberOfActs: z.coerce.number().int().min(1).max(20).optional(),
    ticketType: z.enum(["free", "paid", "invite-only"]),
    ageRestriction: z.enum(["all-ages", "18+", "21+"]).optional(),
    concertNotes: longText("Concert notes", 300),
  }),

  "stage-production": z.object({
    stageSize: z.enum(["small", "medium", "large", "outdoor-mainstage"]).optional(),
    soundSystem: z.boolean().optional(),
    lightingRig: z.boolean().optional(),
    screenRequired: z.boolean().optional(),
    backstaageRooms: z.coerce.number().int().min(0).optional(),
    productionNotes: longText("Production notes", 300),
  }),

  "ticketing": z.object({
    ticketTiers: z.coerce.number().int().min(1).max(10).optional(),
    ticketPrice: z.coerce.number().min(0).optional(),
    ticketPlatform: optionalShortText(80),
    gateManagement: z.enum(["wristbands", "qr-codes", "guest-list", "open"]).optional(),
    ticketingNotes: longText("Ticketing notes", 200),
  }),

  "security-permits": z.object({
    permitsRequired: z.boolean().optional(),
    securityStaff: z.coerce.number().int().min(0).optional(),
    crowdCapacity: z.coerce.number().int().positive().optional(),
    emergencyPlan: z.boolean().optional(),
    securityNotes: longText("Security notes", 300),
  }),

  // ── Party-specific ─────────────────────────────────────────────────────────
  "party-details": z.object({
    partyType: z.enum([
      "house-party", "pool-party", "rooftop", "theme-night",
      "dinner-party", "cocktail-party", "kids-party", "other",
    ]).optional(),
    dressCode: z.enum(["casual", "smart-casual", "formal", "theme", "none"]).optional(),
    partyTheme: optionalShortText(80),
    outdoorIndoor: z.enum(["indoor", "outdoor", "both"]).optional(),
    partyNotes: longText("Party notes", 300),
  }),

  // ── Engagement-specific ────────────────────────────────────────────────────
  "engagement-details": z.object({
    partnerOneName: shortText("Partner 1 name", 60),
    partnerTwoName: shortText("Partner 2 name", 60),
    ceremonyStyle: z.enum(["traditional", "modern", "intimate", "public"]).optional(),
    customTraditions: longText("Custom traditions", 200),
    engagementNotes: longText("Engagement notes", 300),
  }),

  // ── Baby Shower-specific ───────────────────────────────────────────────────
  "shower-details": z.object({
    parentName: shortText("Parent / couple name", 80),
    dueDate: optionalFutureDate(),
    genderReveal: z.boolean().optional(),
    babyGender: z.enum(["boy", "girl", "surprise", "twins"]).optional(),
    registryLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    showerNotes: longText("Shower notes", 300),
  }),

  // ── Puja-specific ──────────────────────────────────────────────────────────
  "puja-details": z.object({
    ceremonyType: z.enum([
      "satyanarayan-puja", "griha-pravesh", "namkaran", "mundan",
      "annaprashan", "navratri-puja", "ganpati", "other",
    ], { invalid_type_error: "Select a ceremony type" }),
    panditRequired: z.boolean().optional(),
    muhuratTime: timeString(),
    deity: optionalShortText(60),
    customRituals: longText("Custom rituals", 200),
    pujaItems: longText("Puja items / samagri needed", 300),
  }),

  // ── Final review step (no schema needed — read-only) ──────────────────────
  "review": z.object({}),
};

// ─── Validate a single step ───────────────────────────────────────────────────

/**
 * Validate form data for a given step.
 * Returns { success: true } or { success: false, errors: { fieldName: errorMessage } }
 *
 * @param {string} stepId   - step id from eventSteps.js
 * @param {object} formData - raw form data object
 */
export function validateStep(stepId, formData) {
  const schema = schemas[stepId];
  if (!schema) return { success: true }; // unknown step — skip validation

  const result = schema.safeParse(formData);
  if (result.success) return { success: true };

  const errors = {};
  result.error.errors.forEach((err) => {
    const field = err.path.join(".");
    if (!errors[field]) errors[field] = err.message;
  });

  return { success: false, errors };
}
