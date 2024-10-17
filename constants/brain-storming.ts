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
import { GameScore, GameState, Note, NoteRange } from "./types";

enum keySignature {
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

enum Clef {
  treble,
  bass,
  // both, // treble + bass
}

enum Accident {
  "None" = "none",
  "#" = "#",
  "b" = "b",
  "#b" = "#b",
  "x" = "x",
  "bb" = "bb",
  "All" = "all",
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

type GameKeySettings = { hasKey: true; keySignatures: Array<keySignature> } | { hasKey: false; accident: Accident };

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
  attempt: Note;
  answer: Note;
};

type ChordRound = {
  attempt: Note[];
  answer: Note[];
};

type MelodyRound = Array<{
  attempt: Note[];
  answer: Note[];
}>;

type RhythmRound = Array<{
  attempt: number;
  answer: number;
}>;

type Round = SingleRound | ChordRound | MelodyRound | RhythmRound;

// type Game =
//   | {
//       type: GameType.Single;
//       rounds: { attempt: Note | null; answer: Note }[];
//     }
//   | {
//       type: GameType.Chord;
//       rounds: { attempt: Note[] | null; answer: Note[] }[];
//     }
//   | {
//       type: GameType.Melody;
//       rounds: { attempt: Note | null; answer: Note }[][];
//     }
//   | {
//       type: GameType.Rhythm;
//       rounds: { attempt: number | null; answer: number }[][];
//     };

function decideNextRound(level: Level, previousRound?: Round) {
  switch (level.gameType) {
    case GameType.Single: {
      return {
        answer: generateRandomNote(level, previousRound as SingleRound),
        attempt: null,
      };
    }
    case GameType.Chord: {
      return {
        answer: generateRandomChord(level, previousRound as ChordRound),
        attempt: null,
      };
    }
    case GameType.Melody: {
      return {
        answer: generateRandomMelody(level, previousRound as MelodyRound),
        attempt: null,
      };
    }
    case GameType.Rhythm: {
      return {
        answer: generateRandomRhythm(level, previousRound as RhythmRound),
        attempt: null,
      };
    }
  }
}

function generateRandomNote(level: Level, previousRound?: SingleRound) /* : Note */ {
  if (level.gameType !== GameType.Single) throw Error("gameType incompatible");
  let possibleNotes: Note[] = [];

  if (level.hasKey) {
    const keySignature = pickKeySignature(level.keySignatures);
    possibleNotes = getAllNotesInRange(level.noteRanges, { keySignature });
  } else {
    possibleNotes = getAllNotesInRange(level.noteRanges, { accident: level.accident });
  }

  if (previousRound) {
    // possibleNotes = possibleNotes.filter(note => note === previousRound.answer)
  }
  // return pickRandom(possibleNotes);
}
function generateRandomChord(level: Level, previousRound: ChordRound) {
  if (level.gameType !== GameType.Chord) throw Error("gameType incompatible");
}
function generateRandomMelody(level: Level, previousRound: MelodyRound) {
  if (level.gameType !== GameType.Melody) throw Error("gameType incompatible");
}
function generateRandomRhythm(level: Level, previousRound: RhythmRound) {
  if (level.gameType !== GameType.Rhythm) throw Error("gameType incompatible");
}

function pickKeySignature(keySignatures: keySignature[]) {
  if (keySignatures.length === 0) {
    return keySignature.C;
  }
  const randomIndex = Math.floor(Math.random() * keySignatures.length);
  return keySignatures[randomIndex];
}

function getAllNotesInRange(ranges: NoteRange[], options: { keySignature?: keySignature; accident?: Accident }) {
  let availableNotes;

  if (options.accident) {
    switch (options.accident) {
      case Accident.None:
        availableNotes = WHITE_NOTES_ALL_OCTAVES;
        break;
      case Accident["#"]:
        availableNotes = NOTES_SHARP_ALL_OCTAVES;
        break;
      case Accident.b:
        availableNotes = NOTES_FLAT_ALL_OCTAVES;
        break;
      case Accident["#b"]:
        availableNotes = NOTES_SHARP_FLAT_ALL_OCTAVES;
        break;
      case Accident.x:
        availableNotes = DOUBLE_SHARP_NOTES_ALL_OCTAVES;
        break;
      case Accident.bb:
        availableNotes = DOUBLE_FLAT_NOTES_ALL_OCTAVES;
        break;
      case Accident.All:
        availableNotes = POSSIBLE_NOTES_ALL_OCTAVES;
        break;
    }
  } else if (options.keySignature) {
  }

  for (const range of ranges) {
  }
}

// interface Round {
//   attempt: any; // Placeholder for attempt type based on game type
//   answer: any; // Placeholder for answer type based on game type
// }

// // Implement specific round types with conditional types

// // Function to get specific round type based on GameType
// type GetRoundType<T extends GameType> = T extends GameType.Single
//   ? SingleRound
//   : T extends GameType.Chord
//   ? ChordRound
//   : T extends GameType.Melody
//   ? MelodyRound
//   : T extends GameType.Rhythm
//   ? RhythmRound
//   : never;

// // Usage example
// function playRound<T extends GameType>(gameType: T, level: Level): GetRoundType<T> {
//   const roundData = computeRoundData(gameType, level); // Replace with your logic to compute round data
//   return {
//     attempt: roundData.attempt,
//     answer: roundData.answer,
//   };
// }

// function computeRoundData<T extends GameType>(gameType: T, level: Level): GetRoundType<T> {
//   switch (gameType) {
//     case GameType.Single:
//       return {
//         attempt: generateRandomNote(level.noteRanges, level.keySignature),
//         answer: generateRandomNote(level.noteRanges, level.keySignature),
//       };
//     case GameType.Chord:
//       return {
//         attempt: generateRandomChord(level.noteRanges, level.keySignature),
//         answer: generateRandomChord(level.noteRanges, level.keySignature),
//       };
//     case GameType.Melody:
//       return {
//         attempt: generateRandomMelody(level.noteRanges, level.timeSignature, level.keySignature),
//         answer: generateRandomMelody(level.noteRanges, level.timeSignature, level.keySignature),
//       };
//     case GameType.Rhythm:
//       return {
//         attempt: generateRandomRhythm(level.timeSignature),
//         answer: generateRandomRhythm(level.timeSignature),
//       };
//     default:
//       throw new Error(`Unsupported GameType: ${gameType}`);
//   }
// }

// function generateRandomRhythm(noteRanges: NoteRange[], keySignature: string) {}
