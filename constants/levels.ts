import { Clef, GameType, WinRank, Accident, KeySignature, ScaleType } from "./enums";
import { padZero } from "./helperFns";
import {
  FLAT_KEY_SIGNATURES,
  SHARP_KEY_SIGNATURES,
  MAJOR_KEY_SIGNATURES_FLAT,
  MAJOR_KEY_SIGNATURES_SHARP,
  MINOR_KEY_SIGNATURES_FLAT,
  MINOR_KEY_SIGNATURES_SHARP,
} from "./notes";
import { SectionedLevel, Level, Game } from "./types";

const TREBLE_LEVELS: Level[] = assembleLevelInfo(Clef.Treble, [
  // {
  //   name: "basics 01",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["a/3:::c/6"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
  //   hasKey: true,
  //   keySignatures: [KeySignature["F#m"]],
  //   scaleType: ScaleType.Diatonic,
  //   // accident: Accident.None,
  // },
  {
    name: "Gb",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["a/3:::c/6"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: true,
    keySignatures: [KeySignature["Gb"]],
    scaleType: ScaleType.Diatonic,
    // accident: Accident.None,
  },
  {
    name: "Cb",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["a/3:::c/6"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: true,
    keySignatures: [KeySignature["Cb"]],
    scaleType: ScaleType.Diatonic,
    // accident: Accident.None,
  },

  {
    name: "D#m",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["a/3:::c/6"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: true,
    keySignatures: [KeySignature["D#m"]],
    scaleType: ScaleType.Diatonic,
    // accident: Accident.None,
  },
  {
    name: "A#m",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["a/3:::c/6"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: true,
    keySignatures: [KeySignature["A#m"]],
    scaleType: ScaleType.Diatonic,
    // accident: Accident.None,
  },
  {
    name: "F#",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["a/3:::c/6"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: true,
    keySignatures: [KeySignature["F#"]],
    scaleType: ScaleType.Diatonic,
    // accident: Accident.None,
  },
  // {
  //   name: "basics 02",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["f/4:::d/5"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
  //   keySignatures: [KeySignature.C],
  //   scaleType: ScaleType.Diatonic,
  // },
  // {
  //   name: "basics 03",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["e/4:::e/5"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
  //   keySignatures: [KeySignature.G, KeySignature.F, KeySignature.D],
  //   scaleType: ScaleType.Diatonic,
  // },
  // {
  //   name: "basics 04",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["d/4:::f#/5"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
  //   accident: Accident["#"],
  // },
  // {
  //   name: "basics 05",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["db/4:::ab/5"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
  //   accident: Accident["b"],
  // },
  // {
  //   name: "major-keys 01",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["c/4:::a/5"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
  //   scaleType: ScaleType.Diatonic,
  //   keySignatures: MAJOR_KEY_SIGNATURES_FLAT,
  // },
  // {
  //   name: "major-keys 02",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["b/3:::b/5"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
  //   scaleType: ScaleType.Diatonic,
  //   keySignatures: MAJOR_KEY_SIGNATURES_SHARP,
  // },
  // {
  //   name: "major-keys 03",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["b/3:::b/5"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 24, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
  //   scaleType: ScaleType.Diatonic,
  //   keySignatures: MAJOR_KEY_SIGNATURES_SHARP,
  // },
  // {
  //   name: "major-keys 04",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["a/3:::c/5"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 24, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
  //   scaleType: ScaleType.Diatonic,
  //   keySignatures: MAJOR_KEY_SIGNATURES_FLAT,
  // },
  // {
  //   name: "minor-keys 01",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["c/4:::a/5"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
  //   scaleType: ScaleType.Diatonic,
  //   keySignatures: MINOR_KEY_SIGNATURES_FLAT,
  // },
  // {
  //   name: "minor-keys 02",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["b/3:::b/5"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
  //   scaleType: ScaleType.Diatonic,
  //   keySignatures: MINOR_KEY_SIGNATURES_SHARP,
  // },
  // {
  //   name: "minor-keys 03",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["b/3:::b/5"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 24, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
  //   scaleType: ScaleType.Diatonic,
  //   keySignatures: MINOR_KEY_SIGNATURES_SHARP,
  // },
  // {
  //   name: "minor-keys 04",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["a/3:::c/5"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 24, [WinRank.Silver]: 20, [WinRank.Bronze]: 15 },
  //   scaleType: ScaleType.Diatonic,
  //   keySignatures: MINOR_KEY_SIGNATURES_FLAT,
  // },
]);

const BASS_LEVELS: Level[] = assembleLevelInfo(Clef.Bass, [
  {
    name: "basics 01",
    description: "",
    gameType: GameType.Single,
    noteRanges: ["g/2:::c/3"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    accident: Accident.None,
  },
  // {
  //   name: "chromatic keys",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["c/2:::g/2", "c/3:::g/3"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
  //   keySignatures: [KeySignature.Bb, KeySignature.Eb, KeySignature.Gm, KeySignature.Cm],
  //   scaleType: ScaleType.Chromatic,
  // },
  // {
  //   name: "range test",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["a/2:::e/4"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
  //   keySignatures: [KeySignature.Ab],
  //   scaleType: ScaleType.Diatonic,
  // },
  // {
  //   name: "2 ranges",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["c/2:::g/2", "c/3:::g/3"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
  //   keySignatures: [KeySignature.Bb, KeySignature.Eb, KeySignature.Gm, KeySignature.Cm],
  //   scaleType: ScaleType.Diatonic,
  // },
  // {
  //   name: "3 ranges!",
  //   description: "",
  //   gameType: GameType.Single,
  //   noteRanges: ["c/2:::g/2", "c/3:::g/3", "c/4:::g/4"],
  //   durationInSeconds: 20,
  //   winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
  //   accident: Accident.None,
  // },
]);

export const ALL_LEVELS = [...TREBLE_LEVELS, ...BASS_LEVELS];
console.log(JSON.stringify(ALL_LEVELS, null, 2));

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

export function getLevel(id: string) {
  return ALL_LEVELS.find((lvl) => lvl.id === id)!;
}

export function assembleLevelInfo(clef: Clef, levelInfo: Partial<Level>[]): Level[] {
  return levelInfo.map((partialLevel, i) => {
    const lvl = partialLevel as any;
    return {
      ...partialLevel,
      id: `${clef}-${padZero(i + 1)}`,
      index: i,
      clef,
      hasKey: partialLevel.gameType !== GameType.Rhythm && lvl.keySignatures && lvl.scaleType,
    } as Level;
  });
}

export function getUnlockedLevels(games: Game[]) {
  let highestTrebleIdx = -1;
  let highestBassIdx = -1;
  for (const game of games) {
    const level = getLevel(game.level_id);

    switch (level.gameType) {
      case GameType.Single: {
        switch (level.clef) {
          case Clef.Treble:
            if (level.index > highestTrebleIdx) {
              highestTrebleIdx = level.index;
            }
            break;
          case Clef.Bass:
            if (level.index > highestBassIdx) {
              highestBassIdx = level.index;
            }
            break;
        }
      }
      case GameType.Chord:
      case GameType.Melody:
      case GameType.Rhythm:
      // @TODO
    }
  }

  const response: Record<Clef, number> = { treble: highestTrebleIdx, bass: highestBassIdx };
  console.log("getUnlockedLevels", response);
  return response;
}
