import { create } from "zustand";
export const chatStore = create((set) => ({
    messages: [],
    messageID : -1,
    setMessageID: (id) => set({ messageID: id }),
    messageSummary: null,
    setMessageSummary: (summary) => set({ messageSummary: summary }),
}))