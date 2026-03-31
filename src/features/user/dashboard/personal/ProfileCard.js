"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
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

export function ProfileHeroCard() {
  const [bio, setBio] = useState(
    "Wedding organizer focused on elegant experiences, smooth coordination, and premium event execution."
  );
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(bio);

  const [socialLinks, setSocialLinks] = useState([
    {
      id: "1",
      platform: "instagram",
      value: "@akshay.weddings",
    },
    {
      id: "2",
      platform: "website",
      value: "akshayyadav.events",
    },
  ]);

  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [platform, setPlatform] = useState("instagram");
  const [socialValue, setSocialValue] = useState("");

  const selectedPlatform = useMemo(
    () => PLATFORM_OPTIONS.find((item) => item.key === platform) || PLATFORM_OPTIONS[0],
    [platform]
  );

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
    <div className="mx-auto mt-5 w-[95%] overflow-hidden rounded-3xl bg-white shadow-md">
      {/* Cover */}
      <div className="relative h-[20vh] bg-gradient-to-br from-indigo-200 via-purple-200 to-slate-100 px-5 py-5 md:px-6">
        <div className="absolute inset-0 flex bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.65),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(201,76,115,0.14),transparent_24%)]" />

        {/* Avatar + Name + bio */}
        <div className="relative z-10 flex items-center flex-col gap-4 md:flex-row md:items-center md:gap-5">
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
        <div className="absolute top-4 z-10  right-4 w-[40vw] border border-white/60 bg-white/50 p-4 shadow-sm backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
               
              </div>

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
      <div className="px-5 py-5 md:px-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Stat label="Posts" value="938" />
            <Stat label="Followers" value="3,586" />
            <Stat label="Following" value="2,659" />
          </div>

          {/* Social handles */}
          {/* <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Social handles
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Add your Instagram, Facebook, website, or other public links.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingSocial((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-[#9a2143] shadow-sm transition hover:bg-[#fff7fa]"
              >
                <Plus size={13} />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => {
                const platformMeta =
                  PLATFORM_OPTIONS.find((p) => p.key === item.platform) ||
                  PLATFORM_OPTIONS[0];
                const Icon = platformMeta.icon;

                return (
                  <div
                    key={item.id}
                    className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:shadow-md"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f4d8e1] text-[#9a2143]">
                      <Icon size={14} />
                    </span>

                    <div className="min-w-0">
                      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
                        {platformMeta.label}
                      </div>
                      <div className="max-w-[180px] truncate text-sm font-medium text-slate-800">
                        {item.value}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSocial(item.id)}
                      className="ml-1 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                      aria-label={`Remove ${platformMeta.label}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}

              {socialLinks.length === 0 && (
                <div className="rounded-full border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-500">
                  No social handles added yet.
                </div>
              )}
            </div>

            {isAddingSocial && (
              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 md:grid-cols-[180px_1fr_auto]">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Platform
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C94C73] focus:ring-2 focus:ring-[#f4d8e1]"
                    >
                      {PLATFORM_OPTIONS.map((item) => (
                        <option key={item.key} value={item.key}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Handle / URL
                    </label>
                    <div className="relative">
                      <LinkIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input
                        value={socialValue}
                        onChange={(e) => setSocialValue(e.target.value)}
                        placeholder={selectedPlatform.placeholder}
                        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#C94C73] focus:ring-2 focus:ring-[#f4d8e1]"
                      />
                    </div>
                  </div>

                  <div className="flex items-end gap-2">
                    <button
                      type="button"
                      onClick={handleAddSocial}
                      className="inline-flex h-[46px] items-center justify-center rounded-2xl bg-[#C94C73] px-4 text-sm font-medium text-white transition hover:bg-[#b84267]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-4 text-center">
      <p className="text-xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}