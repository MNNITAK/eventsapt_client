import {
  CalendarDays,
  Camera,
  HeartHandshake,
  MapPin,
  Music2,
  PartyPopper,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";

export const EVENT_ICON_MAP = {
  venue: MapPin,
  catering: UtensilsCrossed,
  photography: Camera,
  music: Music2,
  decor: Sparkles,
  celebration: PartyPopper,
  partnership: HeartHandshake,
  schedule: CalendarDays,
};

export const UPCOMING_EVENTS = [
  {
    id: "evt-101",
    icon: "venue",
    title: "Venue Finalization Visit",
    description:
      "Shortlist the final venue, confirm guest capacity, and lock the wedding dates.",
    progress: 42,
    daysLeft: 18,
    updates: 4,
    location: "Jaipur",
    guestCount: 240,
    lastUpdated: "2 hours ago",
    priority: "High",
  },
  {
    id: "evt-102",
    icon: "catering",
    title: "Food Tasting Session",
    description:
      "Finalize menu combinations, dessert counter, and live station preferences.",
    progress: 67,
    daysLeft: 11,
    updates: 2,
    location: "Udaipur",
    guestCount: 240,
    lastUpdated: "Today",
    priority: "High",
  },
  {
    id: "evt-103",
    icon: "photography",
    title: "Pre-Wedding Shoot",
    description:
      "Plan outfits, locations, and storyboard for the pre-wedding shoot day.",
    progress: 28,
    daysLeft: 24,
    updates: 6,
    location: "Goa",
    guestCount: 6,
    lastUpdated: "4 hours ago",
    priority: "Medium",
  },
  {
    id: "evt-104",
    icon: "decor",
    title: "Decor Theme Approval",
    description:
      "Review floral palette, stage design, lighting, and entry arch concepts.",
    progress: 54,
    daysLeft: 14,
    updates: 3,
    location: "Delhi NCR",
    guestCount: 180,
    lastUpdated: "1 day ago",
    priority: "Medium",
  },
];

export const PAST_EVENTS = [
  {
    id: "evt-201",
    icon: "celebration",
    title: "Engagement Night",
    description:
      "A warm, intimate celebration with family, music, and candid photography.",
    progress: 100,
    completedOn: "12 Feb 2026",
    updates: 8,
    location: "Bengaluru",
    guestCount: 120,
    lastUpdated: "Completed",
    rating: 4.9,
    priority: "Done",
  },
  {
    id: "evt-202",
    icon: "partnership",
    title: "Haldi Ceremony",
    description:
      "Bright, traditional ritual ceremony with vibrant decor and family rituals.",
    progress: 100,
    completedOn: "15 Feb 2026",
    updates: 5,
    location: "Jaipur",
    guestCount: 140,
    lastUpdated: "Completed",
    rating: 5.0,
    priority: "Done",
  },
  {
    id: "evt-203",
    icon: "music",
    title: "Sangeet Night",
    description:
      "A lively evening of performances, music, dance, and guest interactions.",
    progress: 100,
    completedOn: "18 Feb 2026",
    updates: 7,
    location: "Udaipur",
    guestCount: 220,
    lastUpdated: "Completed",
    rating: 4.8,
    priority: "Done",
  },
];