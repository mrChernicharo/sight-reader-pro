import { GameState, GameType, Difficulty } from "@/utils/enums";
import { ALL_LEVELS } from "@/utils/levels";
import { Game, GameScore, CurrentGame, Round } from "@/utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

export interface AppState {
  _hydrated: boolean;
  username: string;
  language: "en" | "pt-BR";
  difficulty: Difficulty;
  globalVolume: number;
  games: Game<GameType>[];
  currentGame: CurrentGame<GameType> | null;
}

export interface AppActions {
  setUsername: (name: string) => Promise<void>;
  setGlobalVolume: (volume: number) => Promise<void>;
  setLanguage: (lang: "en" | "pt-BR") => Promise<void>;
  saveGameRecord: (game: Game<GameType>) => Promise<void>;

  startNewGame: (newGame: CurrentGame<GameType>) => Promise<void>;
  endGame: (previousPage?: string) => Promise<void>;
  addNewRound: (round: Round<GameType>) => Promise<void>;
  updateRound: (val: Partial<Round<GameType>>) => Promise<void>;

  setHydrated: (hydrated: boolean) => Promise<void>;
  _resetStore: () => Promise<void>;
}

type StoreState = AppState & AppActions;

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    persist(
      (set) => ({
        _hydrated: false,
        username: "user",
        language: "en",
        games: [],
        currentGame: null,
        difficulty: Difficulty.Normal,
        globalVolume: 1,
        setHydrated: async (hydrated: boolean) => set({ _hydrated: hydrated }),
        _resetStore: async () => set({ games: [], username: "", globalVolume: 1 }),
        setUsername: async (name: string) => set(() => ({ username: name })),
        setLanguage: async (lang: "en" | "pt-BR") => set({ language: lang }),
        setDifficulty: async (difficulty: Difficulty) => set(() => ({ difficulty: difficulty })),
        setGlobalVolume: async (volume: number) => set(() => ({ globalVolume: volume })),
        saveGameRecord: async (game: Game<GameType>) => set((state) => ({ games: [...state.games, game] })),

        startNewGame: async (newGame: CurrentGame<GameType>) => {
          // console.log("START NEW GAME", newGame);
          set({ currentGame: newGame });
        },
        endGame: async (previousPage?: string) => {
          // console.log("END GAME", previousPage);
          set({ currentGame: null });
          // practice screen pushes the practice level onto ALL_LEVELS...we'd better clean it up here
          if (previousPage === "/practice") {
            setTimeout(() => {
              ALL_LEVELS.pop();
              // console.log(
              //   "ALL LEVELS ::::",
              //   ALL_LEVELS.map((lvl) => lvl.name)
              // );
            }, 1000);
          }
        },
        addNewRound: async (round: Round<GameType>) =>
          set((state) => {
            if (!hasOngoingGame(state)) return state;
            return { ...state, currentGame: { ...state.currentGame!, rounds: [...state.currentGame!.rounds, round] } };
          }),
        updateRound: async (val: Partial<Round<GameType>>) => {
          set((state) => {
            if (!hasOngoingGame(state)) return state;
            const latestRound = state.currentGame!.rounds.slice(-1)[0];
            const previousRounds = state.currentGame!.rounds.slice(0, -1);
            const updatedRound = { ...latestRound, ...(val as any) };
            // console.log("updateRound ----", { val, latestRound, updatedRound, previousRounds });
            return {
              ...state,
              currentGame: { ...state.currentGame!, rounds: [...previousRounds, updatedRound] },
            };
          });
        },
      }),
      {
        name: "sight-reader-pro",
        storage: createJSONStorage(() => (Platform.OS === "web" ? localStorage : AsyncStorage)),
        onRehydrateStorage: (state) => {
          return () => state.setHydrated(true);
        },
      }
    )
  )
);

function hasOngoingGame(state: StoreState) {
  const hasCurrentGame = state.currentGame && state.currentGame.rounds;
  if (!hasCurrentGame) {
    console.error("no ongoing game!");
    return false;
  }
  return true;
}
