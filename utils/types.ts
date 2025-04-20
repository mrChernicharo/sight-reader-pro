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
} from "./enums";
import { getNotesInRange, getPossibleNotesInLevel } from "./noteFns";

// import { Href } from "expo-router";
// import {
//     WinRank,
//     KeySignature,
//     ScaleType,
//     LevelAccidentType,
//     GameType,
//     Clef,
//     NoteName,
//     NoteNameBase,
//     Accident,
//     GameState,
//     TimeSignature,
//     NoteDuration,
// } from "./enums";

// // exceptions b0, c8
// type NoteOctave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// type NoteNom = `${NoteNameBase}${Accident}/${NoteOctave}`;

// export type Note = "b/0" | "ax/0" | "cb/0" | `${NoteName}/${NoteOctave}` | "c/8" | "b#/8" | "dbb/8";

// export type NoteRange = `${Note}:::${Note}`;

// export type MelodyNote = {
//     note: Note;
//     duration: NoteDuration;
// };

// /**
//  * hits per minute
//  *
//  * ```// example: { gold: 40, silver: 37, bronze: 32 }```
//  */
// export type WinConditions = {
//     [WinRank.Gold]: number;
//     [WinRank.Silver]: number;
//     [WinRank.Bronze]: number;
// };

// export type GameKeySettings =
//     | { hasKey: true; keySignatures: Array<KeySignature>; scaleType: ScaleType }
//     | { hasKey: false; accident: LevelAccidentType };

// export type GameSettings<T> = T extends GameType.Single | GameType.Chord
//     ? GameKeySettings & { noteRanges: Array<NoteRange> }
//     : T extends GameType.Melody
//     ? GameKeySettings & { noteRanges: Array<NoteRange>; timeSignature: TimeSignature }
//     : T extends GameType.Rhythm
//     ? GameKeySettings & { timeSignature: TimeSignature }
//     : never;

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
    levelCount: number;
    durations: MinMax<number>;
    winConditions: MinMax<WinConditions>;
    keySignatures: KeySignature[];
    timeSignatures: TimeSignature[];
    scales: Scale[];
    noteRanges: MinMax<[Note, Note]>; // { min:  [20, 10], max: [30, 40] }
    // noteRanges: MinMax<[number, number]>; // { min:  [20, 10], max: [30, 40] }
}

function mapRange(input = 0, min = 0, max = 1, step = 0.5) {
    if (input < 0 || input > 1) {
        throw new Error("Input must be between 0 and 1.");
    }

    const mappedValue = min + (max - min) * input;
    return Math.round(mappedValue / step) * step;
}

// MAJOR_KEY_SIGNATURES
export function makeLevelGroup(spec: LevelGroupSpec) {
    const { name, clef, levelCount, durations, winConditions, keySignatures, timeSignatures, scales, noteRanges } =
        spec;

    const levels: Level[] = [];

    for (let i = 0; i < levelCount; i++) {
        const groupProgress = i / levelCount;

        const scaleIdx = mapRange(groupProgress, 0, scales.length - 1, 1);
        const keySignatureIdx = mapRange(groupProgress, 0, keySignatures.length - 1, 1);
        const timeSignatureIdx = mapRange(groupProgress, 0, timeSignatures.length - 1, 1);

        const keySignature = keySignatures[keySignatureIdx];
        const scale = scales[scaleIdx];

        let [minMinNote, maxMinNote] = [noteRanges.min[0], noteRanges.min[1]];
        let [minMaxNote, maxMaxNote] = [noteRanges.max[0], noteRanges.max[1]];

        maxMinNote = fixNoteUntilItFitsScale(maxMinNote, scale, keySignature, "DESC");
        minMinNote = fixNoteUntilItFitsScale(minMinNote, scale, keySignature, "ASC");
        let currNote = maxMinNote;

        let minIdx = explodeNote(minMinNote).index;
        let maxIdx = explodeNote(maxMinNote).index;

        const minNotes: Note[] = [];
        const nextNote = getNextScaleNote(currNote, -2, keySignature, scale);
        // console.log({ minIdx, maxIdx, minMinNote, maxMinNote, currNote, nextNote });
        while (maxIdx >= minIdx) {
            minNotes.push(currNote);
            currNote = getNextScaleNote(currNote, -2, keySignature, scale);
            maxIdx = explodeNote(currNote).index;
        }

        /////

        minMaxNote = fixNoteUntilItFitsScale(minMaxNote, scale, keySignature, "ASC");
        maxMaxNote = fixNoteUntilItFitsScale(maxMaxNote, scale, keySignature, "DESC");
        currNote = minMaxNote;

        minIdx = explodeNote(minMaxNote).index;
        maxIdx = explodeNote(maxMaxNote).index;

        const maxNotes: Note[] = [];
        while (minIdx <= maxIdx) {
            maxNotes.push(currNote);
            currNote = getNextScaleNote(currNote, 2, keySignature, scale);
            minIdx = explodeNote(currNote).index;
        }

        if (i == 0) console.log({ maxNotes, minNotes });

        const loNoteIdx = mapRange(groupProgress, 0, minNotes.length - 1, 1);
        const hiNoteIdx = mapRange(groupProgress, 0, maxNotes.length - 1, 1);
        const loNote = minNotes[loNoteIdx];
        const hiNote = maxNotes[hiNoteIdx];

        levels.push({
            id: `${name}-${padZero(i)}`,
            name: `${name} ${padZero(i)}`,
            index: i,
            type: groupProgress < 0.7 ? GameType.Single : GameType.Melody,
            clef,
            durationInSeconds: mapRange(groupProgress, durations.min, durations.max, 5),
            winConditions: {
                bronze: mapRange(groupProgress, winConditions.min.bronze, winConditions.max.bronze, 1),
                silver: mapRange(groupProgress, winConditions.min.silver, winConditions.max.silver, 1),
                gold: mapRange(groupProgress, winConditions.min.gold, winConditions.max.gold, 1),
            },
            keySignature,
            timeSignature: timeSignatures[timeSignatureIdx],
            scale,
            noteRanges: [`${loNote}:::${hiNote}` as NoteRange],
            // noteRanges: [`${NOTE_INDICES[String(loNoteIdx)][0]}:::${NOTE_INDICES[String(hiNoteIdx)][0]}`],
        });
    }

    return levels;
}
