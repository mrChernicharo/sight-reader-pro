import { Clef, GameType, WinRank, LevelAccidentType, KeySignature, ScaleType, Accident, TimeSignature } from "./enums";
import { getGameStats, padZero } from "./helperFns";
import {
    MAJOR_KEY_SIGNATURES_FLAT,
    MAJOR_KEY_SIGNATURES_SHARP,
    MINOR_KEY_SIGNATURES_FLAT,
    MINOR_KEY_SIGNATURES_SHARP,
} from "./keySignature";

import { SectionedLevel, Level, Game, makeLevelGroup, Scale } from "./types";

export function getLevel(levelId: string) {
    // console.log("<getLevel>", { level, levelId });
    const level = ALL_LEVELS.find((lvl) => lvl.id === levelId)!;
    return level;
}

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

export function getUnlockedLevels(games: Game[], intl: Intl.NumberFormat) {
    let highestTrebleIdx = -1;
    let highestBassIdx = -1;
    // console.log("getUnlockedLevels:::", JSON.stringify(games, null, 2), "game count:::", games.length);
    for (const game of games) {
        const level = getLevel(game.levelId);
        // console.log("level:::", JSON.stringify(level, null, 2));
        if (!game || !level) continue;

        const { hasWon } = getGameStats(level, game.rounds, intl);

        // console.log("getUnlockedLevels", { level, game, hasWon });
        switch (level.type) {
            case GameType.Melody:
            case GameType.Single: {
                switch (level.clef) {
                    case Clef.Treble:
                        if (hasWon && level.index > highestTrebleIdx) {
                            highestTrebleIdx = level.index;
                        }
                        break;
                    case Clef.Bass:
                        if (hasWon && level.index > highestBassIdx) {
                            highestBassIdx = level.index;
                        }
                        break;
                }
            }
            case GameType.Chord:
            case GameType.Rhythm:
            // @TODO
        }
    }

    const response: Record<Clef, number> = {
        treble: highestTrebleIdx,
        bass: highestBassIdx,
    };
    return response;
    // return { treble: 100, bass: 10 };
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
    name: "basics",
    clef: Clef.Treble,
    // durations: { min: 20, max: 40 },
    durations: { min: 300, max: 400 },
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
    name: "apprentice",
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
    name: "intermediary",
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
    name: "key signatures",
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
    name: "more key signatures",
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
    name: "pro levels",
    clef: Clef.Treble,
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
    name: "guitar",
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
    name: "low notes",
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
    name: "high notes",
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
    name: "basics",
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
    name: "apprentice",
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
    name: "intermediary",
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
    name: "key signatures",
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
    name: "more key signatures",
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
    name: "pro levels",
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
    name: "guitar",
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
    name: "low notes",
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
    name: "high notes",
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

// console.log("TEST_LEVELS ::::", JSON.stringify(TEST_LEVELS_A, null, 2));
// console.log("TEST_LEVELS ::::", JSON.stringify(TEST_LEVELS_B, null, 2));
// console.log("TEST_LEVELS ::::", JSON.stringify(TREBLE_INTERMEDIARY_LEVELS, null, 2));

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

// const TROMBONE_LEVELS;
// const BASS_LEVELS;
// const CELLO_LEVELS;
// const BASS_LOW_LEVELS;
// const BASS_HIGH_LEVELS;

export let ALL_LEVELS = [...TREBLE_LEVELS, ...BASS_LEVELS];
// console.log("ALL_LEVELS:::", ALL_LEVELS, TREBLE_LEVELS.length);

export const SECTIONED_LEVELS: SectionedLevel[] = [
    {
        title: Clef.Treble,
        data: TREBLE_LEVELS,
    },
    {
        title: Clef.Bass,
        data: BASS_LEVELS,
    },
];
