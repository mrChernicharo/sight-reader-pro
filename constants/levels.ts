import { Clef, GameType, WinRank, Accident, KeySignature, ScaleType } from "./enums";
import { padZero } from "./helperFns";
import { SectionedLevel, Level, Game } from "./types";

const MIN_NOTES_PER_MINUTE = 10;

// const TREBLE_LEVELS = [
//   { name: "basics", clef: "treble", range: "g/4:::b/4", accident: "none", durationInSeconds: 5 },
//   { name: "basics", clef: "treble", range: "g/4:::d/5", accident: "none", durationInSeconds: 5 },
//   { name: "basics", clef: "treble", range: "g/4:::e/5", accident: "none", durationInSeconds: 30 },
//   { name: "basics", clef: "treble", range: "e/4:::e/5", accident: "none", durationInSeconds: 30 },
//   { name: "basics", clef: "treble", range: "d/4:::f#/5", accident: "#", durationInSeconds: 30 },
//   { name: "basics", clef: "treble", range: "c/4:::g/5", accident: "b", durationInSeconds: 30 },
//   { name: "basics", clef: "treble", range: "c/4:::a/5", accident: "b", durationInSeconds: 30 },
//   { name: "basics", clef: "treble", range: "c/4:::a/5", accident: "#", durationInSeconds: 30 },
//   { name: "basics", clef: "treble", range: "b/3:::b/5", accident: "b", durationInSeconds: 30 },
//   { name: "basics", clef: "treble", range: "a/3:::c/6", accident: "#", durationInSeconds: 30 },

//   { name: "lower range", clef: "treble", range: "g/3:::g/4", accident: "none", durationInSeconds: 30 },
//   { name: "lower range", clef: "treble", range: "f/3:::g/4", accident: "none", durationInSeconds: 30 },
//   { name: "lower range", clef: "treble", range: "e/3:::g/4", accident: "b", durationInSeconds: 30 },
//   { name: "lower range", clef: "treble", range: "d/3:::g/4", accident: "#", durationInSeconds: 30 },
//   { name: "lower range", clef: "treble", range: "c/3:::g/4", accident: "#", durationInSeconds: 30 },
//   { name: "lower range", clef: "treble", range: "bb/2:::g/4", accident: "b", durationInSeconds: 30 },

//   { name: "higher range", clef: "treble", range: "g/4:::d/6", accident: "none", durationInSeconds: 30 },
//   { name: "higher range", clef: "treble", range: "g/4:::f/6", accident: "none", durationInSeconds: 30 },
//   { name: "higher range", clef: "treble", range: "g/4:::g/6", accident: "b", durationInSeconds: 30 },
//   { name: "higher range", clef: "treble", range: "g/4:::a/6", accident: "#", durationInSeconds: 30 },
//   { name: "higher range", clef: "treble", range: "g/4:::b/6", accident: "b", durationInSeconds: 30 },
//   { name: "higher range", clef: "treble", range: "g/4:::c/7", accident: "#", durationInSeconds: 30 },
// ].map(
//   (levelInfo, i) =>
//     ({
//       ...levelInfo,
//       name: `${levelInfo.name} ${padZero(i + 1)}`,
//       index: i,
//       id: `treble-${padZero(i + 1)}`,
//       winNotesPerMinute: Math.floor(MIN_NOTES_PER_MINUTE + i),
//     } as Level)
// );
// const BASS_LEVELS = [
//   { name: "basics", clef: "bass", range: "g/2:::d/3", accident: "none", durationInSeconds: 30 },
//   { name: "basics", clef: "bass", range: "c/2:::e/3", accident: "none", durationInSeconds: 30 },
//   { name: "basics", clef: "bass", range: "a/1:::g/3", accident: "none", durationInSeconds: 30 },
//   { name: "basics", clef: "bass", range: "g/1:::b/3", accident: "#", durationInSeconds: 30 },
//   { name: "basics", clef: "bass", range: "f/1:::c/4", accident: "b", durationInSeconds: 30 },
//   { name: "basics", clef: "bass", range: "d/1:::d/4", accident: "b", durationInSeconds: 30 },
//   { name: "basics", clef: "bass", range: "c/1:::e/4", accident: "#", durationInSeconds: 30 },
//   { name: "basics", clef: "bass", range: "b/1:::g/4", accident: "#", durationInSeconds: 30 },
//   { name: "basics", clef: "bass", range: "a/1:::a/4", accident: "#", durationInSeconds: 30 },
// ].map(
//   (levelInfo, i) =>
//     ({
//       ...levelInfo,
//       name: `${levelInfo.name} ${padZero(i + 1)}`,
//       index: i,
//       id: `bass-${padZero(i + 1)}`,
//       winNotesPerMinute: Math.floor(MIN_NOTES_PER_MINUTE + i),
//     } as Level)
// );

const TREBLE_LEVELS: Level[] = [
  {
    id: "treble-01",
    index: 0,
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
    id: "treble-02",
    index: 1,
    name: "basics 02",
    description: "",
    clef: Clef.Treble,
    gameType: GameType.Single,
    noteRanges: ["f/4:::d/5"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: true,
    keySignatures: [KeySignature.C],
    scaleType: ScaleType.Diatonic,
  },
  {
    id: "treble-03",
    index: 2,
    name: "basics 03",
    description: "",
    clef: Clef.Treble,
    gameType: GameType.Single,
    noteRanges: ["e/4:::e/5"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: true,
    keySignatures: [KeySignature.G, KeySignature.F, KeySignature.D],
    scaleType: ScaleType.Diatonic,
  },
  {
    id: "treble-04",
    index: 3,
    name: "basics 04",
    description: "",
    clef: Clef.Treble,
    gameType: GameType.Single,
    noteRanges: ["d/4:::f#/5"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
    hasKey: false,
    accident: Accident["#"],
  },
  {
    id: "treble-05",
    index: 4,
    name: "basics 05",
    description: "",
    clef: Clef.Treble,
    gameType: GameType.Single,
    noteRanges: ["db/4:::ab/5"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
    hasKey: false,
    accident: Accident["b"],
  },
];

const BASS_LEVELS: Level[] = [
  {
    id: "bass-01",
    index: 0,
    name: "basics 01",
    description: "",
    clef: Clef.Bass,
    gameType: GameType.Single,
    noteRanges: ["g/2:::c/3"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: false,
    accident: Accident.None,
  },
  {
    id: "bass-02",
    index: 1,
    name: "2 ranges",
    description: "",
    clef: Clef.Bass,
    gameType: GameType.Single,
    noteRanges: ["c/2:::g/2", "c/3:::g/3"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: false,
    accident: Accident.None,
  },
  {
    id: "bass-03",
    index: 2,
    name: "3 ranges!",
    description: "",
    clef: Clef.Bass,
    gameType: GameType.Single,
    noteRanges: ["c/2:::g/2", "c/3:::g/3", "c/4:::g/4"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: false,
    accident: Accident.None,
  },
];

export const ALL_LEVELS = [...TREBLE_LEVELS, ...BASS_LEVELS];
// console.log(JSON.stringify(ALL_LEVELS, null, 2));

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
