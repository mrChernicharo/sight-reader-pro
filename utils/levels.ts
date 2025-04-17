import { Clef, GameType, WinRank, LevelAccidentType, KeySignature, ScaleType, Accident, TimeSignature } from "./enums";
import { getGameStats, padZero } from "./helperFns";
import {
    MAJOR_KEY_SIGNATURES_FLAT,
    MAJOR_KEY_SIGNATURES_SHARP,
    MINOR_KEY_SIGNATURES_FLAT,
    MINOR_KEY_SIGNATURES_SHARP,
} from "./keySignature";

import { SectionedLevel, Level, Game } from "./types";

const TREBLE_LEVELS: Level<GameType>[] = assembleLevelInfo(Clef.Treble, [
    {
        name: "basics 01",
        gameType: GameType.Single,
        noteRanges: ["g/4:::c/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: false,
        accident: LevelAccidentType.None,
    },
    {
        name: "basics 02",
        gameType: GameType.Single,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["f/4:::d/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: false,
        accident: LevelAccidentType.None,
    },
    {
        name: "basics 03",
        gameType: GameType.Melody,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["f/4:::d/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: false,
        accident: LevelAccidentType["b"],
        // scaleType: ScaleType.Chromatic,
    },
    {
        name: "basics 04",
        gameType: GameType.Melody,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["d/4:::f/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: false,
        accident: LevelAccidentType.None,
    },
    {
        name: "G",
        gameType: GameType.Single,
        // noteRanges: ["g/2:::e/7"],
        noteRanges: ["d/4:::e/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: true,
        keySignatures: [KeySignature["G"]],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "D Major",
        gameType: GameType.Single,
        noteRanges: ["d/4:::f#/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: true,
        keySignatures: [KeySignature["D"]],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "A Major",
        gameType: GameType.Single,
        noteRanges: ["c#/4:::a/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: true,
        keySignatures: [KeySignature["A"]],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "F Major",
        gameType: GameType.Single,
        noteRanges: ["c/4:::a/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: true,
        keySignatures: [KeySignature["F"]],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "Bb Major",
        gameType: GameType.Single,
        noteRanges: ["bb/3:::bb/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: true,
        keySignatures: [KeySignature["Bb"]],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "Eb Major",
        gameType: GameType.Single,
        noteRanges: ["bb/3:::c/6"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: true,
        keySignatures: [KeySignature["Eb"]],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "E melody",
        gameType: GameType.Melody,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["a/3:::c#/6"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: true,
        keySignatures: [KeySignature["E"]],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "Ab melody",
        gameType: GameType.Melody,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["ab/3:::c/6"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: true,
        keySignatures: [KeySignature["Ab"]],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "major-keys 01",
        gameType: GameType.Single,
        noteRanges: ["c/4:::a/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
        scaleType: ScaleType.Diatonic,
        keySignatures: MAJOR_KEY_SIGNATURES_FLAT,
    },
    {
        name: "major-keys 02",
        gameType: GameType.Single,
        noteRanges: ["b/3:::b/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
        scaleType: ScaleType.Diatonic,
        keySignatures: MAJOR_KEY_SIGNATURES_SHARP,
    },
    {
        name: "chromatic 01",
        gameType: GameType.Melody,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["c/4:::a/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: false,
        accident: LevelAccidentType["#"],
    },
    {
        name: "chromatic 02",
        gameType: GameType.Melody,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["b/3:::b/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: false,
        accident: LevelAccidentType["#"],
    },
    {
        name: "chromatic 03",
        gameType: GameType.Melody,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["a/3:::c/6"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: false,
        accident: LevelAccidentType["b"],
    },
    {
        name: "chromatic 04",
        gameType: GameType.Melody,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["g/3:::c/6"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: false,
        accident: LevelAccidentType["b"],
    },
    {
        name: "major-keys 03",
        gameType: GameType.Single,
        noteRanges: ["b/3:::b/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 24, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
        scaleType: ScaleType.Diatonic,
        keySignatures: MAJOR_KEY_SIGNATURES_SHARP,
    },
    {
        name: "major-keys 04",
        gameType: GameType.Single,
        noteRanges: ["a/3:::c/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 24, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
        scaleType: ScaleType.Diatonic,
        keySignatures: MAJOR_KEY_SIGNATURES_FLAT,
    },
    {
        name: "minor-keys 01",
        gameType: GameType.Single,
        noteRanges: ["c/4:::a/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
        scaleType: ScaleType.Diatonic,
        keySignatures: MINOR_KEY_SIGNATURES_FLAT,
    },
    {
        name: "minor-keys 02",
        gameType: GameType.Single,
        noteRanges: ["b/3:::b/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
        scaleType: ScaleType.Diatonic,
        keySignatures: MINOR_KEY_SIGNATURES_SHARP,
    },
    {
        name: "D#m",
        gameType: GameType.Single,
        noteRanges: ["a/3:::c/6"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: true,
        keySignatures: [KeySignature["D#m"]],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "A#m",
        gameType: GameType.Single,
        noteRanges: ["a/3:::c/6"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: true,
        keySignatures: [KeySignature["A#m"]],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "F#",
        gameType: GameType.Single,
        noteRanges: ["a/3:::c/6"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: true,
        keySignatures: [KeySignature["F#"]],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "minor-keys 03",
        gameType: GameType.Single,
        noteRanges: ["b/3:::b/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 24, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
        scaleType: ScaleType.Diatonic,
        keySignatures: MINOR_KEY_SIGNATURES_SHARP,
    },
    {
        name: "minor-keys 04",
        gameType: GameType.Single,
        noteRanges: ["a/3:::c/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 24, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
        scaleType: ScaleType.Diatonic,
        keySignatures: MINOR_KEY_SIGNATURES_FLAT,
    },
    {
        name: "Gb",
        gameType: GameType.Single,
        noteRanges: ["gb/3:::bb/5"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: true,
        keySignatures: [KeySignature["Gb"]],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "Cb",
        gameType: GameType.Single,
        noteRanges: ["a/3:::c/6"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: true,
        keySignatures: [KeySignature["Cb"]],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "Flute 01",
        gameType: GameType.Single,
        noteRanges: ["c/4:::c/7"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: false,
        accident: LevelAccidentType["#"],
    },
    {
        name: "Flute 02",
        gameType: GameType.Single,
        noteRanges: ["c/4:::c/7"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: false,
        accident: LevelAccidentType["b"],
    },
    {
        name: "Flute 03",
        gameType: GameType.Melody,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["c/4:::c/7"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: false,
        accident: LevelAccidentType["#"],
    },
    {
        name: "Guitar 01",
        gameType: GameType.Single,
        noteRanges: ["e/3:::e/6"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: false,
        accident: LevelAccidentType["b"],
    },
    {
        name: "Guitar 02",
        gameType: GameType.Single,
        noteRanges: ["e/3:::e/6"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: false,
        accident: LevelAccidentType["#"],
    },
    {
        name: "Guitar 03",
        gameType: GameType.Melody,
        timeSignature: TimeSignature["4/4"],
        noteRanges: ["e/3:::e/6"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        hasKey: false,
        accident: LevelAccidentType["b"],
    },
]);

const BASS_LEVELS: Level<GameType>[] = assembleLevelInfo(Clef.Bass, [
    {
        name: "basics 01",
        gameType: GameType.Single,
        noteRanges: ["g/2:::c/3"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        accident: LevelAccidentType.None,
    },
    {
        name: "chromatic keys",
        gameType: GameType.Single,
        noteRanges: ["c/2:::g/2", "c/3:::g/3"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        keySignatures: [KeySignature.Bb, KeySignature.Eb, KeySignature.Gm, KeySignature.Cm],
        scaleType: ScaleType.Chromatic,
    },
    {
        name: "range test",
        gameType: GameType.Single,
        noteRanges: ["a/2:::e/4"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        keySignatures: [KeySignature.Ab],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "2 ranges",
        gameType: GameType.Single,
        noteRanges: ["c/2:::g/2", "c/3:::g/3"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        keySignatures: [KeySignature.Bb, KeySignature.Eb, KeySignature.Gm, KeySignature.Cm],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "3 ranges!",
        gameType: GameType.Single,
        noteRanges: ["c/2:::g/2", "c/3:::g/3", "c/4:::g/4"],
        durationInSeconds: 30,
        winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
        accident: LevelAccidentType["#"],
    },
    {
        name: "Simple Intervals",
        gameType: GameType.Melody,
        noteRanges: ["c/2:::g/3"],
        durationInSeconds: 45,
        winConditions: { [WinRank.Gold]: 25, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
        accident: LevelAccidentType.None,
    },
    {
        name: "Key of F Major",
        gameType: GameType.Single,
        noteRanges: ["f/2:::c/4"],
        durationInSeconds: 40,
        winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
        keySignatures: [KeySignature.F],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "Minor Thirds",
        gameType: GameType.Single,
        noteRanges: ["a/2:::e/3"],
        durationInSeconds: 45,
        winConditions: { [WinRank.Gold]: 25, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
        accident: LevelAccidentType.None,
    },
    {
        name: "Sharp Keys",
        gameType: GameType.Single,
        noteRanges: ["g/2:::d/4"],
        durationInSeconds: 40,
        winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
        keySignatures: [KeySignature.G, KeySignature.D],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "Octave Practice",
        gameType: GameType.Melody,
        noteRanges: ["c/2:::c/4"],
        durationInSeconds: 50,
        winConditions: { [WinRank.Gold]: 28, [WinRank.Silver]: 23, [WinRank.Bronze]: 18 },
        accident: LevelAccidentType.None,
    },
    {
        name: "Flat Keys Advanced",
        gameType: GameType.Single,
        noteRanges: ["b/2:::f/4"],
        durationInSeconds: 45,
        winConditions: { [WinRank.Gold]: 25, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
        keySignatures: [KeySignature.Bb, KeySignature.Eb, KeySignature.Ab],
        scaleType: ScaleType.Diatonic,
    },
    {
        name: "Mixed Intervals",
        gameType: GameType.Melody,
        noteRanges: ["d/2:::a/3", "g/2:::e/3"],
        durationInSeconds: 50,
        winConditions: { [WinRank.Gold]: 28, [WinRank.Silver]: 23, [WinRank.Bronze]: 18 },
        accident: LevelAccidentType.None,
    },
    {
        name: "All accidentals",
        gameType: GameType.Single,
        noteRanges: ["c/2:::c/4"],
        durationInSeconds: 45,
        winConditions: { [WinRank.Gold]: 25, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
        accident: LevelAccidentType.b,
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

export function assembleLevelInfo(clef: Clef, levelInfo: Partial<Level<GameType>>[]): Level<GameType>[] {
    return levelInfo.map((partialLevel, i) => {
        const lvl = partialLevel as any;
        return {
            ...partialLevel,
            id: `${clef}-${padZero(i + 1)}`,
            index: i,
            clef,
            hasKey: partialLevel.gameType !== GameType.Rhythm && lvl.keySignatures && lvl.scaleType,
        } as Level<GameType>;
    });
}

export function getUnlockedLevels(games: Game<GameType>[], intl: Intl.NumberFormat) {
    let highestTrebleIdx = -1;
    let highestBassIdx = -1;
    // console.log("getUnlockedLevels:::", JSON.stringify(games, null, 2), "game count:::", games.length);
    for (const game of games) {
        const level = getLevel(game.levelId);
        // console.log("level:::", JSON.stringify(level, null, 2));
        if (!game || !level) continue;

        const { hasWon } = getGameStats(level, game.rounds, intl);

        // console.log("getUnlockedLevels", { level, game, hasWon });
        switch (level.gameType) {
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
