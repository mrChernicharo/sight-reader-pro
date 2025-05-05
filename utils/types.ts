import { Href } from "expo-router";
import {
    Accident,
    Clef,
    GameState,
    GameType,
    KeySignature,
    Knowledge,
    NoteDuration,
    NoteName,
    NoteNameBase,
    TimeSignature,
    WinRank,
} from "./enums";

export type SingleNoteRound = {
    attempt: Note | null;
    value: Note;
};

export type ChordRound = {
    attempt: Note[];
    value: Note[];
};

export type MelodyRound = {
    attempts: Note[];
    values: Note[];
    durations: NoteDuration[][];
};

export type RhythmRound = Array<{
    attempt: number | null;
    value: number;
}>;

export type Round<T> = T extends GameType.Single
    ? SingleNoteRound
    : T extends GameType.Chord
    ? ChordRound
    : T extends GameType.Melody
    ? MelodyRound
    : T extends GameType.Rhythm
    ? RhythmRound
    : never;

// exceptions b0, c8
type NoteOctave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type LevelId = `${Clef}-${"practice" | number}`;

type NoteNom = `${NoteNameBase}${Accident}/${NoteOctave}`;

export type Note = "b/0" | "ax/0" | "cb/0" | `${NoteName}/${NoteOctave}` | "c/8" | "b#/8" | "dbb/8";

export type NoteRange = `${Note}:::${Note}`;

export type MelodyNote = {
    note: Note;
    duration: NoteDuration;
};

/**
 * hits per minute
 *
 * ```// example: { gold: 40, silver: 37, bronze: 32 }```
 */
export type WinConditions = {
    minAccuracy: number;
    [WinRank.Gold]: number;
    [WinRank.Silver]: number;
    [WinRank.Bronze]: number;
};

export enum Scale {
    Diatonic = "diatonic", // c - d - e - f - g - a - b
    Chromatic = "chromatic", // c - db - d - eb - e - f ...
    // Pentatonic = "pentatonic", // c - d - e - g - a
    // Harmonic = "harmonic", // c - d - eb - f - g - ab - b
    // Melodic = "melodic", // c - d - eb - f - g - a - b
}

export type Level = {
    id: string;
    index: number;
    name: string;
    type: GameType;
    skillLevel: Knowledge;

    clef: Clef;
    scale: Scale;
    noteRanges: NoteRange[];

    timeSignature: TimeSignature;
    keySignature: KeySignature;

    durationInSeconds: number;
    winConditions: WinConditions;
};

export type Game = {
    id: string;
    levelId: string;
    timestamp: number;
    durationInSeconds: number;
    type: GameType;
    rounds: Round<GameType>[];
    score: GameScoreInfo;
};

export type GameScoreInfo = {
    attempts: number;
    successes: number;
    mistakes: number;
    accuracy: number;
    bestStreak: number;
    totalNoteScore: number;

    accuracyBonus: number;
    speedBonus: number;
    bestStreakBonus: number;
    perfectAccuracyBonus: number;
    totalScore: number;
};

export type CurrentGame = Game & Level & { state: GameState };

export type PianoKeySpec = "Flat" | "Sharp"; /* | 'Both' */

export type SectionedLevel = {
    title: string;
    data: Level[];
};

export interface GameScreenParams {
    id: string;
    keySignature: KeySignature;
    previousPage: Href;
}

export type GameStatsDisplayProps = {
    level: Level;
};

export type MinMax<T> = { min: T; max: T };

export interface LevelGroupSpec {
    name: string;
    clef: Clef;
    skillLevel: Knowledge;
    levelCount: number;
    durations: MinMax<number>;
    winConditions: MinMax<WinConditions>;
    keySignatures: KeySignature[];
    timeSignatures: TimeSignature[];
    scales: Scale[];
    noteRanges: MinMax<[Note, Note]>; // { min:  [20, 10], max: [30, 40] }
    // noteRanges: MinMax<[number, number]>; // { min:  [20, 10], max: [30, 40] }
}

export type AttemptedNote = {
    id: string;
    you: Note;
    correct: Note;
    isSuccess: boolean;
    noteScore: number;
};

// export type Round = {
//     attempt: null | Note[];
//     value: Note[];
// };

// export type ActiveGame = {
//     state: GameState;
//     rounds: Round[];
// };

// export interface GameScore {
//     successes: number;
//     mistakes: number;
// }

/** @deprecated */
export interface LevelScore {
    value: number;
    multiplier: number;
    hits: number;
    hitScore: number;
    winConditions: WinConditions;
    accuracy: number;
    formula: string;
}
