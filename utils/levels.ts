import { Clef, GameType, WinRank, LevelAccidentType, KeySignature, ScaleType, Accident, TimeSignature } from "./enums";
import { getGameStats, padZero } from "./helperFns";
import {
    MAJOR_KEY_SIGNATURES_FLAT,
    MAJOR_KEY_SIGNATURES_SHARP,
    MINOR_KEY_SIGNATURES_FLAT,
    MINOR_KEY_SIGNATURES_SHARP,
} from "./keySignature";

import { SectionedLevel, Level, Game, makeLevelGroup, Scale } from "./types";

const TREBLE_LEVELS: Level[] = assembleLevelInfo(Clef.Treble, [
    {
        name: "D Major",
        type: GameType.Single,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["d/4:::f#/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        keySignature: KeySignature["D"],
        scale: Scale.Diatonic,
    },
    {
        name: "A Major",
        type: GameType.Single,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["c#/4:::a/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        keySignature: KeySignature["A"],
        scale: Scale.Diatonic,
    },
    {
        name: "F Major",
        type: GameType.Single,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["c/4:::a/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        keySignature: KeySignature["F"],
        scale: Scale.Diatonic,
    },
    {
        name: "Bb Major",
        type: GameType.Single,
        noteRanges: ["bb/3:::bb/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        keySignature: KeySignature["Bb"],
        scale: Scale.Diatonic,
    },
    {
        name: "Eb Major",
        type: GameType.Single,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["bb/3:::c/6"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        keySignature: KeySignature["Eb"],
        scale: Scale.Diatonic,
    },
    {
        name: "E melody",
        type: GameType.Melody,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["a/3:::c#/6"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        keySignature: KeySignature["E"],
        scale: Scale.Diatonic,
    },
]);

const BASS_LEVELS: Level[] = assembleLevelInfo(Clef.Bass, [
    {
        name: "basics 01",
        type: GameType.Single,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["g/2:::c/3"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    },
    {
        name: "chromatic keys",
        type: GameType.Single,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["c/2:::g/2", "c/3:::g/3"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        keySignature: KeySignature.Bb,
        scale: Scale.Chromatic,
    },
    {
        name: "range test",
        type: GameType.Single,
        noteRanges: ["a/2:::e/4"],
        timeSignature: TimeSignature["4/4"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        keySignature: KeySignature.Ab,
        scale: Scale.Diatonic,
    },
    {
        name: "2 ranges",
        type: GameType.Single,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["c/2:::g/2", "c/3:::g/3"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        keySignature: KeySignature.Bb,
        scale: Scale.Diatonic,
    },
]);

export let ALL_LEVELS = [...TREBLE_LEVELS, ...BASS_LEVELS];

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

const TEST_LEVELS_A = makeLevelGroup({
    name: "basics",
    clef: Clef.Treble,
    durations: { min: 20, max: 40 },
    keySignatures: [KeySignature.C],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 12,
    noteRanges: { min: ["c/3", "c/3"], max: ["d/3", "c/4"] },
    scales: [Scale.Diatonic /*, Scale.Pentatonic */],
    winConditions: {
        min: {
            bronze: 12,
            silver: 18,
            gold: 24,
        },
        max: {
            bronze: 16,
            silver: 22,
            gold: 28,
        },
    },
});

// const TEST_LEVELS_B = makeLevelGroup({
//     name: "mid",
//     clef: Clef.Treble,
//     durations: { min: 30, max: 60 },
//     keySignatures: [KeySignature.Bb, KeySignature.Eb, KeySignature.Ab, KeySignature.Db],
//     timeSignatures: [TimeSignature["4/4"]],
//     levelCount: 12,
//     noteRanges: { min: ["g/2", "c/3"], max: ["g/3", "e/4"] },
//     scales: [Scale.Diatonic /* , Scale.Pentatonic, Scale.Melodic */],
//     winConditions: {
//         min: {
//             bronze: 16,
//             silver: 22,
//             gold: 28,
//         },
//         max: {
//             bronze: 22,
//             silver: 28,
//             gold: 34,
//         },
//     },
// });

// console.log("TEST_LEVELS ::::", JSON.stringify(TEST_LEVELS_A, null, 2));
// console.log("TEST_LEVELS ::::", JSON.stringify(TEST_LEVELS_B, null, 2));
