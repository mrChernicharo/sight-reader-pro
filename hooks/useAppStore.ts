import { Clef, GameType, KeySignature, Knowledge } from "@/utils/enums";
import { CurrentGame, Game, GameScoreInfo, Level, Note, Round, Scale } from "@/utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface PracticeSettings {
    clef: Clef;
    isMinorKey: boolean;
    keySignature: KeySignature;
    scale: Scale;
    noteRangeIndices: { low: number; high: number };
    gameType: GameType;
    duration: number;
}
interface CompletedTours {
    init: boolean;
    home: boolean;
    levelSelection: boolean;
    game: boolean;
    practice: boolean;
}

export interface AppState {
    username: string;
    language: null | "en" | "pt-BR";
    knowledge: Knowledge | null;
    showPianoNoteNames: boolean;
    globalVolume: number;
    games: Game[];
    currentGame: CurrentGame | null;
    selectedLevelsClef: Clef;
    completedTours: CompletedTours;
    practiceSettings: PracticeSettings;
    practiceLevel: Level | null;
    soundsLoaded: boolean;
    _hydrated: boolean;
}

export const defaultNoteRangeIndices = { low: 13, high: 25 };

const defaultPracticeSettings: PracticeSettings = {
    clef: Clef.Treble,
    isMinorKey: false,
    keySignature: KeySignature.C,
    scale: Scale.Diatonic,
    noteRangeIndices: defaultNoteRangeIndices,
    gameType: GameType.Single,
    duration: 60,
};

export interface AppActions {
    setUsername: (name: string) => Promise<void>;
    setLanguage: (lang: "en" | "pt-BR") => Promise<void>;
    setKnowledge: (knowledge: Knowledge) => Promise<void>;
    setGlobalVolume: (volume: number) => Promise<void>;
    toggleShowPianoNoteNames: (show: boolean) => Promise<void>;
    setSelectedLevelsClef: (clef: Clef) => Promise<void>;

    setTourCompleted: (tourName: keyof CompletedTours, completed: boolean) => Promise<void>;
    setPracticeLevel: (level: Level | null) => Promise<void>;

    saveGameRecord: (game: Game) => Promise<void>;
    startNewGame: (newGame: CurrentGame) => Promise<void>;
    endGame: (previousPage?: string) => Promise<void>;
    addNewRound: (round: Round<GameType>) => Promise<void>;
    updateRound: (val: Partial<Round<GameType>>) => Promise<void>;
    updatePracticeSettings: (setting: keyof PracticeSettings, value: any) => Promise<void>;

    setSoundsLoaded: (soundsLoaded: boolean) => Promise<void>;
    setHydrated: (hydrated: boolean) => Promise<void>;
    _resetStore: () => Promise<void>;
}

type StoreState = AppState & AppActions;

const defaultStore: Omit<AppState, "_hydrated"> = {
    username: "",
    language: null,
    knowledge: null,
    showPianoNoteNames: true,
    globalVolume: 1,
    games: [],
    selectedLevelsClef: Clef.Treble,
    practiceSettings: defaultPracticeSettings,
    currentGame: null,
    practiceLevel: null,
    soundsLoaded: false,
    completedTours: {
        init: false,
        home: false,
        levelSelection: false,
        game: false,
        practice: false,
    },
} as const;

type OldAppState = Partial<typeof defaultStore>;
type NewAppState = typeof defaultStore;

const DUMMY_GAME_SCORE: GameScoreInfo = {
    attempts: 0,
    successes: 0,
    mistakes: 0,
    accuracy: 0,
    bestStreak: 0,
    hitsPerMinute: 0,
    totalNoteScore: 0,
    accuracyBonus: 0,
    speedBonus: 0,
    bestStreakBonus: 0,
    perfectAccuracyBonus: 0,
    totalScore: 0,
};

export const useAppStore = create<AppState & AppActions>()(
    devtools(
        persist(
            (set) => ({
                username: "",
                language: null,
                knowledge: null,
                showPianoNoteNames: true,
                globalVolume: 1,
                games: [],
                currentGame: null,
                selectedLevelsClef: Clef.Treble,
                practiceSettings: defaultPracticeSettings,
                practiceLevel: null,
                soundsLoaded: false,
                completedTours: {
                    init: false,
                    home: false,
                    levelSelection: false,
                    game: false,
                    practice: false,
                },
                _hydrated: false,

                _resetStore: async () => set(defaultStore),
                setHydrated: async (hydrated: boolean) => set({ _hydrated: hydrated }),

                setUsername: async (name: string) => set(() => ({ username: name })),
                setLanguage: async (lang: "en" | "pt-BR") => set({ language: lang }),
                setKnowledge: async (knowledge: Knowledge) =>
                    set(() => ({
                        knowledge,
                        showPianoNoteNames: [Knowledge.advanced, Knowledge.pro].includes(knowledge) ? false : true,
                    })),
                setGlobalVolume: async (volume: number) => set(() => ({ globalVolume: volume })),
                toggleShowPianoNoteNames: async (show: boolean) => set(() => ({ showPianoNoteNames: show })),
                setSelectedLevelsClef: async (clef: Clef) => set(() => ({ selectedLevelsClef: clef })),

                setTourCompleted: async (tourName: keyof CompletedTours, completed: boolean) =>
                    set((state) => ({ ...state, completedTours: { ...state.completedTours, [tourName]: completed } })),

                saveGameRecord: async (game: Game) =>
                    set((state) => {
                        // console.log("saveGameRecord:::", { game });
                        return { ...state, games: [...state.games, game] };
                    }),

                startNewGame: async (newGame: CurrentGame) => {
                    set({ currentGame: newGame });
                },
                endGame: async () => {
                    console.log("<<< END GAME >>>");
                    set({ currentGame: null });
                },

                addNewRound: async (round: Round<GameType>) =>
                    set((state) => {
                        if (!hasOngoingGame(state)) return state;
                        return {
                            ...state,
                            currentGame: { ...state.currentGame!, rounds: [...state.currentGame!.rounds, round] },
                        };
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
                updatePracticeSettings: async (setting: keyof PracticeSettings, value: any) => {
                    set((state) => {
                        // console.log("updatePracticeSettings:::", { ...state.practiceSettings });
                        return {
                            ...state,
                            practiceSettings: { ...state.practiceSettings, [setting]: value },
                        };
                    });
                },
                setPracticeLevel: async (level: Level | null) => {
                    set({ practiceLevel: level });
                },
                setSoundsLoaded: async (soundsLoaded: boolean) => {
                    set({ soundsLoaded });
                },
            }),
            {
                name: "sight-reader-pro",
                storage: createJSONStorage(() => (Platform.OS === "web" ? localStorage : AsyncStorage)),
                onRehydrateStorage: (state) => {
                    return () => state.setHydrated(true);
                },
                migrate: (persistedState: unknown, version) => {
                    console.log(persistedState, version);
                    if (version < 3) {
                        const typedState = persistedState as OldAppState;
                        return {
                            ...defaultStore,
                            username: typedState.username || defaultStore.username,
                            language: typedState.language || defaultStore.language,
                            knowledge: typedState.knowledge || defaultStore.knowledge,
                            games:
                                typedState.games?.map((game) => ({ ...game, score: game.score || DUMMY_GAME_SCORE })) ||
                                defaultStore.games,
                        } as NewAppState;
                    }

                    // If the version is already the latest (or higher for future migrations),
                    // just return the persisted state.
                    return persistedState as NewAppState;
                },
                version: 3,
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
