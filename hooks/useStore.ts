import { Game } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AppState {
  _hydrated: boolean;
  username: string;
  games: Game[];
}

export interface AppActions {
  setUsername: (name: string) => Promise<void>;
  addGame: (game: Game) => Promise<void>;
  setHydrated: (hydrated: boolean) => Promise<void>;
  _resetStore: () => Promise<void>;
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      _hydrated: false,
      username: "",
      games: [],
      setUsername: async (name: string) => set(() => ({ username: name })),
      addGame: async (game: Game) => set((state) => ({ games: [...state.games, game] })),
      setHydrated: async (hydrated: boolean) => set({ _hydrated: hydrated }),
      _resetStore: async () => set({ games: [], username: "" }),
    }),
    {
      name: "sight-reader-pro",
      storage: createJSONStorage(() => (Platform.OS === "web" ? localStorage : AsyncStorage)),
      onRehydrateStorage: (state) => {
        return () => state.setHydrated(true);
      },
    }
  )
);
