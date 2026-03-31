"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  PenLine,
  Plus,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  Linkedin,
  Trash2,
  Save,
  X,
  Link as LinkIcon,
} from "lucide-react";

const PLATFORM_OPTIONS = [
  { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "@yourname" },
  { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "facebook.com/yourpage" },
  { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "youtube.com/@yourchannel" },
  { key: "website", label: "Website", icon: Globe, placeholder: "yourwebsite.com" },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "linkedin.com/in/yourname" },
];

function getPlatformIcon(platform) {
  return PLATFORM_OPTIONS.find((item) => item.key === platform)?.icon || LinkIcon;
}

function getSocialHref(platform, value) {
  const trimmed = value.trim();
  if (!trimmed) return "#";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  switch (platform) {
    case "instagram": {
      const handle = trimmed.replace("@", "");
      return `https://instagram.com/${handle}`;
    }
    case "facebook":
    case "youtube":
    case "linkedin":
    case "website":
    default:
      return `https://${trimmed}`;
  }
}

export function ProfileHeroCard() {
  const [bio, setBio] = useState(
    "Wedding organizer focused on elegant experiences, smooth coordination, and premium event execution."
  );
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(bio);

  const [socialLinks, setSocialLinks] = useState([
    { id: "1", platform: "instagram", value: "@akshay.weddings" },
    { id: "2", platform: "website", value: "akshayyadav.events" },
  ]);

  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [platform, setPlatform] = useState("instagram");
  const [socialValue, setSocialValue] = useState("");

  const addPopoverRef = useRef(null);
  const addButtonRef = useRef(null);

  const selectedPlatform = useMemo(
    () => PLATFORM_OPTIONS.find((item) => item.key === platform) || PLATFORM_OPTIONS[0],
    [platform]
  );

  useEffect(() => {
    function handlePointerDown(event) {
      const popoverEl = addPopoverRef.current;
      const buttonEl = addButtonRef.current;

      if (
        popoverEl &&
        !popoverEl.contains(event.target) &&
        buttonEl &&
        !buttonEl.contains(event.target)
      ) {
        setIsAddingSocial(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsAddingSocial(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSaveBio = () => {
    const next = bioDraft.trim();
    setBio(next || bio);
    setIsEditingBio(false);
  };

  const handleCancelBio = () => {
    setBioDraft(bio);
    setIsEditingBio(false);
  };

  const handleAddSocial = () => {
    const value = socialValue.trim();
    if (!value) return;

    setSocialLinks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        platform,
        value,
      },
    ]);

    setSocialValue("");
    setPlatform("instagram");
    setIsAddingSocial(false);
  };

  const handleRemoveSocial = (id) => {
    setSocialLinks((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="mx-auto mt-5 w-[95%] overflow-visible rounded-3xl bg-white shadow-md">
      {/* Cover */}
      <div className="relative h-[20vh] rounded-t-3xl bg-gradient-to-br from-indigo-200 via-purple-200 to-slate-100 px-5 py-5 md:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.65),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(201,76,115,0.14),transparent_24%)]" />

        <div className="relative z-10 flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-5">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg">
            <Image
              src="https://images.pexels.com/photos/2095597/pexels-photo-2095597.jpeg"
              alt="Profile picture"
              fill
              className="object-cover"
              unoptimized
            />

            <button
              type="button"
              className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-black/80 text-white shadow-sm transition hover:bg-black"
              aria-label="Change profile picture"
            >
              <Camera size={14} />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Akshay Yadav
            </h2>
            <p className="mt-1 text-sm text-slate-600">Organizer</p>
          </div>
        </div>

        <div className="absolute right-4 top-4 z-10 w-[40vw] rounded-3xl border border-white/60 bg-white/50 p-4 shadow-sm backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between gap-3">
            {!isEditingBio ? (
              <button
                type="button"
                onClick={() => {
                  setBioDraft(bio);
                  setIsEditingBio(true);
                }}
                className="inline-flex items-center gap-2 rounded-md bg-[#C94C73] px-2 py-1 text-xs font-medium text-white transition hover:bg-[#b84267]"
              >
                <PenLine size={13} />
                Edit bio
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveBio}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700"
                >
                  <Save size={13} />
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelBio}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <X size={13} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!isEditingBio ? (
            <p className="text-sm leading-6 text-slate-700">{bio}</p>
          ) : (
            <textarea
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              className="h-[20vh] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-[#C94C73] focus:ring-2 focus:ring-[#f4d8e1]"
              placeholder="Write your profile bio..."
              autoFocus
            />
          )}
        </div>
      </div>

      {/* Bottom section */}
      <div className="w-full px-5 py-5 md:px-6">
        <div className="flex items-start justify-between gap-6">
          {/* Stats */}
          <div className="flex gap-10">
            <Stat label="Posts" value="938" />
            <Stat label="Followers" value="3,586" />
            <Stat label="Following" value="2,659" />
          </div>

          {/* Social section */}
          <div className="relative flex  items-end gap-3 overflow-visible">
            

            {isAddingSocial && (
              <div
                ref={addPopoverRef}
                className="absolute right-0 top-0 z-30 mt-3 w-[30vw] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
              >
                <div className="mb-3 flex gap-2">
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-[40%] rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                  >
                    {PLATFORM_OPTIONS.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>

                  <input
                    value={socialValue}
                    onChange={(e) => setSocialValue(e.target.value)}
                    placeholder={selectedPlatform.placeholder}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingSocial(false);
                      setSocialValue("");
                      setPlatform("instagram");
                    }}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddSocial}
                    className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2">
              {socialLinks.map((item) => {
                const Icon = getPlatformIcon(item.platform);
                const href = getSocialHref(item.platform, item.value);

                return (
                  <div
                    key={item.id}
                    className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:bg-[#fff7fa]"
                  >
                    <Link
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${item.platform}`}
                      className="inline-flex items-center justify-center text-[#9a2143]"
                    >
                      <Icon size={18} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleRemoveSocial(item.id)}
                      className="text-slate-400 transition hover:text-red-500"
                      aria-label={`Remove ${item.platform}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              ref={addButtonRef}
              type="button"
              onClick={() => setIsAddingSocial((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full bg-[#C94C73] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#b84267]"
            >
              <Plus size={14} />
              Add social handle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}