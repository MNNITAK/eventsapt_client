"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Paperclip, Send, Trash2, FileText, Image as ImageIcon } from "lucide-react";

export default function ChatComposer({ onSend }) {
  const fileInputRef = useRef(null);
  const attachmentsRef = useRef([]);
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []);

  const canSend = useMemo(() => {
    return text.trim().length > 0 || attachments.length > 0;
  }, [text, attachments]);

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const next = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setAttachments((prev) => [...prev, ...next]);
    event.target.value = "";
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((item) => item.id !== id);
    });
  };

  const resetComposer = () => {
    attachments.forEach((item) => URL.revokeObjectURL(item.preview));
    setAttachments([]);
    setText("");
  };

  const handleSend = () => {
    if (!canSend) return;

    onSend({
      text,
      files: attachments.map((item) => item.file),
    });

    resetComposer();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-3">
      {attachments.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {attachments.map((item) => (
            <AttachmentChip
              key={item.id}
              item={item}
              onRemove={() => removeAttachment(item.id)}
            />
          ))}
        </div>
      )}

      <div className="rounded-[28px] border border-[#efc2d1] bg-white p-3 shadow-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... Press Enter to send, Shift+Enter for a new line."
          className="min-h-24 w-full resize-none rounded-2xl border border-transparent bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#C94C73] focus:bg-white focus:ring-2 focus:ring-[#f4d8e1]"
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
              onChange={handleFiles}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#efc2d1] bg-white px-4 py-2.5 text-sm font-medium text-[#9a2143] transition hover:bg-[#fff7fa]"
            >
              <Paperclip className="h-4 w-4" />
              Attach files
            </button>

            <span className="hidden text-xs text-slate-400 sm:inline">
              Multiple files supported
            </span>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white transition ${
              canSend
                ? "bg-[#C94C73] hover:bg-[#b44267]"
                : "cursor-not-allowed bg-slate-300"
            }`}
          >
            <Send className="h-4 w-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function AttachmentChip({ item, onRemove }) {
  const isImage = item.file.type?.startsWith("image/");

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      {isImage ? (
        <div className="relative h-28 w-full">
          <img
            src={item.preview}
            alt={item.file.name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-28 items-center gap-3 p-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm">
            {item.file.type?.includes("pdf") ? (
              <FileText className="h-5 w-5 text-[#C94C73]" />
            ) : (
              <ImageIcon className="h-5 w-5 text-slate-500" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              {item.file.name}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {formatFileSize(item.file.size)}
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white opacity-100 transition hover:bg-black/80"
        aria-label="Remove attachment"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}