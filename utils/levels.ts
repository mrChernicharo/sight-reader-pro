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
    durations: { min: 20, max: 40 },
    keySignatures: [KeySignature.C],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 6,
    noteRanges: { min: ["c/4", "c/4"], max: ["e/4", "c/5"] },
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

const TREBLE_BEGINNER_LEVELS = makeLevelGroup({
    name: "flat",
    clef: Clef.Treble,
    durations: { min: 30, max: 60 },
    keySignatures: [KeySignature.Bb, KeySignature.Eb, KeySignature.Ab, KeySignature.Db],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 6,
    noteRanges: { min: ["g/3", "c/4"], max: ["g/4", "e/5"] },
    scales: [Scale.Diatonic /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: {
            bronze: 16,
            silver: 22,
            gold: 28,
        },
        max: {
            bronze: 22,
            silver: 28,
            gold: 34,
        },
    },
});

const TREBLE_INTERMEDIARY_LEVELS = makeLevelGroup({
    name: "sharp",
    clef: Clef.Treble,
    durations: { min: 30, max: 60 },
    keySignatures: [KeySignature.G, KeySignature.D, KeySignature.A, KeySignature.E],
    timeSignatures: [TimeSignature["4/4"]],
    levelCount: 6,
    noteRanges: { min: ["g/3", "d/4"], max: ["b/4", "g/5"] },
    scales: [Scale.Diatonic /*Scale.Chromatic*/ /* , Scale.Pentatonic, Scale.Melodic */],
    winConditions: {
        min: {
            bronze: 16,
            silver: 22,
            gold: 28,
        },
        max: {
            bronze: 22,
            silver: 28,
            gold: 34,
        },
    },
});

// console.log("TEST_LEVELS ::::", JSON.stringify(TEST_LEVELS_A, null, 2));
// console.log("TEST_LEVELS ::::", JSON.stringify(TEST_LEVELS_B, null, 2));
console.log("TEST_LEVELS ::::", JSON.stringify(TREBLE_INTERMEDIARY_LEVELS, null, 2));

const TREBLE_LEVELS: Level[] = assembleLevelInfo(
    Clef.Treble,
    TREBLE_NOVICE_LEVELS.concat(TREBLE_BEGINNER_LEVELS.concat(TREBLE_INTERMEDIARY_LEVELS))
);

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
console.log("ALL_LEVELS:::", ALL_LEVELS);

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
