"use client";

import { useEffect, useRef,useState } from "react";
import {
  CheckCheck,
  Clock3,
  Headphones,
  PhoneCall,
  Sparkles,
  Video,
} from "lucide-react";
import ChatComposer from "@/components/chat/ChatComposer";

export default function ChatWindow({ contact, messages, onSendMessage, settings }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [contact, messages]);

  if (!contact) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(201,76,115,0.08),_transparent_35%),linear-gradient(180deg,#ffffff,#fbf9fb)] px-8 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-[#f4d8e1] text-[#9a2143] shadow-sm">
          <Sparkles className="h-8 w-8" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
          Open a conversation
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
          Pick a contact from the left panel to start chatting. This right panel
          stays empty until a conversation is selected.
        </p>
      </div>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col bg-[radial-gradient(circle_at_top,_rgba(201,76,115,0.05),_transparent_30%),linear-gradient(180deg,#ffffff,#fbf9fb)]">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-semibold text-white shadow-sm ${contact.avatarGradient}`}
          >
            {contact.initials}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                {contact.name}
              </h2>
              {contact.online ? (
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
                  Online
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
                  Last seen {contact.lastSeen}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">{contact.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {settings.disappearingMode && (
            <span className="hidden rounded-full bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 md:inline-flex">
              Disappearing mode
            </span>
          )}
          <ActionIcon icon={<PhoneCall className="h-4.5 w-4.5" />} />
          <ActionIcon icon={<Video className="h-4.5 w-4.5" />} />
          <ActionIcon icon={<Headphones className="h-4.5 w-4.5" />} />
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
              <p className="text-sm font-medium text-slate-900">
                Start the conversation
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Send a message, attach files, and the thread will grow here.
              </p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-200 bg-white px-5 py-4">
        <ChatComposer onSend={onSendMessage} />
      </div>
    </section>
  );
}

function ActionIcon({ icon }) {
  return (
    <button
      type="button"
      className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
    >
      {icon}
    </button>
  );
}

function MessageBubble({ message }) {
  const mine = message.sender === "me";

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[min(640px,85%)] rounded-[24px] px-4 py-3 shadow-sm ${
          mine
            ? "bg-[#C94C73] text-white"
            : "border border-slate-200 bg-white text-slate-900"
        }`}
      >
        {message.text?.trim() && (
          <p className="whitespace-pre-wrap text-sm leading-6">{message.text}</p>
        )}

        {message.attachments?.length > 0 && (
          <div className={`mt-3 grid gap-2 ${mine ? "grid-cols-2" : "grid-cols-2"}`}>
            {message.attachments.map((file, idx) => (
              <AttachmentPreview key={`${file.name}-${idx}`} file={file} mine={mine} />
            ))}
          </div>
        )}

        <div
          className={`mt-2 flex items-center justify-end gap-1 text-[11px] ${
            mine ? "text-white/80" : "text-slate-400"
          }`}
        >
          <Clock3 className="h-3.5 w-3.5" />
          <span>{message.createdAt}</span>
          {mine && <CheckCheck className="h-3.5 w-3.5" />}
        </div>
      </div>
    </div>
  );
}

function AttachmentPreview({ file, mine }) {
  const isImage = file.type?.startsWith("image/");

  if (!isImage) {
    return (
      <div
        className={`rounded-2xl border px-3 py-2 text-xs ${
          mine
            ? "border-white/20 bg-white/10 text-white"
            : "border-slate-200 bg-slate-50 text-slate-700"
        }`}
      >
        <p className="font-medium">{file.name}</p>
        <p className={mine ? "text-white/75" : "text-slate-500"}>
          {formatFileSize(file.size)}
        </p>
      </div>
    );
  }

  return <ImagePreview file={file} />;
}

function ImagePreview({ file }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!src) {
    return <div className="h-28 rounded-2xl bg-slate-200" />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/20 bg-black/5">
      <img
        src={src}
        alt={file.name}
        className="h-28 w-full object-cover"
      />
    </div>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}