"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Bookmark,
  FileImage,
  Film,
  Grid3X3,
  Play,
  Sparkles,
} from "lucide-react";

const TABS = [
  { key: "all", label: "All Saved", icon: Grid3X3 },
  { key: "posts", label: "Posts", icon: FileImage },
  { key: "reels", label: "Reels", icon: Film },
];

export default function SavedContentGallery({
  savedPosts = [],
  savedReels = [],
  title = "Saved",
}) {
  const [activeTab, setActiveTab] = useState("all");
  const tabBarRef = useRef(null);
  const tabRefs = useRef([]);
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    ready: false,
  });

  const normalizedItems = useMemo(() => {
    const posts = (savedPosts || []).map((item) => ({
      ...item,
      kind: "post",
      savedAt: item.savedAt || item.createdAt || new Date().toISOString(),
    }));

    const reels = (savedReels || []).map((item) => ({
      ...item,
      kind: "reel",
      savedAt: item.savedAt || item.createdAt || new Date().toISOString(),
    }));

    return [...posts, ...reels].sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
  }, [savedPosts, savedReels]);

  const visibleItems = useMemo(() => {
    if (activeTab === "all") return normalizedItems;
    return normalizedItems.filter((item) => item.kind === activeTab.slice(0, -1));
  }, [activeTab, normalizedItems]);

  const activeIndex = useMemo(
    () => Math.max(0, TABS.findIndex((tab) => tab.key === activeTab)),
    [activeTab]
  );

  useEffect(() => {
    const updateIndicator = () => {
      const tabEl = tabRefs.current[activeIndex];
      const barEl = tabBarRef.current;
      if (!tabEl || !barEl) return;

      setIndicator({
        left: tabEl.offsetLeft,
        width: tabEl.offsetWidth,
        ready: true,
      });
    };

    const raf = requestAnimationFrame(updateIndicator);

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined" && tabBarRef.current) {
      resizeObserver = new ResizeObserver(updateIndicator);
      resizeObserver.observe(tabBarRef.current);
    }

    window.addEventListener("resize", updateIndicator);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateIndicator);
      resizeObserver?.disconnect();
    };
  }, [activeIndex]);

  return (
    <section className="w-[95%] mx-auto">
      <div className="mb-5 flex items-start justify-between gap-4">
      </div>

      <div
        ref={tabBarRef}
        className="relative rounded-3xl border border-slate-200 bg-slate-100 p-1 shadow-sm"
      >
        <div
          aria-hidden="true"
          className="absolute top-1 bottom-1 rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out"
          style={{
            left: indicator.left,
            width: indicator.width,
            opacity: indicator.ready ? 1 : 0,
          }}
        />

        <div className="relative grid grid-cols-3">
          {TABS.map((tab, index) => {
            const Icon = tab.icon;
            const active = tab.key === activeTab;

            return (
              <button
                key={tab.key}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative z-10 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  active ? "text-[#9a2143]" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-[#C94C73]" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {visibleItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <SavedCard key={`${item.kind}-${item.id}`} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState activeTab={activeTab} />
        )}
      </div>
    </section>
  );
}

const SavedCard = memo(function SavedCard({ item }) {
  const isReel = item.kind === "reel";
  const imageUrl =
    item.coverUrl ||
    item.thumbnailUrl ||
    item.imageUrl ||
    item.posterUrl ||
    "";

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/5] w-full bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.title || "Saved content"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <Bookmark className="h-10 w-10 text-slate-400" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur">
          {isReel ? (
            <>
              <Film className="h-3.5 w-3.5 text-[#C94C73]" />
              Reel
            </>
          ) : (
            <>
              <FileImage className="h-3.5 w-3.5 text-[#C94C73]" />
              Post
            </>
          )}
        </div>

        {isReel && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white/90 shadow-lg backdrop-blur">
              <Play className="ml-1 h-5 w-5 fill-slate-900 text-slate-900" />
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="line-clamp-2 text-base font-semibold tracking-tight">
            {item.title || "Untitled"}
          </h3>

          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-white/80">
            <span>{formatDate(item.savedAt)}</span>
            <span>{isReel ? formatCount(item.views) + " views" : formatCount(item.likes) + " likes"}</span>
          </div>
        </div>
      </div>
    </article>
  );
});

function EmptyState({ activeTab }) {
  const label =
    activeTab === "posts" ? "posts" : activeTab === "reels" ? "reels" : "saved items";

  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f4d8e1] text-[#9a2143]">
        <Bookmark className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        No {label} found
      </h3>
      <p className="mt-2 text-sm text-slate-500">
        Saved content will appear here once the user bookmarks a post or reel.
      </p>
    </div>
  );
}

function formatCount(value) {
  const n = Number(value || 0);
  if (Number.isNaN(n)) return "0";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${n}`;
}

function formatDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}