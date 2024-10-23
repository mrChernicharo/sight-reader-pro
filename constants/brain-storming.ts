import { Accident, GameType, KeySignature, ScaleType } from "./enums";
import { getRandInRange, isNoteMatch } from "./helperFns";
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
  noteMathTable,
} from "./notes";
import { ChordRound, Level, MelodyRound, Note, NoteRange, RhythmRound, SingleNoteRound } from "./types";
import {
  AppNote,
  NOTE_INDICES_FLAT,
  NOTE_INDICES_SHARP,
  NOTE_INDICES,
  addHalfSteps,
  getNoteFromIdx,
  getNoteIdx,
  isFlatKeySignature as isKeySignatureFlat,
} from "./types.2";

function generateRandomChord(level: Level, previousRound: ChordRound) {
  if (level.gameType !== GameType.Chord) throw Error("gameType incompatible");
}
function generateRandomMelody(level: Level, previousRound: MelodyRound) {
  if (level.gameType !== GameType.Melody) throw Error("gameType incompatible");
}
function generateRandomRhythm(level: Level, previousRound: RhythmRound) {
  if (level.gameType !== GameType.Rhythm) throw Error("gameType incompatible");
}

// function incrementNote(note: Note, keySignature: KeySignature): Note {
//   // const isFlat = FLAT_KEY_SIGNATURES.includes(keySignature);

//   let [n, oct] = note.split("/");

//   const mathIdx = noteMathTable.findIndex((noteNames) => noteNames.includes(n));
//   let nextIdx = -1;
//   if (mathIdx === noteMathTable.length - 1) {
//     oct = String(+oct + 1);
//     nextIdx = 0;
//   } else {
//     nextIdx = mathIdx + 1;
//   }
//   // const nextIdx = mathIdx === noteMathTable.length - 1 ? 0 : mathIdx + 1
//   const nextNoteOpts = noteMathTable[nextIdx];
//   const nextNote = nextNoteOpts.find((noteOpt) => chromaticNotes[keySignature].includes(noteOpt));

//   if (!nextNote) {
//     console.error("oooohhh shit...");
//   }

//   const finalNote = `${nextNote}/${oct}` as Note;
//   // console.log("incrementNote :::", { nextNoteOpts, nextNote, note, keySignature, finalNote });
//   return finalNote;
// }

// function decrementNote(note: Note, keySignature: KeySignature): Note {
//   // const isFlat = FLAT_KEY_SIGNATURES.includes(keySignature);
//   let [n, oct] = note.split("/");

//   const mathIdx = noteMathTable.findIndex((noteNames) => noteNames.includes(n));
//   let nextIdx = -1;
//   if (mathIdx === 0) {
//     oct = String(+oct - 1);
//     nextIdx = noteMathTable.length - 1;
//   } else {
//     nextIdx = mathIdx - 1;
//   }
//   // const nextIdx = mathIdx === noteMathTable.length - 1 ? 0 : mathIdx + 1
//   const nextNoteOpts = noteMathTable[nextIdx];
//   const nextNote = nextNoteOpts.find((noteOpt) => chromaticNotes[keySignature].includes(noteOpt));

//   if (!nextNote) {
//     console.error("oooohhh shit...");
//   }

//   const finalNote = `${nextNote}/${oct}` as Note;
//   console.log("decrementNote :::", { nextNoteOpts, nextNote, note, keySignature, finalNote });
//   return finalNote;
// }

function getNotesInRange(ranges: NoteRange[], keyNotesInAllOctaves: AppNote[], keySignature: KeySignature) {
  // console.log(":::getNotesInRange", { keyNotesInAllOctaves, ranges });
  const isFlatKSig = isKeySignatureFlat(keySignature);

  const noteSet = new Set<Note>();
  for (const range of ranges) {
    let [rangeNoteLow, rangeNoteHigh] = range.split(":::") as [AppNote, AppNote];
    let [rangeNoteIdxLow, rangeNoteIdxHigh] = [rangeNoteLow, rangeNoteHigh].map(getNoteIdx);

    if (rangeNoteIdxLow > rangeNoteIdxHigh) {
      [rangeNoteHigh, rangeNoteLow] = [rangeNoteLow, rangeNoteHigh];
      [rangeNoteIdxHigh, rangeNoteIdxLow] = [rangeNoteIdxLow, rangeNoteIdxHigh];
    }

    let loKeyIdx = keyNotesInAllOctaves.findIndex((n) => n === rangeNoteLow);
    while (loKeyIdx < 0) {
      rangeNoteLow = addHalfSteps(rangeNoteLow, 1, isFlatKSig);
      loKeyIdx = keyNotesInAllOctaves.findIndex((n) => n === rangeNoteLow);
    }

    let hiKeyIdx = keyNotesInAllOctaves.findIndex((n) => n === rangeNoteHigh);
    while (hiKeyIdx < 0) {
      rangeNoteHigh = addHalfSteps(rangeNoteHigh, -1, isFlatKSig);
      hiKeyIdx = keyNotesInAllOctaves.findIndex((n) => n === rangeNoteHigh);
    }

    rangeNoteIdxLow = getNoteIdx(rangeNoteLow);
    rangeNoteIdxHigh = getNoteIdx(rangeNoteHigh);

    keyNotesInAllOctaves.forEach((note) => {
      if (getNoteIdx(note) >= rangeNoteIdxLow && getNoteIdx(note) <= rangeNoteIdxHigh) {
        // rangeNotes.push(note);
        noteSet.add(note);
      }
    });

    // console.log(":::getNotesInRange", {
    //   range,
    //   keyNotesInAllOctaves,
    //   rangeNoteHigh,
    //   rangeNoteIdxHigh,
    //   rangeNoteLow,
    //   rangeNoteIdxLow,
    //   keySignature,
    //   isFlatKSig,
    //   noteSet,
    // });

    // is note in keyNotes ?
    //

    // let [rangeNoteLowA, rangeNoteHighA] = pitchA.split("/");
    // if (rangeNoteLow)

    // pitchA -> a/4
    // possibleNotes [g/4, ab/4, bb/4]
    // if possibleNotes.includes(pitchA) return possibleNotes.findIndex
    // else if (lowNote) increment noteA
    // else if (hiNote) decrement noteA
    // const [pitchA, pitchB] = range.split(":::").sort() as [Note, Note];

    /************************************************************/

    // const [pitchA, pitchB] = range.split(":::").sort() as [AppNote, AppNote];
    // console.log("::: [pitchA, pitchB]", [pitchA, pitchB]);

    // const [noteA, octA] = pitchA.split("/");
    // let lowIdx = -1;
    // if (keyNotesInAllOctaves.includes(pitchA)) {
    //   lowIdx = keyNotesInAllOctaves.findIndex((n) => {
    //     const [nn, nOct] = n.split("/");
    //     return octA == nOct && isNoteMatch(nn, noteA);
    //   });
    // } else {
    //   const nextPitch = incrementNote(pitchA, keySignature);
    //   const [newNoteA, newOctA] = nextPitch.split("/");
    //   console.log("::: incrementNote -> [newNoteA, newOctA]", [newNoteA, newOctA]);

    //   lowIdx = keyNotesInAllOctaves.findIndex((n) => {
    //     const [nn, nOct] = n.split("/");
    //     return newOctA == nOct && isNoteMatch(nn, newNoteA);
    //   });
    // }

    // const [noteB, octB] = pitchB.split("/");
    // let highIdx = -1;
    // if (keyNotesInAllOctaves.includes(pitchB)) {
    //   highIdx = keyNotesInAllOctaves.findIndex((n) => {
    //     const [nn, nOct] = n.split("/");
    //     return octB == nOct && isNoteMatch(nn, noteB);
    //   });
    // } else {
    //   const nextPitch = decrementNote(pitchB, keySignature);
    //   const [newNoteB, newOctB] = nextPitch.split("/");
    //   console.log("::: decrementNote -> [newNoteB, newOctB]", [newNoteB, newOctB]);

    //   highIdx = keyNotesInAllOctaves.findIndex((n) => {
    //     const [nn, nOct] = n.split("/");
    //     return newOctB == nOct && isNoteMatch(nn, newNoteB);
    //   });
    // }

    // // TODO: this isn't working with busy keySignatures
    // // const noteIndices = [
    // //   possibleNotes.findIndex((n) => {
    // //     console.log(":::", { n, octA, noteA });
    // //     return octA == n.split("/")[1] && isNoteMatch(n.split("/")[0], noteA);
    // //   }),
    // //   possibleNotes.findIndex((n) => octB == n.split("/")[1] && isNoteMatch(n.split("/")[0], noteB)),
    // // ];
    // const sortedNoteIndices = [lowIdx, highIdx].sort();
    // let [low, high] = sortedNoteIndices;
    // // console.log(":::getNotesInRange", { range, possibleNotes: keyNotesInAllOctaves, noteA, octA, noteB, octB });
    // // console.log(":::getNotesInRange", { lowIdx, highIdx, low, high });
    // for (let idx = low; idx <= high; idx++) {
    //   const possibleNote = keyNotesInAllOctaves[idx];
    //   // console.log(":::getNotesInRange", { possibleNote });
    //   noteSet.add(possibleNote);
    // }
  }

  const result = Array.from(noteSet);
  // console.log(":::getNotesInRange", { result, noteSet });

  return result;
}

function pickNextRoundNote(rangeNotes: Note[]): Note {
  const chosenIdx = getRandInRange(0, rangeNotes.length - 1);
  const chosenNote = rangeNotes[chosenIdx];
  // console.log(":::pickNextRoundNote", { rangeNotes, chosenIdx, chosenNote });
  return chosenNote;
}

const accidentNoteSequences = {
  [Accident.None]: WHITE_NOTES_ALL_OCTAVES,
  [Accident["#"]]: NOTES_SHARP_ALL_OCTAVES,
  [Accident.b]: NOTES_FLAT_ALL_OCTAVES,
  // [Accident["#b"]]: NOTES_SHARP_FLAT_ALL_OCTAVES,
  // [Accident.x]: DOUBLE_SHARP_NOTES_ALL_OCTAVES,
  // [Accident.bb]: DOUBLE_FLAT_NOTES_ALL_OCTAVES,
  // [Accident.All]: POSSIBLE_NOTES_ALL_OCTAVES,
};
const scaleTypeNoteSequences = {
  [ScaleType.Chromatic]: chromaticNotes,
  [ScaleType.Diatonic]: diatonicKeyNotes,
};

type GetGamePitchSpec = { keySignature: KeySignature; scaleType: ScaleType } | { accident: Accident };
export function getGamePitchesInAllOctaves(options: GetGamePitchSpec): AppNote[] {
  // console.log("::: getGamePitchesInAllOctaves :::", { options, accidentNoteSequences });
  let result: Note[];
  if ((options as any)?.accident) {
    const safeOpts = options as { accident: Accident };
    result = accidentNoteSequences[safeOpts.accident];
  }
  //
  else if ((options as any)?.keySignature) {
    const safeOpts = options as { keySignature: KeySignature; scaleType: ScaleType };
    const noteMap = scaleTypeNoteSequences[safeOpts.scaleType];
    const scaleNoteNames = noteMap[safeOpts.keySignature];

    const availableNotes: Note[] = [];
    // const isFlat = isKeySignatureFlat(safeOpts.keySignature);
    // const allNotes = isFlat ? NOTE_INDICES_FLAT : NOTE_INDICES_SHARP;
    // //
    // allNotes.forEach((note) => {
    //   const noteMatchesScale = scaleNotes.includes(note.split("/")[0]);
    //   console.log({ note, scaleNotes, safeOpts, NOTE_INDICES, noteMatchesScale });
    //   if (noteMatchesScale) {
    //     availableNotes.push(note);
    //   }
    // });

    const allNotes = Array.from(NOTE_INDICES);
    allNotes.forEach(([idx, notes]) => {
      notes.forEach((note) => {
        const [nn, oct] = note.split("/");
        if (scaleNoteNames.includes(nn)) {
          availableNotes.push(note);
        }

        // if (scaleNotes.some(scaleNoteName =>))
      });
    });

    result = availableNotes;
  } else {
    result = [];
  }
  console.log("getGamePitchesInAllOctaves:::", { result });
  return result as AppNote[];
}

function generateRandomNote(level: Level, keySignature: KeySignature, previousRound?: SingleNoteRound): Note {
  if (level.gameType !== GameType.Single) throw Error("gameType incompatible");

  let possibleNotes: Note[];
  if (level.hasKey) {
    possibleNotes = getGamePitchesInAllOctaves({ keySignature, scaleType: level.scaleType });
  } else {
    possibleNotes = getGamePitchesInAllOctaves({ accident: level.accident });
  }

  let rangeNotes = getNotesInRange(level.noteRanges, possibleNotes as AppNote[], keySignature);
  if (previousRound) {
    rangeNotes = rangeNotes.filter((note) => note !== previousRound.value);
  }
  const nextNote = pickNextRoundNote(rangeNotes);
  // console.log("::: generateRandomNote :::", { possibleNotes, rangeNotes, nextNote });
  return nextNote;
}

export function decideNextRound<Round>(level: Level, keySignature: KeySignature, previousRound?: Round): Round {
  switch (level.gameType) {
    case GameType.Single: {
      const round = {
        value: generateRandomNote(level, keySignature, previousRound as SingleNoteRound),
        attempt: null,
      } as SingleNoteRound;

      // console.log(">>>>decideNextRound", { level, keySignature, previousRound, round });

      return round as Round;
    }
    case GameType.Chord: {
      //   return generateRandomChord(level, previousRound as ChordRound),
      return { value: ["c/4", "e/4", "g/4"], attempt: [] } as Round;
    }
    case GameType.Melody: {
      //  return  generateRandomMelody(level, previousRound as MelodyRound),
      return [{ value: ["c/4", "d/4", "e/4", "f/4", "g/4"], attempt: [] }] as Round;
    }
    case GameType.Rhythm: {
      // return generateRandomRhythm(level, previousRound as RhythmRound),
      return [{ value: 12, attempt: null }] as Round;
    }
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
