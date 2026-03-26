import {
  Archive,
  BellOff,
  HeartHandshake,
  Image as ImageIcon,
  MessageSquareMore,
  Pin,
  Star,
  Users,
} from "lucide-react";

export const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "starred", label: "Starred" },
  { key: "archived", label: "Archived" },
];

export const INITIAL_CONTACTS = [
  {
    id: "c1",
    name: "Aarav & Meera",
    role: "Wedding Client",
    initials: "AM",
    avatarGradient: "from-rose-500 to-pink-500",
    online: true,
    unreadCount: 2,
    archived: false,
    starred: true,
    muted: false,
    lastSeen: "2m ago",
    lastMessage: "Can we lock the Jaipur venue by tomorrow?",
    updatedAt: "09:42",
  },
  {
    id: "c2",
    name: "Royal Palace Venue",
    role: "Venue Partner",
    initials: "RP",
    avatarGradient: "from-violet-500 to-indigo-500",
    online: false,
    unreadCount: 0,
    archived: false,
    starred: false,
    muted: false,
    lastSeen: "18m ago",
    lastMessage: "We have two premium dates available next weekend.",
    updatedAt: "Yesterday",
  },
  {
    id: "c3",
    name: "Studio LensCraft",
    role: "Photography",
    initials: "SL",
    avatarGradient: "from-emerald-500 to-teal-500",
    online: true,
    unreadCount: 1,
    archived: false,
    starred: true,
    muted: false,
    lastSeen: "Online",
    lastMessage: "Sharing the pre-wedding reel cut now.",
    updatedAt: "11:06",
  },
  {
    id: "c4",
    name: "The Decor House",
    role: "Decor Vendor",
    initials: "DH",
    avatarGradient: "from-amber-500 to-orange-500",
    online: false,
    unreadCount: 0,
    archived: true,
    starred: false,
    muted: true,
    lastSeen: "2d ago",
    lastMessage: "Final floral palette has been approved.",
    updatedAt: "Mon",
  },
  {
    id: "c5",
    name: "Music & Motion",
    role: "Entertainment",
    initials: "MM",
    avatarGradient: "from-fuchsia-500 to-purple-500",
    online: false,
    unreadCount: 3,
    archived: false,
    starred: false,
    muted: true,
    lastSeen: "1h ago",
    lastMessage: "DJ set list and first dance track shortlist attached.",
    updatedAt: "08:14",
  },
];

export const INITIAL_THREADS = {
  c1: [
    {
      id: "m1",
      sender: "them",
      text: "We love the Jaipur shortlist. Can you also share a mandap decor reference?",
      createdAt: "09:20",
      attachments: [],
    },
    {
      id: "m2",
      sender: "me",
      text: "Absolutely. I am sending a clean premium board in the next message.",
      createdAt: "09:23",
      attachments: [],
    },
  ],
  c2: [
    {
      id: "m1",
      sender: "them",
      text: "These dates are still open, and we can block them for 48 hours.",
      createdAt: "Yesterday",
      attachments: [],
    },
  ],
  c3: [
    {
      id: "m1",
      sender: "them",
      text: "Here is the reel draft. I also attached the raw clips.",
      createdAt: "11:00",
      attachments: [
        // Example only; real files are added from the composer
      ],
    },
  ],
  c4: [
    {
      id: "m1",
      sender: "them",
      text: "Final floral palette has been approved.",
      createdAt: "Mon",
      attachments: [],
    },
  ],
  c5: [
    {
      id: "m1",
      sender: "them",
      text: "DJ set list and first dance track shortlist attached.",
      createdAt: "08:00",
      attachments: [],
    },
  ],
};

export const SIDEBAR_SETTINGS = [
  {
    key: "hideMuted",
    label: "Hide muted chats",
    description: "Keep the list clean and focused.",
    icon: BellOff,
  },
  {
    key: "compactList",
    label: "Compact list",
    description: "Show more contacts in less space.",
    icon: MessageSquareMore,
  },
  {
    key: "showArchived",
    label: "Show archived",
    description: "Keep archived chats visible in the list.",
    icon: Archive,
  },
  {
    key: "showStarred",
    label: "Starred priority",
    description: "Push starred chats to the top.",
    icon: Star,
  },
  {
    key: "pinFavorites",
    label: "Pin favorites",
    description: "Pin important chats for quick access.",
    icon: Pin,
  },
  {
    key: "showGroups",
    label: "Group-first mode",
    description: "Prioritize group conversations.",
    icon: Users,
  },
  {
    key: "showAttachments",
    label: "Attachment quick view",
    description: "Highlight recent images and docs.",
    icon: ImageIcon,
  },
  {
    key: "showTrusted",
    label: "Trusted contacts",
    description: "Prioritize high-response conversations.",
    icon: HeartHandshake,
  },
];