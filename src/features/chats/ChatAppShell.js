"use client";

import { useMemo, useState } from "react";
import ChatSidebar from "./ChatSidebar.js";
import ChatWindow from "./ChatWindow.js";
import { FILTERS, INITIAL_CONTACTS, INITIAL_THREADS } from "./chat-data.js";

export  function ChatAppShell() {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeContactId, setActiveContactId] = useState(null);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [settings, setSettings] = useState({
    hideMuted: false,
    compactList: false,
    showArchived: true,
    showStarred: true,
    pinFavorites: true,
    showGroups: true,
    showAttachments: true,
    showTrusted: false,
  });

  const activeContact = useMemo(
    () => contacts.find((contact) => contact.id === activeContactId) || null,
    [contacts, activeContactId]
  );

  const visibleContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    let list = [...contacts];

    if (query) {
      list = list.filter((contact) => {
        const haystack = [
          contact.name,
          contact.role,
          contact.lastMessage,
          contact.lastSeen,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    if (activeFilter === "unread") list = list.filter((c) => c.unreadCount > 0);
    if (activeFilter === "starred") list = list.filter((c) => c.starred);
    if (activeFilter === "archived") list = list.filter((c) => c.archived);

    if (settings.hideMuted) list = list.filter((c) => !c.muted);
    if (!settings.showArchived) list = list.filter((c) => !c.archived);
    if (!settings.showStarred) list = list.filter((c) => !c.starred);

    if (settings.pinFavorites) {
      list.sort((a, b) => Number(b.starred) - Number(a.starred));
    }

    if (settings.showTrusted) {
      list.sort((a, b) => Number(b.online) - Number(a.online));
    }

    return list;
  }, [contacts, activeFilter, search, settings]);

  const handleSelectContact = (contactId) => {
    setActiveContactId(contactId);
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId ? { ...contact, unreadCount: 0 } : contact
      )
    );
  };

  const handleSendMessage = ({ text, files }) => {
    if (!activeContactId) return;

    const trimmed = text.trim();
    if (!trimmed && (!files || files.length === 0)) return;

    const nextMessage = {
      id: `m-${Date.now()}`,
      sender: "me",
      text: trimmed,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      attachments: files || [],
    };

    setThreads((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), nextMessage],
    }));

    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === activeContactId
          ? {
              ...contact,
              lastMessage: trimmed || (files?.length ? `${files.length} file(s)` : ""),
              updatedAt: "Just now",
              unreadCount: 0,
            }
          : contact
      )
    );
  };

  return (
    <div className="grid w-[95%] mt-5 mb-5 mx-auto h-[84vh] overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[360px_1fr]">
      <ChatSidebar
        contacts={visibleContacts}
        allContacts={contacts}
        activeContactId={activeContactId}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        search={search}
        onSearchChange={setSearch}
        settings={settings}
        onSettingsChange={setSettings}
        onSelectContact={handleSelectContact}
        filters={FILTERS}
      />

      <ChatWindow
        contact={activeContact}
        messages={activeContactId ? threads[activeContactId] || [] : []}
        onSendMessage={handleSendMessage}
        settings={settings}
      />
    </div>
  );
}