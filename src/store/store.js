// src/store/useAuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware"
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (data) =>
    set({
      user: data,
      isAuthenticated: true,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));

export const useMediaStore = create((set) => ({
  mediaData: [],
  setMediaData: (media) => set({ mediaData: [...mediaData, media] }),
  recommendationTags: [],
  setRecommendationTags: (tags) => set({ recommendationTags: [...recommendationTags, tags] })
}))

export const usePersistentStore = create(
  persist((set) => ({
    darkMode: false,
    setDarkMode: () => set({ darkMode: !darkMode }),
    mediaData: [],
    setMediaData: (media) => set({ mediaData: [...mediaData, media] }),
    recommendationTags: [],
    setRecommendationTags: (tags) => set({ recommendationTags: [...recommendationTags, tags] })
  })),
  {
    name: "eventsapt-store"
  }
)
