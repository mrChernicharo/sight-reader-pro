import { Clef, GameType, KeySignature, Knowledge, LevelAccidentType, ScaleType } from "@/utils/enums";
import { ALL_LEVELS } from "@/utils/levels";
import { CurrentGame, Game, Round } from "@/utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface PracticeSettings {
    clef: Clef;
    hasKey: boolean;
    isMinorKey: boolean;
    accident: LevelAccidentType;
    keySignature: KeySignature;
    scaleType: ScaleType;
    noteRangeIndices: { low: number; high: number };
    gameType: GameType;
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
    games: Game<GameType>[];
    currentGame: CurrentGame<GameType> | null;
    selectedLevelsClef: Clef;
    completedTours: CompletedTours;
    practiceSettings: PracticeSettings;
    // difficulty: Difficulty;
    _hydrated: boolean;
}

export const defaultNoteRangeIndices = { low: 13, high: 25 };

const defaultPracticeSettings: PracticeSettings = {
    accident: LevelAccidentType.None,
    clef: Clef.Treble,
    hasKey: false,
    isMinorKey: false,
    keySignature: KeySignature.C,
    scaleType: ScaleType.Diatonic,
    noteRangeIndices: defaultNoteRangeIndices,
    gameType: GameType.Single,
};

export interface AppActions {
    setUsername: (name: string) => Promise<void>;
    setLanguage: (lang: "en" | "pt-BR") => Promise<void>;
    setKnowledge: (knowledge: Knowledge) => Promise<void>;
    setGlobalVolume: (volume: number) => Promise<void>;
    toggleShowPianoNoteNames: (show: boolean) => Promise<void>;
    setSelectedLevelsClef: (clef: Clef) => Promise<void>;

    setTourCompleted: (tourName: keyof CompletedTours, completed: boolean) => Promise<void>;

    saveGameRecord: (game: Game<GameType>) => Promise<void>;
    startNewGame: (newGame: CurrentGame<GameType>) => Promise<void>;
    endGame: (previousPage?: string) => Promise<void>;
    addNewRound: (round: Round<GameType>) => Promise<void>;
    updateRound: (val: Partial<Round<GameType>>) => Promise<void>;
    updatePracticeSettings: (setting: keyof PracticeSettings, value: any) => Promise<void>;

    setHydrated: (hydrated: boolean) => Promise<void>;
    _resetStore: () => Promise<void>;
}

type StoreState = AppState & AppActions;

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
                completedTours: {
                    init: false,
                    home: false,
                    levelSelection: false,
                    game: false,
                    practice: false,
                },
                _hydrated: false,

                _resetStore: async () =>
                    set({
                        username: "",
                        language: null,
                        knowledge: null, // don't override knowledge
                        selectedLevelsClef: Clef.Treble,
                        showPianoNoteNames: true,
                        globalVolume: 1,
                        games: [],
                        currentGame: null,
                        completedTours: {
                            // init: true,
                            // home: true,
                            init: false,
                            home: false,
                            levelSelection: false,
                            game: false,
                            practice: false,
                        },
                    }),
                setHydrated: async (hydrated: boolean) => set({ _hydrated: hydrated }),

                setUsername: async (name: string) => set(() => ({ username: name })),
                setLanguage: async (lang: "en" | "pt-BR") => set({ language: lang }),
                setKnowledge: async (knowledge: Knowledge) => set(() => ({ knowledge: knowledge })),
                setGlobalVolume: async (volume: number) => set(() => ({ globalVolume: volume })),
                toggleShowPianoNoteNames: async (show: boolean) => set(() => ({ showPianoNoteNames: show })),
                setSelectedLevelsClef: async (clef: Clef) => set(() => ({ selectedLevelsClef: clef })),
                // setDifficulty: async (difficulty: Difficulty) => set(() => ({ difficulty: difficulty })),

                setTourCompleted: async (tourName: keyof CompletedTours, completed: boolean) =>
                    set((state) => ({ ...state, completedTours: { ...state.completedTours, [tourName]: completed } })),

                saveGameRecord: async (game: Game<GameType>) => set((state) => ({ games: [...state.games, game] })),

                startNewGame: async (newGame: CurrentGame<GameType>) => {
                    // prettier-ignore
                    console.log("START NEW GAME:::", newGame, "ALL LEVELS::::", ALL_LEVELS.map((lvl) => lvl.name));

                    set({ currentGame: newGame });
                },
                endGame: async (previousPage?: string) => {
                    // console.log("END GAME", previousPage);
                    set({ currentGame: null });
                    // practice screen pushes the practice level onto ALL_LEVELS...we'd better clean it up here
                    if (previousPage === "/practice") {
                        setTimeout(() => {
                            // prettier-ignore
                            console.log("END GAME:::ALL LEVELS::::", ALL_LEVELS.map((lvl) => lvl.name));
                            ALL_LEVELS.pop();
                        }, 1000);
                    }
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
                    set((state) => ({
                        ...state,
                        practiceSettings: { ...state.practiceSettings, [setting]: value },
                    }));
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
