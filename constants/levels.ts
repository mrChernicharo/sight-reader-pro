import { Clef, GameType, WinRank, Accident, KeySignature, ScaleType } from "./enums";
import { padZero } from "./helperFns";
import { SectionedLevel, Level, Game } from "./types";

const TREBLE_LEVELS: Level[] = assembleLevelInfo(Clef.Treble, [
  {
    // id: "treble-01",
    // index: 0,
    name: "basics 01",
    description: "",
    clef: Clef.Treble,
    gameType: GameType.Single,
    noteRanges: ["g/4:::c/5"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: false,
    accident: Accident.None,
  },
  {
    // id: "treble-02",
    // index: 1,
    name: "basics 02",
    description: "",
    clef: Clef.Treble,
    gameType: GameType.Single,
    noteRanges: ["f/4:::d/5"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    // hasKey: true,
    keySignatures: [KeySignature.C],
    scaleType: ScaleType.Diatonic,
  },
  {
    // id: "treble-03",
    // index: 2,
    name: "basics 03",
    description: "",
    clef: Clef.Treble,
    gameType: GameType.Single,
    noteRanges: ["e/4:::e/5"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    // hasKey: true,
    keySignatures: [KeySignature.G, KeySignature.F, KeySignature.D],
    scaleType: ScaleType.Diatonic,
  },
  {
    // id: "treble-04",
    // index: 3,
    name: "basics 04",
    description: "",
    clef: Clef.Treble,
    gameType: GameType.Single,
    noteRanges: ["d/4:::f#/5"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
    // hasKey: false,
    accident: Accident["#"],
  },
  {
    // id: "treble-05",
    // index: 4,
    name: "basics 05",
    description: "",
    clef: Clef.Treble,
    gameType: GameType.Single,
    noteRanges: ["db/4:::ab/5"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
    // hasKey: false,
    accident: Accident["b"],
  },
]);

const BASS_LEVELS: Level[] = assembleLevelInfo(Clef.Bass, [
  {
    name: "basics 01",
    description: "",
    clef: Clef.Bass,
    gameType: GameType.Single,
    noteRanges: ["g/2:::c/3"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    accident: Accident.None,
  },
  {
    name: "chromatic keys",
    description: "",
    clef: Clef.Bass,
    gameType: GameType.Single,
    noteRanges: ["c/2:::g/2", "c/3:::g/3"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    keySignatures: [KeySignature.Bb, KeySignature.Eb, KeySignature.Gm, KeySignature.Cm],
    scaleType: ScaleType.Chromatic,
  },
  {
    name: "2 ranges",
    description: "",
    clef: Clef.Bass,
    gameType: GameType.Single,
    noteRanges: ["c/2:::g/2", "c/3:::g/3"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    keySignatures: [KeySignature.Bb, KeySignature.Eb, KeySignature.Gm, KeySignature.Cm],
    scaleType: ScaleType.Diatonic,
  },
  {
    name: "3 ranges!",
    description: "",
    clef: Clef.Bass,
    gameType: GameType.Single,
    noteRanges: ["c/2:::g/2", "c/3:::g/3", "c/4:::g/4"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    accident: Accident.None,
  },
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
