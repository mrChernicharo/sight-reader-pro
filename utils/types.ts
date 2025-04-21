import { Href } from "expo-router";
import {
    addHalfSteps,
    explodeNote,
    fixNoteUntilItFitsScale,
    getNextScaleNote,
    isScaleNote,
    padZero,
} from "./helperFns";
import { MAJOR_KEY_SIGNATURES } from "./keySignature";
import {
    WinRank,
    KeySignature,
    ScaleType,
    LevelAccidentType,
    GameType,
    Clef,
    NoteName,
    NoteNameBase,
    Accident,
    GameState,
    TimeSignature,
    NoteDuration,
    Knowledge,
} from "./enums";
import { getNotesInRange, getPossibleNotesInLevel } from "./noteFns";

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

// export type Game<T> = {
//     id: string;
//     levelId: string;
//     timestamp: number;
//     durationInSeconds: number;
//     type: T;
//     rounds: Round<T>[];
// };

// export type Level<T> = GameSettings<T> & {
//     id: LevelId;
//     clef: Clef;
//     index: number;
//     name: string;
//     durationInSeconds: number;
//     winConditions: WinConditions;
//     gameType: T;
//     // description: string;
// };

// export type CurrentGame<T> = Game<T> & Level<T> & { state: GameState };

// export type PianoKeySpec = "Flat" | "Sharp"; /* | 'Both' */

// export interface GameScore {
//     successes: number;
//     mistakes: number;
// }

// export type SectionedLevel = {
//     title: string;
//     data: Level<GameType>[];
// };

// export interface LevelScore {
//     value: number;
//     multiplier: number;
//     hits: number;
//     hitScore: number;
//     winConditions: WinConditions;
//     accuracy: number;
//     formula: string;
// }

// export interface GameScreenParams {
//     id: string;
//     keySignature: KeySignature;
//     previousPage: Href;
// }

// export type GameStatsDisplayProps = {
//     level: Level<GameType>;
//     hitsPerMinute: number;
// };

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
};

// export type Round = {
//     attempt: null | Note[];
//     value: Note[];
// };

// export type ActiveGame = {
//     state: GameState;
//     rounds: Round[];
// };

export type CurrentGame = Game & Level & { state: GameState };

export type PianoKeySpec = "Flat" | "Sharp"; /* | 'Both' */

export interface GameScore {
    successes: number;
    mistakes: number;
}

export type SectionedLevel = {
    title: string;
    data: Level[];
};

export interface LevelScore {
    value: number;
    multiplier: number;
    hits: number;
    hitScore: number;
    winConditions: WinConditions;
    accuracy: number;
    formula: string;
}

export interface GameScreenParams {
    id: string;
    keySignature: KeySignature;
    previousPage: Href;
}

export type GameStatsDisplayProps = {
    level: Level;
    hitsPerMinute: number;
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
