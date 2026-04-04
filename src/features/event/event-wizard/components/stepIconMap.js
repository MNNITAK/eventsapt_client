/**
 * stepIconMap.js
 *
 * Maps the string icon names used in eventSteps.js config
 * to actual lucide-react components.
 *
 * Why strings in config? Because the config is a plain JS data file —
 * importing React components there would create circular deps and make
 * the config harder to serialise / send to the server.
 */

import {
  FileText,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Briefcase,
  Utensils,
  Flower2,
  Music,
  Mail,
  Car,
  Camera,
  CheckCircle,
  Heart,
  PartyPopper,
  Building2,
  Sparkles,
  Gem,
  Baby,
  Sun,
  Mic,
  Layers,
  Ticket,
  ShieldCheck,
  Monitor,
  Tag,
  Target,
  ClipboardList,
  Cake,
  Shirt,
  Plane,
  Circle,
} from "lucide-react";

export const STEP_ICON_MAP = {
  FileText,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Briefcase,
  Utensils,
  Flower2,
  Music,
  Mail,
  Car,
  Camera,
  CheckCircle,
  Heart,
  PartyPopper,
  Building2,
  Sparkles,
  Gem,
  Baby,
  Sun,
  Mic,
  Layers,
  Ticket,
  ShieldCheck,
  Monitor,
  Tag,
  Target,
  ClipboardList,
  Cake,
  Shirt,
  Plane,
  Circle, // fallback
};
