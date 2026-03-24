// utils/insightBuffer.js
const BUFFER_KEY = "insight_buffer_v1";

let memoryQueue = [];
let flushTimer = null;

const loadBuffer = () => {
  try {
    const raw = localStorage.getItem(BUFFER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveBuffer = (queue) => {
  try {
    localStorage.setItem(BUFFER_KEY, JSON.stringify(queue));
  } catch {}
};

export const enqueueInsight = (item) => {
  const queue = loadBuffer();
  queue.push({
    id: crypto.randomUUID(),
    ts: Date.now(),
    ...item,
  });
  saveBuffer(queue);
};

export const getBufferedInsights = () => loadBuffer();

export const clearBufferedInsights = () => {
  try {
    localStorage.removeItem(BUFFER_KEY);
  } catch {}
};

export const flushInsights = async () => {
  const queue = loadBuffer();
  if (!queue.length) return;

  try {
    const res = await fetch("/api/v1/insights/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ events: queue }),
      keepalive: true,
    });

    if (res.ok) {
      clearBufferedInsights();
    }
  } catch {
    // keep buffer for next attempt
  }
};

export const scheduleFlush = (delay = 10000) => {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushInsights();
  }, delay);
};

export const flushOnExit = () => {
  const queue = loadBuffer();
  if (!queue.length) return;

  const blob = new Blob(
    [JSON.stringify({ events: queue })],
    { type: "application/json" }
  );

  navigator.sendBeacon("/api/v1/insights/bulk", blob);
  clearBufferedInsights();
};