import { Clef, GameType, KeySignature, Knowledge, LevelName, TimeSignature } from "./enums";
import { getGameStats, makeLevelGroup, padZero } from "./helperFns";

import { Game, Level, Scale, SectionedLevel } from "./types";

export function assembleLevelInfo(clef: Clef, levelInfo: Partial<Level>[]): Level[] {
    return levelInfo.map((partialLevel, i) => {
        const lvl = partialLevel as any;
        return {
            ...partialLevel,
            id: `${clef}-${padZero(i + 1)}`,
            index: i,
            clef,
        } as Level;
    });
}

// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************

const TREBLE_NOVICE_LEVELS = makeLevelGroup({
    name: LevelName.basics,
    skillLevel: Knowledge.novice,
    clef: Clef.Treble,
    durations: { min: 20, max: 40 },
    // durations: { min: 4, max: 4 },
    // durations: { min: 300, max: 400 },
    keySignatures: [KeySignature.C],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 6,
    noteRanges: { min: ["c/4", "c/4"], max: ["e/4", "c/5"] },
    scales: [Scale.Diatonic /*, Scale.Pentatonic */],
    winConditions: {
        min: { bronze: 12, silver: 18, gold: 24 },
        max: { bronze: 14, silver: 20, gold: 26 },
    },
});

const TREBLE_BEGINNER_LEVELS = makeLevelGroup({
    name: LevelName.apprentice,
    skillLevel: Knowledge.beginner,
    clef: Clef.Treble,
    durations: { min: 30, max: 60 },
    keySignatures: [KeySignature.C],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 6,
    noteRanges: { min: ["g/3", "c/4"], max: ["g/4", "e/5"] },
    scales: [Scale.Diatonic /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 14, silver: 20, gold: 26 },
        max: { bronze: 16, silver: 22, gold: 28 },
    },
});

const TREBLE_INTERMEDIARY_LEVELS_C = makeLevelGroup({
    name: LevelName.intermediary,
    skillLevel: Knowledge.intermediary,
    clef: Clef.Treble,
    durations: { min: 30, max: 60 },
    keySignatures: [KeySignature.C],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 6,
    noteRanges: { min: ["g/3", "c/4"], max: ["b/4", "g/5"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 16, silver: 22, gold: 28 },
        max: { bronze: 18, silver: 24, gold: 30 },
    },
});

const TREBLE_INTERMEDIARY_LEVELS = makeLevelGroup({
    name: LevelName.keySignatures,
    skillLevel: Knowledge.intermediary,
    clef: Clef.Treble,
    durations: { min: 30, max: 60 },
    keySignatures: [
        KeySignature.G,
        KeySignature.F,
        KeySignature.D,
        KeySignature["Bb"],
        KeySignature.A,
        KeySignature["Eb"],
    ],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 12,
    noteRanges: { min: ["a/3", "e/4"], max: ["b/4", "g/5"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 18, silver: 24, gold: 30 },
        max: { bronze: 20, silver: 26, gold: 32 },
    },
});

const TREBLE_ADVANCED_LEVELS = makeLevelGroup({
    name: LevelName.advanced,
    skillLevel: Knowledge.advanced,
    clef: Clef.Treble,
    durations: { min: 45, max: 75 },
    keySignatures: [
        KeySignature.G,
        KeySignature.F,
        KeySignature.D,
        KeySignature["Bb"],
        KeySignature.A,
        KeySignature["Eb"],
        KeySignature.E,
        KeySignature["Ab"],
        KeySignature.B,
        KeySignature["Db"],
        KeySignature["F#"],
        KeySignature["Gb"],
    ],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 12,
    noteRanges: { min: ["a/3", "e/4"], max: ["b/4", "g/5"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 18, silver: 24, gold: 30 },
        max: { bronze: 20, silver: 26, gold: 32 },
    },
});

const TREBLE_PRO_LEVELS = makeLevelGroup({
    name: LevelName.pro,
    clef: Clef.Treble,
    skillLevel: Knowledge.pro,
    durations: { min: 45, max: 75 },
    keySignatures: [
        KeySignature.C,
        KeySignature["Bb"],
        KeySignature.D,
        KeySignature["Ab"],
        KeySignature.E,
        KeySignature["Db"],
        KeySignature.B,
        KeySignature["Gb"],
        KeySignature["F#"],
        KeySignature["Cb"],
        KeySignature["C#"],
        KeySignature["Db"],
        KeySignature.B,
        KeySignature["Ab"],
        KeySignature.E,
        KeySignature["Eb"],
        KeySignature.A,
        KeySignature["Bb"],
        KeySignature.D,
        KeySignature.F,
        KeySignature.G,
        KeySignature.C,
    ],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 24,
    noteRanges: { min: ["c/3", "c/4"], max: ["g/4", "c/6"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 20, silver: 26, gold: 32 },
        max: { bronze: 22, silver: 28, gold: 34 },
    },
});

const GUITAR_LEVELS = makeLevelGroup({
    name: LevelName.guitar,
    clef: Clef.Treble,
    skillLevel: Knowledge.pro,
    durations: { min: 45, max: 75 },
    keySignatures: [
        KeySignature.C,
        KeySignature.F,
        KeySignature.G,
        KeySignature["Bb"],
        KeySignature.D,
        KeySignature["Ab"],
        KeySignature.E,
        KeySignature["Db"],
        KeySignature.B,
    ],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 12,
    noteRanges: { min: ["e/3", "b/3"], max: ["e/5", "e/6"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 22, silver: 28, gold: 34 },
        max: { bronze: 24, silver: 30, gold: 36 },
    },
});
// const VIOLIN_LEVELS;
// const FLUTE_LEVELS;

const TREBLE_LOW_LEVELS = makeLevelGroup({
    name: LevelName.lowNotes,
    skillLevel: Knowledge.pro,
    clef: Clef.Treble,
    durations: { min: 45, max: 75 },
    keySignatures: [
        KeySignature.C,
        KeySignature.F,
        KeySignature.G,
        KeySignature["Bb"],
        KeySignature.D,
        KeySignature["Ab"],
        KeySignature.E,
        KeySignature["Db"],
        KeySignature.B,
    ],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 12,
    noteRanges: { min: ["b/2", "f/3"], max: ["g/4", "b/4"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 24, silver: 30, gold: 36 },
        max: { bronze: 26, silver: 32, gold: 38 },
    },
});
const TREBLE_HIGH_LEVELS = makeLevelGroup({
    name: LevelName.highNotes,
    skillLevel: Knowledge.pro,
    clef: Clef.Treble,
    durations: { min: 45, max: 75 },
    keySignatures: [
        KeySignature.C,
        KeySignature.F,
        KeySignature.G,
        KeySignature["Bb"],
        KeySignature.D,
        KeySignature["Eb"],
        KeySignature.A,
        KeySignature["Ab"],
        KeySignature.A,
        KeySignature["Eb"],
        KeySignature.D,
        KeySignature["Bb"],
        KeySignature.G,
        KeySignature.F,
        KeySignature.C,
    ],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 15,
    noteRanges: { min: ["c/5", "f/5"], max: ["e/6", "e/7"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 26, silver: 32, gold: 38 },
        max: { bronze: 28, silver: 34, gold: 40 },
    },
});

/////////

const BASS_NOVICE_LEVELS = makeLevelGroup({
    name: LevelName.basics,
    skillLevel: Knowledge.novice,
    clef: Clef.Bass,
    durations: { min: 20, max: 40 },
    keySignatures: [KeySignature.C],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 6,
    noteRanges: { min: ["c/3", "c/3"], max: ["e/3", "c/4"] },
    scales: [Scale.Diatonic /*, Scale.Pentatonic */],
    winConditions: {
        min: { bronze: 12, silver: 18, gold: 24 },
        max: { bronze: 14, silver: 20, gold: 26 },
    },
});

const BASS_BEGINNER_LEVELS = makeLevelGroup({
    name: LevelName.apprentice,
    skillLevel: Knowledge.beginner,
    clef: Clef.Bass,
    durations: { min: 30, max: 60 },
    keySignatures: [KeySignature.C],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 6,
    noteRanges: { min: ["g/2", "c/3"], max: ["f/3", "c/4"] },
    scales: [Scale.Diatonic /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 14, silver: 20, gold: 26 },
        max: { bronze: 16, silver: 22, gold: 28 },
    },
});

const BASS_INTERMEDIARY_LEVELS_C = makeLevelGroup({
    name: LevelName.intermediary,
    skillLevel: Knowledge.intermediary,
    clef: Clef.Bass,
    durations: { min: 30, max: 60 },
    keySignatures: [KeySignature.C],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 6,
    noteRanges: { min: ["e/2", "c/3"], max: ["f/3", "c/4"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 16, silver: 22, gold: 28 },
        max: { bronze: 18, silver: 24, gold: 30 },
    },
});

const BASS_INTERMEDIARY_LEVELS = makeLevelGroup({
    name: LevelName.keySignatures,
    skillLevel: Knowledge.intermediary,
    clef: Clef.Bass,
    durations: { min: 30, max: 60 },
    keySignatures: [
        KeySignature.G,
        KeySignature.F,
        KeySignature.D,
        KeySignature["Bb"],
        KeySignature.A,
        KeySignature["Eb"],
    ],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 12,
    noteRanges: { min: ["d/2", "c/3"], max: ["f/3", "d/4"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 18, silver: 24, gold: 30 },
        max: { bronze: 20, silver: 26, gold: 32 },
    },
});

const BASS_ADVANCED_LEVELS = makeLevelGroup({
    name: LevelName.advanced,
    skillLevel: Knowledge.advanced,
    clef: Clef.Bass,
    durations: { min: 45, max: 75 },
    keySignatures: [
        KeySignature.G,
        KeySignature.F,
        KeySignature.D,
        KeySignature["Bb"],
        KeySignature.A,
        KeySignature["Eb"],
        KeySignature.E,
        KeySignature["Ab"],
        KeySignature.B,
        KeySignature["Db"],
        KeySignature["F#"],
        KeySignature["Gb"],
    ],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 12,
    noteRanges: { min: ["g/1", "e/2"], max: ["a/3", "g/4"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 18, silver: 24, gold: 30 },
        max: { bronze: 20, silver: 26, gold: 32 },
    },
});

const BASS_PRO_LEVELS = makeLevelGroup({
    name: LevelName.pro,
    skillLevel: Knowledge.pro,
    clef: Clef.Bass,
    durations: { min: 45, max: 75 },
    keySignatures: [
        KeySignature.C,
        KeySignature["Bb"],
        KeySignature.D,
        KeySignature["Ab"],
        KeySignature.E,
        KeySignature["Db"],
        KeySignature.B,
        KeySignature["Gb"],
        KeySignature["F#"],
        KeySignature["Cb"],
        KeySignature["C#"],
        KeySignature["Db"],
        KeySignature.B,
        KeySignature["Ab"],
        KeySignature.E,
        KeySignature["Eb"],
        KeySignature.A,
        KeySignature["Bb"],
        KeySignature.D,
        KeySignature.F,
        KeySignature.G,
        KeySignature.C,
    ],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 24,
    noteRanges: { min: ["e/1", "e/2"], max: ["c/4", "b/4"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 20, silver: 26, gold: 32 },
        max: { bronze: 22, silver: 28, gold: 34 },
    },
});

const TROMBONE_LEVELS = makeLevelGroup({
    name: LevelName.trombone,
    skillLevel: Knowledge.pro,
    clef: Clef.Bass,
    durations: { min: 45, max: 75 },
    keySignatures: [
        KeySignature.C,
        KeySignature.F,
        KeySignature.G,
        KeySignature["Bb"],
        KeySignature.D,
        KeySignature["Ab"],
        KeySignature.E,
        KeySignature["Db"],
        KeySignature.B,
    ],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 12,
    noteRanges: { min: ["e/2", "e/2"], max: ["c/4", "c/5"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 22, silver: 28, gold: 34 },
        max: { bronze: 24, silver: 30, gold: 36 },
    },
});
// const VIOLIN_LEVELS;
// const FLUTE_LEVELS;
const BASS_LOW_LEVELS = makeLevelGroup({
    name: LevelName.lowNotes,
    skillLevel: Knowledge.pro,
    clef: Clef.Bass,
    durations: { min: 45, max: 75 },
    keySignatures: [
        KeySignature.C,
        KeySignature.F,
        KeySignature.G,
        KeySignature["Bb"],
        KeySignature.D,
        KeySignature["Ab"],
        KeySignature.E,
        KeySignature["Db"],
        KeySignature.B,
    ],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 15,
    noteRanges: { min: ["c/1", "c/2"], max: ["c/3", "f/3"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 24, silver: 30, gold: 36 },
        max: { bronze: 26, silver: 32, gold: 38 },
    },
});
const BASS_HIGH_LEVELS = makeLevelGroup({
    name: LevelName.highNotes,
    skillLevel: Knowledge.pro,
    clef: Clef.Bass,
    durations: { min: 45, max: 75 },
    keySignatures: [
        KeySignature.C,
        KeySignature.F,
        KeySignature.G,
        KeySignature["Bb"],
        KeySignature.D,
        KeySignature["Eb"],
        KeySignature.A,
        KeySignature["Ab"],
        KeySignature.A,
        KeySignature["Eb"],
        KeySignature.D,
        KeySignature["Bb"],
        KeySignature.G,
        KeySignature.F,
        KeySignature.C,
    ],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 12,
    noteRanges: { min: ["d/3", "f/3"], max: ["e/4", "c/5"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: { bronze: 26, silver: 32, gold: 38 },
        max: { bronze: 28, silver: 34, gold: 40 },
    },
});

// const BASS_LEVELS;
// const CELLO_LEVELS;

const TREBLE_LEVELS: Level[] = assembleLevelInfo(Clef.Treble, [
    ...TREBLE_NOVICE_LEVELS,
    ...TREBLE_BEGINNER_LEVELS,
    ...TREBLE_INTERMEDIARY_LEVELS_C,
    ...TREBLE_INTERMEDIARY_LEVELS,
    ...TREBLE_ADVANCED_LEVELS,
    ...TREBLE_PRO_LEVELS,
    ...GUITAR_LEVELS,
    ...TREBLE_LOW_LEVELS,
    ...TREBLE_HIGH_LEVELS,
]);

const BASS_LEVELS: Level[] = assembleLevelInfo(Clef.Bass, [
    ...BASS_NOVICE_LEVELS,
    ...BASS_BEGINNER_LEVELS,
    ...BASS_INTERMEDIARY_LEVELS_C,
    ...BASS_INTERMEDIARY_LEVELS,
    ...BASS_ADVANCED_LEVELS,
    ...BASS_PRO_LEVELS,
    ...TROMBONE_LEVELS,
    ...BASS_LOW_LEVELS,
    ...BASS_HIGH_LEVELS,
]);

export const ALL_LEVELS = [...TREBLE_LEVELS, ...BASS_LEVELS];
