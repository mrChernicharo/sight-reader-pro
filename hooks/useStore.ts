import { Game } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AppState {
  _hydrated: boolean;
  username: string;
  games: Game[];
}

export interface AppActions {
  setUsername: (name: string) => void;
  addGame: (game: Game) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      _hydrated: false,
      username: "",
      games: [],
      setUsername: (name: string) => set(() => ({ username: name })),
      addGame: (game: Game) => set((state) => ({ games: [...state.games, game] })),
      setHydrated: (hydrated: boolean) => set({ _hydrated: hydrated }),
    }),
    {
      name: "sight-reader-pro",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (state) => {
        return () => state.setHydrated(true);
      },
    }
  )
);
