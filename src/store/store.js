// src/store/useAuthStore.js
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

//added the devtools for now to check the state changes in the store, will remove it later
export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
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
      }),
      {
        name: "wedora-auth-store", // localStorage key — required for persist to work
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      }
    ),
    { name: "AuthStore" }
  )
);

export const useMediaStore = create((set) => ({
  mediaData: [],
  setMediaData: (media) => set((state) => ({ mediaData: [...state.mediaData, media] })),
  recommendationTags: [],
  setRecommendationTags: (tags) => set((state) => ({ recommendationTags: [...state.recommendationTags, tags] }))
}))



export const usePersistentStore = create(
  persist(
    (set) => ({
      darkMode: false,
      setDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      mediaData: [],
      setMediaData: (media) => set((state) => ({ mediaData: [...state.mediaData, media] })),
      recommendationTags: [],
      setRecommendationTags: (tags) => set((state) => ({ recommendationTags: [...state.recommendationTags, tags] }))
    }),
    {
      name: "wedora-persistent-store"
    }
  )
)
