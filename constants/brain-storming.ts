import { LevelAccidentType, GameType, KeySignature, ScaleType } from "./enums";
import { NOTE_INDICES, addHalfSteps, getNoteIdx, getRandInRange } from "./helperFns";
import { accidentNoteSequences, scaleTypeNoteSequences } from "./notes";
import { Note, ChordRound, Level, MelodyRound, NoteRange, RhythmRound, SingleNoteRound } from "./types";

function generateRandomChord(level: Level, previousRound: ChordRound) {
  if (level.gameType !== GameType.Chord) throw Error("gameType incompatible");
}
function generateRandomMelody(level: Level, previousRound: MelodyRound) {
  if (level.gameType !== GameType.Melody) throw Error("gameType incompatible");
}
function generateRandomRhythm(level: Level, previousRound: RhythmRound) {
  if (level.gameType !== GameType.Rhythm) throw Error("gameType incompatible");
}

function getNotesInRange(ranges: NoteRange[], keyNotesInAllOctaves: Note[], keySignature: KeySignature) {
  // console.log(":::getNotesInRange", { keyNotesInAllOctaves, ranges });
  // const isFlatKSig = isFlatKeySignature(keySignature);
  const noteSet = new Set<Note>();

  for (const range of ranges) {
    let [rangeNoteLow, rangeNoteHigh] = range.split(":::") as [Note, Note];
    let [rangeNoteIdxLow, rangeNoteIdxHigh] = [rangeNoteLow, rangeNoteHigh].map(getNoteIdx);

    if (rangeNoteIdxLow > rangeNoteIdxHigh) {
      [rangeNoteHigh, rangeNoteLow] = [rangeNoteLow, rangeNoteHigh];
      [rangeNoteIdxHigh, rangeNoteIdxLow] = [rangeNoteIdxLow, rangeNoteIdxHigh];
    }

    let loKeyIdx = keyNotesInAllOctaves.findIndex((n) => n === rangeNoteLow);
    while (loKeyIdx < 0) {
      rangeNoteLow = addHalfSteps(rangeNoteLow, 1, keySignature);
      loKeyIdx = keyNotesInAllOctaves.findIndex((n) => n === rangeNoteLow);
    }

    let hiKeyIdx = keyNotesInAllOctaves.findIndex((n) => n === rangeNoteHigh);
    while (hiKeyIdx < 0) {
      rangeNoteHigh = addHalfSteps(rangeNoteHigh, -1, keySignature);
      hiKeyIdx = keyNotesInAllOctaves.findIndex((n) => n === rangeNoteHigh);
    }

    rangeNoteIdxLow = getNoteIdx(rangeNoteLow);
    rangeNoteIdxHigh = getNoteIdx(rangeNoteHigh);

    keyNotesInAllOctaves.forEach((note) => {
      if (getNoteIdx(note) >= rangeNoteIdxLow && getNoteIdx(note) <= rangeNoteIdxHigh) {
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
    // });
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

type GetGamePitchSpec = { keySignature: KeySignature; scaleType: ScaleType } | { accident: LevelAccidentType };
export function getGamePitchesInAllOctaves(options: GetGamePitchSpec): Note[] {
  // console.log("::: getGamePitchesInAllOctaves :::", { options, accidentNoteSequences });
  let result: Note[];
  if ((options as any)?.accident) {
    const safeOpts = options as { accident: LevelAccidentType };
    result = accidentNoteSequences[safeOpts.accident];
  }
  //
  else if ((options as any)?.keySignature) {
    const safeOpts = options as { keySignature: KeySignature; scaleType: ScaleType };
    const noteMap = scaleTypeNoteSequences[safeOpts.scaleType];
    const scaleNoteNames = noteMap[safeOpts.keySignature];

    const availableNotes: Note[] = [];

    const allNotes = Array.from(NOTE_INDICES);
    allNotes.forEach(([idx, notes]) => {
      notes.forEach((note) => {
        const [nn, oct] = note.split("/");
        if (scaleNoteNames.includes(nn)) {
          availableNotes.push(note);
        }
      });
    });

    result = availableNotes;
  } else {
    result = [];
  }
  // console.log("getGamePitchesInAllOctaves:::", { result });
  return result as Note[];
}

function generateRandomNote(level: Level, keySignature: KeySignature, previousRound?: SingleNoteRound): Note {
  if (level.gameType !== GameType.Single) throw Error("gameType incompatible");

  let possibleNotes: Note[];
  if (level.hasKey) {
    possibleNotes = getGamePitchesInAllOctaves({ keySignature, scaleType: level.scaleType });
  } else {
    possibleNotes = getGamePitchesInAllOctaves({ accident: level.accident });
  }

  let rangeNotes = getNotesInRange(level.noteRanges, possibleNotes as Note[], keySignature);
  if (previousRound) {
    rangeNotes = rangeNotes.filter((note) => note !== previousRound.value);
  }
  const nextNote = pickNextRoundNote(rangeNotes);
  console.log("::: generateRandomNote :::", { possibleNotes, rangeNotes, nextNote });
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
