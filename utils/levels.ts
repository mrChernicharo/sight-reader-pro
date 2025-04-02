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
    description: "",
    gameType: GameType.Single,
    noteRanges: ["g/4:::c/5"],
    durationInSeconds: 2,
    // durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: false,
    accident: LevelAccidentType.None,
  },
  {
    name: "basics 02",
    description: "",
    gameType: GameType.Melody,
    timeSignature: TimeSignature["4/4"],
    noteRanges: ["f/4:::d/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: false,
    accident: LevelAccidentType.None,
  },
  {
    name: "basics 03",
    description: "",
    gameType: GameType.Melody,
    timeSignature: TimeSignature["4/4"],
    noteRanges: ["e/4:::e/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: false,
    accident: LevelAccidentType.None,
  },
  {
    name: "basics 04",
    description: "",
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
    description: "",
    gameType: GameType.Single,
    noteRanges: ["d/4:::e/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: true,
    keySignatures: [KeySignature["G"]],
    scaleType: ScaleType.Diatonic,
  },
  {
    name: "D",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["d/4:::f#/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: true,
    keySignatures: [KeySignature["D"]],
    scaleType: ScaleType.Diatonic,
  },
  {
    name: "A",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["c#/4:::a/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: true,
    keySignatures: [KeySignature["A"]],
    scaleType: ScaleType.Diatonic,
  },
  {
    name: "F",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["c/4:::a/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: true,
    keySignatures: [KeySignature["F"]],
    scaleType: ScaleType.Diatonic,
  },
  {
    name: "Bb",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["bb/3:::bb/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: true,
    keySignatures: [KeySignature["Bb"]],
    scaleType: ScaleType.Diatonic,
  },
  {
    name: "Eb",
    description: "",
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
    description: "",
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
    description: "",
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
    description: "",
    gameType: GameType.Single,
    noteRanges: ["c/4:::a/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
    scaleType: ScaleType.Diatonic,
    keySignatures: MAJOR_KEY_SIGNATURES_FLAT,
  },
  {
    name: "major-keys 02",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["b/3:::b/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
    scaleType: ScaleType.Diatonic,
    keySignatures: MAJOR_KEY_SIGNATURES_SHARP,
  },
  {
    name: "chromatic 01",
    description: "",
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
    description: "",
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
    description: "",
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
    description: "",
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
    description: "",
    gameType: GameType.Single,
    noteRanges: ["b/3:::b/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 24, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
    scaleType: ScaleType.Diatonic,
    keySignatures: MAJOR_KEY_SIGNATURES_SHARP,
  },
  {
    name: "major-keys 04",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["a/3:::c/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 24, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
    scaleType: ScaleType.Diatonic,
    keySignatures: MAJOR_KEY_SIGNATURES_FLAT,
  },
  {
    name: "minor-keys 01",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["c/4:::a/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
    scaleType: ScaleType.Diatonic,
    keySignatures: MINOR_KEY_SIGNATURES_FLAT,
  },
  {
    name: "minor-keys 02",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["b/3:::b/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
    scaleType: ScaleType.Diatonic,
    keySignatures: MINOR_KEY_SIGNATURES_SHARP,
  },
  {
    name: "D#m",
    description: "",
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
    description: "",
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
    description: "",
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
    description: "",
    gameType: GameType.Single,
    noteRanges: ["b/3:::b/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 24, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
    scaleType: ScaleType.Diatonic,
    keySignatures: MINOR_KEY_SIGNATURES_SHARP,
  },
  {
    name: "minor-keys 04",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["a/3:::c/5"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 24, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
    scaleType: ScaleType.Diatonic,
    keySignatures: MINOR_KEY_SIGNATURES_FLAT,
  },
  {
    name: "Gb",
    description: "",
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
    description: "",
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
    description: "",
    gameType: GameType.Single,
    noteRanges: ["c/4:::c/7"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: false,
    accident: LevelAccidentType["#"],
  },
  {
    name: "Flute 02",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["c/4:::c/7"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: false,
    accident: LevelAccidentType["b"],
  },
  {
    name: "Flute 03",
    description: "",
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
    description: "",
    gameType: GameType.Single,
    noteRanges: ["e/3:::e/6"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: false,
    accident: LevelAccidentType["b"],
  },
  {
    name: "Guitar 02",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["e/3:::e/6"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: false,
    accident: LevelAccidentType["#"],
  },
  {
    name: "Guitar 03",
    description: "",
    gameType: GameType.Melody,
    timeSignature: TimeSignature["4/4"],
    noteRanges: ["e/3:::e/6"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: false,
    accident: LevelAccidentType["b"],
  },

  // {
  //   name: "basics 02",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["f/4:::d/5"],
  //   durationInSeconds: 30,[WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
  //   keySignatures: [KeySignature.C],
  //   scaleType: ScaleType.Diatonic,
  // },
  // {
  //   name: "basics 03",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["e/4:::e/5"],
  //   durationInSeconds: 30,[WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
  //   keySignatures: [KeySignature.G, KeySignature.F, KeySignature.D],
  //   scaleType: ScaleType.Diatonic,
  // },
  // {
  //   name: "basics 04",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["d/4:::f#/5"],
  //   durationInSeconds: 30,[WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
  //   accident: LevelAccidentType["#"],
  // },
  // {
  //   name: "basics 05",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["db/4:::ab/5"],
  //   durationInSeconds: 30,[WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
  //   accident: LevelAccidentType["b"],
  // },

  // {
  //   name: "melody 01",
  //   description: "",
  //   gameType: GameType.Melody,
  //   noteRanges: ["db/4:::ab/5"],
  //   // durationInSeconds: 30,
  //   durationInSeconds: 30,[WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
  //   hasKey: true,
  //   keySignatures: [KeySignature.Eb],
  //   scaleType: ScaleType.Chromatic,
  //   timeSignature: TimeSignature["4/4"],
  // },
  // {
  //   name: "melody 02",
  //   description: "",
  //   gameType: GameType.Melody,
  //   noteRanges: ["b/3:::a/5"],
  //   // durationInSeconds: 30,
  //   durationInSeconds: 320,[WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
  //   hasKey: true,
  //   keySignatures: [KeySignature.D],
  //   scaleType: ScaleType.Diatonic,
  //   timeSignature: TimeSignature["4/4"],
  // },
]);

const BASS_LEVELS: Level<GameType>[] = assembleLevelInfo(Clef.Bass, [
  {
    name: "basics 01",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["g/2:::c/3"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    accident: LevelAccidentType.None,
  },
  {
    name: "chromatic keys",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["c/2:::g/2", "c/3:::g/3"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    keySignatures: [KeySignature.Bb, KeySignature.Eb, KeySignature.Gm, KeySignature.Cm],
    scaleType: ScaleType.Chromatic,
  },
  {
    name: "range test",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["a/2:::e/4"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    keySignatures: [KeySignature.Ab],
    scaleType: ScaleType.Diatonic,
  },
  {
    name: "2 ranges",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["c/2:::g/2", "c/3:::g/3"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    keySignatures: [KeySignature.Bb, KeySignature.Eb, KeySignature.Gm, KeySignature.Cm],
    scaleType: ScaleType.Diatonic,
  },
  {
    name: "3 ranges!",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["c/2:::g/2", "c/3:::g/3", "c/4:::g/4"],
    durationInSeconds: 30,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    accident: LevelAccidentType["#"],
  },
]);

export let ALL_LEVELS = [...TREBLE_LEVELS, ...BASS_LEVELS];

export const SECTIONED_LEVELS: SectionedLevel[] = [
  {
    title: "Treble Clef",
    data: TREBLE_LEVELS,
  },
  {
    title: "Bass Clef",
    data: BASS_LEVELS,
  },
];

export function getLevel(levelId: string) {
  // if (!id) return
  // if (id.endsWith('practice')) return
  return ALL_LEVELS.find((lvl) => lvl.id === levelId)!;
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
