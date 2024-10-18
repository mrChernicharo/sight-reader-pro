import { Accident, GameType, ScaleType, keySignature } from "./enums";
import { getRandInRange, pickKeySignature } from "./helperFns";
import {
  DOUBLE_FLAT_NOTES_ALL_OCTAVES,
  DOUBLE_SHARP_NOTES_ALL_OCTAVES,
  NOTES_FLAT_ALL_OCTAVES,
  NOTES_SHARP_ALL_OCTAVES,
  NOTES_SHARP_FLAT_ALL_OCTAVES,
  POSSIBLE_NOTES_ALL_OCTAVES,
  WHITE_NOTES_ALL_OCTAVES,
  chromaticNotes,
  diatonicKeyNotes,
} from "./notes";
import { ChordRound, Level, MelodyRound, Note, NoteRange, RhythmRound, SingleNoteRound } from "./types";

function generateRandomChord(level: Level, previousRound: ChordRound) {
  if (level.gameType !== GameType.Chord) throw Error("gameType incompatible");
}
function generateRandomMelody(level: Level, previousRound: MelodyRound) {
  if (level.gameType !== GameType.Melody) throw Error("gameType incompatible");
}
function generateRandomRhythm(level: Level, previousRound: RhythmRound) {
  if (level.gameType !== GameType.Rhythm) throw Error("gameType incompatible");
}

type GetGamePitchSpec = { keySignature: keySignature; scaleType: ScaleType } | { accident: Accident };
function getNotesInRange(ranges: NoteRange[], possibleNotes: Note[]) {
  const noteSet = new Set<Note>();
  for (const range of ranges) {
    const [lowNote, highNote] = range.split(":::");
    let [lowIdx, highIdx] = [
      possibleNotes.findIndex((n) => n === lowNote),
      possibleNotes.findIndex((n) => n === highNote),
    ];
    // console.log({ lowIdx, highIdx });
    for (let idx = lowIdx; idx < highIdx; idx++) {
      noteSet.add(possibleNotes[idx]);
    }
  }
  return Array.from(noteSet);
}

function pickNextRoundNote(rangeNotes: Note[]): Note {
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

function generateRandomNote(level: Level, previousRound?: SingleNoteRound): Note {
  if (level.gameType !== GameType.Single) throw Error("gameType incompatible");

  let options: GetGamePitchSpec;
  if (level.hasKey) {
    const keySignature = pickKeySignature(level.keySignatures);
    options = { keySignature, scaleType: level.scaleType };
  } else {
    options = { accident: level.accident };
  }

  const possibleNotes = getGamePitchesInAllOctaves(options);

  let rangeNotes = getNotesInRange(level.noteRanges, possibleNotes);
  if (previousRound) {
    rangeNotes = rangeNotes.filter((note) => note !== previousRound.value);
  }
  const nextNote = pickNextRoundNote(rangeNotes);
  // console.log("::: generateRandomNote :::", { possibleNotes, rangeNotes, nextNote });
  return nextNote;
}

export function decideNextRound<Round>(level: Level, previousRound?: Round) {
  switch (level.gameType) {
    case GameType.Single: {
      return {
        value: generateRandomNote(level, previousRound as SingleNoteRound),
        attempt: null,
      } as SingleNoteRound;
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
