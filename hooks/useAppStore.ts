import { GameState, GameType, Difficulty } from "@/constants/enums";
import { Game, GameScore, CurrentGame, Round } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

export interface AppState {
  _hydrated: boolean;
  username: string;
  difficulty: Difficulty;
  games: Game<GameType>[];
  currentGame: CurrentGame<GameType> | null;
}

export interface AppActions {
  setUsername: (name: string) => Promise<void>;
  saveGameRecord: (game: Game<GameType>) => Promise<void>;
  setHydrated: (hydrated: boolean) => Promise<void>;
  _resetStore: () => Promise<void>;

  startNewGame: (newGame: CurrentGame<GameType>) => Promise<void>;
  endGame: () => Promise<void>;
  setGameState: (gameState: GameState) => Promise<void>;
  addNewRound: (round: Round<GameType>) => Promise<void>;
  updateRound: (val: Partial<Round<GameType>>) => Promise<void>;
}

type StoreState = AppState & AppActions;

const checkOngoingGame = (state: StoreState) => {
  const hasCurrentGame = state.currentGame && state.currentGame.rounds;
  if (!hasCurrentGame) {
    console.error("no ongoing game!");
    return false;
  }
  return true;
};

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    persist(
      (set) => ({
        _hydrated: false,
        username: "",
        games: [],
        currentGame: null,
        difficulty: Difficulty.Normal,
        setHydrated: async (hydrated: boolean) => set({ _hydrated: hydrated }),
        _resetStore: async () => set({ games: [], username: "" }),
        setUsername: async (name: string) => set(() => ({ username: name })),
        setDifficulty: async (difficulty: Difficulty) => set(() => ({ difficulty: difficulty })),
        saveGameRecord: async (game: Game<GameType>) => set((state) => ({ games: [...state.games, game] })),

        startNewGame: async (newGame: CurrentGame<GameType>) => set({ currentGame: newGame }),
        endGame: async () => set({ currentGame: null }),
        setGameState: async (gameState: GameState) =>
          set((state) => {
            if (!checkOngoingGame(state)) return state;
            return { ...state, currentGame: { ...state.currentGame!, state: gameState } };
          }),
        addNewRound: async (round: Round<GameType>) =>
          set((state) => {
            if (!checkOngoingGame(state)) return state;
            return { ...state, currentGame: { ...state.currentGame!, rounds: [...state.currentGame!.rounds, round] } };
          }),
        updateRound: async (val: Partial<Round<GameType>>) => {
          set((state) => {
            if (!checkOngoingGame(state)) return state;
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
