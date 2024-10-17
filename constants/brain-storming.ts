import { getRandInRange } from "./helperFns";
import {
  DOUBLE_FLAT_NOTES_ALL_OCTAVES,
  DOUBLE_SHARP_NOTES_ALL_OCTAVES,
  ALL_NOTES_FLAT,
  NOTES_FLAT_ALL_OCTAVES,
  ALL_NOTES_SHARP,
  NOTES_SHARP_ALL_OCTAVES,
  NOTES_SHARP_FLAT_ALL_OCTAVES,
  POSSIBLE_NOTES_ALL_OCTAVES,
  WHITE_NOTES_ALL_OCTAVES,
} from "./notes";
import { Accident, GameScore, GameState, Note, NoteRange } from "./types";

export enum keySignature {
  C = "C",
  G = "G",
  D = "D",
  A = "A",
  E = "E",
  B = "B",
  "F#" = "F#",
  "C#" = "C#",
  Am = "Am",
  Em = "Em",
  Bm = "Bm",
  "F#m" = "F#m",
  "C#m" = "C#m",
  "G#m" = "G#m",
  "D#m" = "D#m",
  "A#m" = "A#m",
  F = "F",
  Bb = "Bb",
  Eb = "Eb",
  Ab = "Ab",
  Db = "Db",
  Gb = "Gb",
  Cb = "Cb",
  Dm = "Dm",
  Gm = "Gm",
  Cm = "Cm",
  Fm = "Fm",
  Bbm = "Bbm",
  Ebm = "Ebm",
  Abm = "Abm",
}

const diatonicKeyNotes: Record<keySignature, string[]> = {
  [keySignature.C]: ["c", "d", "e", "f", "g", "a", "b"],
  [keySignature.G]: ["g", "a", "b", "c", "d", "e", "f#"],
  [keySignature.D]: ["d", "e", "f#", "g", "a", "b", "c#"],
  [keySignature.A]: ["a", "b", "c#", "d", "e", "f#", "g#"],
  [keySignature.E]: ["e", "f#", "g#", "a", "b", "c#", "d#"],
  [keySignature.B]: ["b", "c#", "d#", "e", "f#", "g#", "a#"],
  [keySignature["F#"]]: ["f#", "g#", "a#", "b", "c#", "d#", "e#"],
  [keySignature["C#"]]: ["c#", "d#", "e#", "f#", "g#", "a#", "b#"],
  [keySignature.Am]: ["a", "b", "c", "d", "e", "f", "g"],
  [keySignature.Em]: ["e", "f#", "g", "a", "b", "c", "d"],
  [keySignature.Bm]: ["b", "c#", "d", "e", "f#", "g", "a"],
  [keySignature["F#m"]]: ["f#", "g#", "a", "b", "c#", "d", "e"],
  [keySignature["C#m"]]: ["c#", "d#", "e", "f#", "g#", "a", "b"],
  [keySignature["G#m"]]: ["g#", "a#", "b", "c#", "d#", "e", "f#"],
  [keySignature["D#m"]]: ["d#", "e#", "f#", "g#", "a#", "b", "c#"],
  [keySignature["A#m"]]: ["a#", "b#", "c#", "d#", "e#", "f#", "g#"],
  [keySignature.F]: ["f", "g", "a", "bb", "c", "d", "e"],
  [keySignature.Bb]: ["bb", "c", "d", "eb", "f", "g", "a"],
  [keySignature.Eb]: ["eb", "f", "g", "ab", "bb", "c", "d"],
  [keySignature.Ab]: ["ab", "bb", "c", "db", "eb", "f", "g"],
  [keySignature.Db]: ["db", "eb", "f", "gb", "ab", "bb", "c"],
  [keySignature.Gb]: ["gb", "ab", "bb", "cb", "db", "eb", "f"],
  [keySignature.Cb]: ["cb", "db", "eb", "fb", "gb", "ab", "bb"],
  [keySignature.Dm]: ["d", "e", "f", "g", "a", "bb", "c"],
  [keySignature.Gm]: ["g", "a", "bb", "c", "d", "eb", "f"],
  [keySignature.Cm]: ["c", "d", "eb", "f", "g", "ab", "bb"],
  [keySignature.Fm]: ["f", "g", "ab", "bb", "c", "db", "eb"],
  [keySignature.Bbm]: ["bb", "c", "db", "eb", "f", "gb", "ab"],
  [keySignature.Ebm]: ["eb", "f", "gb", "ab", "bb", "cb", "db"],
  [keySignature.Abm]: ["ab", "bb", "cb", "db", "eb", "fb", "gb"],
};

const chromaticNotes: Record<keySignature, string[]> = {
  [keySignature.C]: ["c", "db", "d", "d#", "e", "f", "f#", "g", "ab", "a", "bb", "b"],
  [keySignature.G]: ["g", "ab", "a", "bb", "b", "c", "c#", "d", "eb", "e", "f", "f#"],
  [keySignature.D]: ["d", "eb", "e", "f", "f#", "g", "g#", "a", "bb", "b", "c", "c#"],
  [keySignature.A]: ["a", "bb", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"],
  [keySignature.E]: ["e", "f", "f#", "g", "g#", "a", "a#", "b", "c", "c#", "d", "d#"],
  [keySignature.B]: ["b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#"],
  [keySignature["F#"]]: ["f#", "g", "g#", "a", "a#", "b", "c", "c#", "d", "d#", "e", "f"],
  [keySignature["C#"]]: ["c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", "c"],
  [keySignature.Am]: ["a", "bb", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"],
  [keySignature.Em]: ["e", "f", "f#", "g", "g#", "a", "a#", "b", "c", "c#", "d", "d#"],
  [keySignature.Bm]: ["b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#"],
  [keySignature["F#m"]]: ["f#", "g", "g#", "a", "a#", "b", "c", "c#", "d", "d#", "e", "f"],
  [keySignature["C#m"]]: ["c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", "c"],
  [keySignature["G#m"]]: ["g#", "a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g"],
  [keySignature["D#m"]]: ["d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", "c", "c#", "d"],
  [keySignature["A#m"]]: ["a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a"],
  [keySignature.F]: ["f", "gb", "g", "g#", "a", "bb", "b", "c", "db", "d", "eb", "e"],
  [keySignature.Bb]: ["bb", "b", "c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a"],
  [keySignature.Eb]: ["eb", "e", "f", "gb", "g", "ab", "a", "bb", "cb", "c", "db", "d"],
  [keySignature.Ab]: ["ab", "a", "bb", "b", "c", "db", "d", "eb", "e", "f", "gb", "g"],
  [keySignature.Db]: ["db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b", "c"],
  [keySignature.Gb]: ["gb", "g", "ab", "a", "bb", "cb", "c", "db", "d", "eb", "e", "f"],
  [keySignature.Cb]: ["cb", "c", "db", "d", "eb", "fb", "f", "gb", "g", "ab", "a", "bb"],
  [keySignature.Dm]: ["d", "eb", "e", "f", "f#", "g", "g#", "a", "bb", "b", "c", "c#"],
  [keySignature.Gm]: ["g", "ab", "a", "bb", "b", "c", "c#", "d", "eb", "e", "f", "f#"],
  [keySignature.Cm]: ["c", "db", "d", "d#", "e", "f", "f#", "g", "ab", "a", "bb", "b"],
  [keySignature.Fm]: ["f", "gb", "g", "g#", "a", "bb", "b", "c", "db", "d", "eb", "e"],
  [keySignature.Bbm]: ["bb", "b", "c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a"],
  [keySignature.Ebm]: ["eb", "e", "f", "gb", "g", "ab", "a", "bb", "cb", "c", "db", "d"],
  [keySignature.Abm]: ["ab", "a", "bb", "b", "c", "db", "d", "eb", "e", "f", "gb", "g"],
};

enum Clef {
  treble,
  bass,
  // both, // treble + bass
}

enum GameType {
  Single = "single",
  Chord = "chord",
  Melody = "melody",
  Rhythm = "rhythm",
}

enum WinRank {
  Gold = "gold",
  Silver = "silver",
  Bronze = "bronze",
}

/**
 * hits per minute
 *
 * ```// example: { gold: 40, silver: 37, bronze: 32 }```
 */
type WinConditions = {
  [WinRank.Gold]: number;
  [WinRank.Silver]: number;
  [WinRank.Bronze]: number;
};

export enum ScaleType {
  Diatonic = "diatonic",
  Chromatic = "chromatic",
}

type GameKeySettings =
  | { hasKey: true; keySignatures: Array<keySignature>; scaleType: ScaleType }
  | { hasKey: false; accident: Accident };

type GameSettings =
  | ({
      gameType: GameType.Single | GameType.Chord;
      clef: Clef;
      noteRanges: Array<NoteRange>;
    } & GameKeySettings)
  | ({
      gameType: GameType.Melody;
      clef: Clef;
      noteRanges: Array<NoteRange>;
      timeSignature: string;
    } & GameKeySettings)
  | {
      gameType: GameType.Rhythm;
      timeSignature: string;
    };

type Level = GameSettings & {
  id: string;
  index: number;
  name: string;
  description: string;
  durationInSeconds: number;
  winConditions: WinConditions;
};

type SingleRound = {
  attempt: Note | null;
  value: Note;
};

type ChordRound = {
  attempt: Note[];
  value: Note[];
};

type MelodyRound = Array<{
  attempt: Note[];
  value: Note[];
}>;

type RhythmRound = Array<{
  attempt: number | null;
  value: number;
}>;

type Round = SingleRound | ChordRound | MelodyRound | RhythmRound;

type Game = {
  id: string;
  level_id: string;
  timestamp: number;
  durationInSeconds: number;
} & (
  | {
      type: GameType.Single;
      rounds: SingleRound[];
    }
  | {
      type: GameType.Chord;
      rounds: ChordRound[];
    }
  | {
      type: GameType.Melody;
      rounds: MelodyRound[];
    }
  | {
      type: GameType.Rhythm;
      rounds: RhythmRound[];
    }
);

export function decideNextRound(level: Level, previousRound?: Round) {
  switch (level.gameType) {
    case GameType.Single: {
      return {
        value: generateRandomNote(level, previousRound as SingleRound),
        attempt: null,
      };
    }
    // TODO
    // case GameType.Chord: {
    //   return {
    //     value: generateRandomChord(level, previousRound as ChordRound),
    //     attempt: null,
    //   };
    // }
    // case GameType.Melody: {
    //   return {
    //     value: generateRandomMelody(level, previousRound as MelodyRound),
    //     attempt: null,
    //   };
    // }
    // case GameType.Rhythm: {
    //   return {
    //     value: generateRandomRhythm(level, previousRound as RhythmRound),
    //     attempt: null,
    //   };
    // }
  }
}

export function generateRandomNote(level: Level, previousRound?: SingleRound): Note {
  if (level.gameType !== GameType.Single) throw Error("gameType incompatible");

  let possibleNotes: Note[];
  if (level.hasKey) {
    const keySignature = pickKeySignature(level.keySignatures);
    possibleNotes = getGamePitchesInAllOctaves({ keySignature, scaleType: level.scaleType });
  } else {
    possibleNotes = getGamePitchesInAllOctaves({ accident: level.accident });
  }

  let rangeNotes = getNotesInRange(level.noteRanges, possibleNotes);
  if (previousRound) {
    rangeNotes = rangeNotes.filter((note) => note === previousRound.value);
  }
  const nextNote = pickNextRoundNote(rangeNotes);
  return nextNote;
}
export function generateRandomChord(level: Level, previousRound: ChordRound) {
  if (level.gameType !== GameType.Chord) throw Error("gameType incompatible");
}
export function generateRandomMelody(level: Level, previousRound: MelodyRound) {
  if (level.gameType !== GameType.Melody) throw Error("gameType incompatible");
}
export function generateRandomRhythm(level: Level, previousRound: RhythmRound) {
  if (level.gameType !== GameType.Rhythm) throw Error("gameType incompatible");
}

export function pickKeySignature(keySignatures: keySignature[]) {
  if (keySignatures.length === 0) {
    return keySignature.C;
  }
  const randomIndex = Math.floor(Math.random() * keySignatures.length);
  return keySignatures[randomIndex];
}

type GetGamePitchSpec =
  | {
      keySignature: keySignature;
      scaleType: ScaleType;
    }
  | {
      accident: Accident;
    };

export function getNotesInRange(ranges: NoteRange[], possibleNotes: Note[]) {
  const noteSet = new Set<Note>();
  for (const range of ranges) {
    const [lowNote, highNote] = range.split(":::");
    let [lowIdx, highIdx] = [
      possibleNotes.findIndex((n) => n === lowNote),
      possibleNotes.findIndex((n) => n === highNote),
    ];

    for (let idx = lowIdx; idx <= highIdx; highIdx++) {
      noteSet.add(possibleNotes[idx]);
    }
  }
  return Array.from(noteSet);
}

export function pickNextRoundNote(rangeNotes: Note[]): Note {
  const chosenIdx = getRandInRange(0, rangeNotes.length - 1);
  const chosenNote = rangeNotes[chosenIdx];
  return chosenNote;
}

const accidentNoteSequences = {
  [Accident.None]: WHITE_NOTES_ALL_OCTAVES,
  [Accident["#"]]: NOTES_SHARP_ALL_OCTAVES,
  [Accident.b]: NOTES_FLAT_ALL_OCTAVES,
  [Accident["#b"]]: NOTES_SHARP_FLAT_ALL_OCTAVES,
  [Accident.x]: DOUBLE_SHARP_NOTES_ALL_OCTAVES,
  [Accident.bb]: DOUBLE_FLAT_NOTES_ALL_OCTAVES,
  [Accident.All]: POSSIBLE_NOTES_ALL_OCTAVES,
};
const scaleTypeNoteSequences = {
  [ScaleType.Chromatic]: chromaticNotes,
  [ScaleType.Diatonic]: diatonicKeyNotes,
};

export function getGamePitchesInAllOctaves(options: GetGamePitchSpec) {
  if ((options as any)?.accident) {
    const safeOpts = options as { accident: Accident };
    return accidentNoteSequences[safeOpts.accident];
  }
  //
  else if ((options as any)?.keySignature) {
    const safeOpts = options as { keySignature: keySignature; scaleType: ScaleType };
    const noteMap = scaleTypeNoteSequences[safeOpts.scaleType];
    const scaleNotes = noteMap[safeOpts.keySignature];
    const availableNotes: Note[] = [];
    for (let oct = 1; oct < 9; oct++) {
      scaleNotes.forEach((n) => {
        availableNotes.push(`${n}/${oct}`);
      });
    }
    return availableNotes;
  } else {
    return [];
  }
}

const levels: Level[] = [
  {
    id: "01",
    index: 0,
    name: "basics 01",
    description: "",
    clef: Clef.treble,
    gameType: GameType.Single,
    noteRanges: ["g/4:::c/5"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: false,
    accident: Accident.None,
  },
  {
    id: "02",
    index: 0,
    name: "basics 02",
    description: "",
    clef: Clef.treble,
    gameType: GameType.Single,
    noteRanges: ["f/4:::d/5"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: true,
    keySignatures: [keySignature.C],
    scaleType: ScaleType.Diatonic,
  },
  {
    id: "03",
    index: 0,
    name: "basics 03",
    description: "",
    clef: Clef.treble,
    gameType: GameType.Single,
    noteRanges: ["e/4:::e/5"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 20, [WinRank.Silver]: 16, [WinRank.Bronze]: 12 },
    hasKey: true,
    keySignatures: [keySignature.G, keySignature.F, keySignature.D],
    scaleType: ScaleType.Diatonic,
  },
  {
    id: "04",
    index: 0,
    name: "basics 04",
    description: "",
    clef: Clef.treble,
    gameType: GameType.Single,
    noteRanges: ["d/4:::f#/5"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
    hasKey: false,
    accident: Accident["#"],
  },
  {
    id: "05",
    index: 0,
    name: "basics 05",
    description: "",
    clef: Clef.treble,
    gameType: GameType.Single,
    noteRanges: ["db/4:::ab/5"],
    durationInSeconds: 20,
    winConditions: { [WinRank.Gold]: 22, [WinRank.Silver]: 18, [WinRank.Bronze]: 14 },
    hasKey: false,
    accident: Accident["b"],
  },
];

// const game1: Game = {
//   id: "",
//   level_id: "",
//   durationInSeconds: 30,
//   timestamp: 1029839080982,
//   type: GameType.Single,
//   rounds: [
//     { value: "c/5", attempt: null },
//     { value: "eb/5", attempt: null },
//   ],
// };

// const game2: Game = {
//   id: "",
//   level_id: "",
//   durationInSeconds: 30,
//   timestamp: 1029839080982,
//   type: GameType.Rhythm,
//   rounds: [
//     [
//       { value: 10, attempt: null },
//       { value: 2, attempt: null },
//     ],
//     [
//       { value: 4, attempt: null },
//       { value: 2, attempt: null },
//       { value: 2, attempt: null },
//     ],
//   ],
// };

// const games: Game[] = [game1, game2];
// games.forEach((g) => {
//   if (g.type === GameType.Single) {
//     g.rounds[0].value;
//   }

//   if (g.type === GameType.Melody) {
//     g.rounds[0][0].value;
//   }

//   if (g.type === GameType.Chord) {
//     g.rounds[0].value[0];
//   }
// });
