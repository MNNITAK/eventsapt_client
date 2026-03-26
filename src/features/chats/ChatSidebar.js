"use client";

import { useState } from "react";
import {
  Archive,
  Search,
  Settings2,
  Sparkles,
  Star,
  BellOff,
  Pin,
  Users,
  Image as ImageIcon,
  HeartHandshake,
} from "lucide-react";
import { SIDEBAR_SETTINGS } from "@/components/chat/chat-data";

export default function ChatSidebar({
  contacts,
  allContacts,
  activeContactId,
  activeFilter,
  onFilterChange,
  search,
  onSearchChange,
  settings,
  onSettingsChange,
  onSelectContact,
  filters,
}) {
  const [showSettings, setShowSettings] = useState(true);

  const counts = {
    all: allContacts.length,
    unread: allContacts.filter((c) => c.unreadCount > 0).length,
    starred: allContacts.filter((c) => c.starred).length,
    archived: allContacts.filter((c) => c.archived).length,
  };

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-[#fbfafc]">
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Chats
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search, filter, and manage conversations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSettings((prev) => !prev)}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
            aria-label="Toggle chat settings"
          >
            <Settings2 className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chats..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#C94C73] focus:ring-2 focus:ring-[#f4d8e1]"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((item) => {
            const active = activeFilter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onFilterChange(item.key)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-[#f4d8e1] text-[#9a2143]"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {item.label} · {counts[item.key]}
              </button>
            );
          })}
        </div>
      </div>

      {showSettings && (
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-[#C94C73]" />
            Left panel settings
          </div>

          <div className="space-y-2">
            {SIDEBAR_SETTINGS.map((setting) => (
              <ToggleRow
                key={setting.key}
                title={setting.label}
                description={setting.description}
                enabled={settings[setting.key]}
                icon={setting.icon}
                onToggle={() =>
                  onSettingsChange((prev) => ({
                    ...prev,
                    [setting.key]: !prev[setting.key],
                  }))
                }
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-3 flex items-center justify-between px-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Contacts
          </p>
          <p className="text-xs text-slate-500">{contacts.length} visible</p>
        </div>

        <div className="space-y-2">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                active={contact.id === activeContactId}
                compact={settings.compactList}
                onClick={() => onSelectContact(contact.id)}
              />
            ))
          ) : (
            <EmptySidebarState />
          )}
        </div>
      </div>
    </aside>
  );
}

function ContactCard({ contact, active, compact, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[24px] border p-3 text-left transition-all duration-200 ${
        active
          ? "border-[#f1c6d5] bg-[#fff7fa] shadow-sm"
          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-sm"
      } ${compact ? "py-2.5" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-semibold text-white shadow-sm ${contact.avatarGradient}`}
        >
          {contact.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {contact.name}
              </h3>
              <p className="truncate text-xs text-slate-500">{contact.role}</p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[11px] text-slate-400">{contact.updatedAt}</span>
              {contact.unreadCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#C94C73] px-1 text-[11px] font-semibold text-white">
                  {contact.unreadCount}
                </span>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <p className="line-clamp-2 text-xs leading-5 text-slate-500">
              {contact.lastMessage}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {contact.starred && (
              <Badge icon={<Star className="h-3.5 w-3.5" />} label="Starred" />
            )}
            {contact.archived && (
              <Badge icon={<Archive className="h-3.5 w-3.5" />} label="Archived" />
            )}
            {contact.muted && (
              <Badge icon={<BellOff className="h-3.5 w-3.5" />} label="Muted" />
            )}
            {contact.online && (
              <Badge
                icon={<span className="h-2 w-2 rounded-full bg-emerald-500" />}
                label="Online"
              />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function Badge({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
      {icon}
      {label}
    </span>
  );
}

function ToggleRow({ title, description, enabled, icon: Icon, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition ${
        enabled
          ? "border-[#f1c6d5] bg-[#fff7fa]"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-medium text-slate-900">{title}</div>
          <span
            className={`h-5 w-9 rounded-full p-0.5 transition ${
              enabled ? "bg-[#C94C73]" : "bg-slate-300"
            }`}
          >
            <span
              className={`block h-4 w-4 rounded-full bg-white transition ${
                enabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </span>
        </div>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </button>
  );
}

function EmptySidebarState() {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-6 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f4d8e1] text-[#9a2143]">
        <Users className="h-6 w-6" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-900">No chats match</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        Try a different filter or search term.
      </p>
    </div>
  );
}