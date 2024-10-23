import { WinRank, KeySignature, ScaleType, Accident, GameType, Clef } from "./enums";
import { FLAT_KEY_SIGNATURES } from "./notes";

export enum NoteName {
  "c" = "c",
  "b#" = "b#",
  "dbb" = "dbb",
  "c#" = "c#",
  "db" = "db",
  "d" = "d",
  "cx" = "cx",
  "ebb" = "ebb",
  "d#" = "d#",
  "eb" = "eb",
  "e" = "e",
  "dx" = "dx",
  "fb" = "fb",
  "f" = "f",
  "e#" = "e#",
  "gbb" = "gbb",
  "f#" = "f#",
  "gb" = "gb",
  "g" = "g",
  "fx" = "fx",
  "abb" = "abb",
  "g#" = "g#",
  "ab" = "ab",
  "a" = "a",
  "gx" = "gx",
  "bbb" = "bbb",
  "a#" = "a#",
  "bb" = "bb",
  "b" = "b",
  "ax" = "ax",
  "cb" = "cb",
}

// exceptions b0, c8
type NoteOctave = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type AppNote = "b/0" | "ax/0" | "cb/0" | `${NoteName}/${NoteOctave}` | "c/8" | "b#/8" | "dbb/8";

const noteMathTable: NoteName[][] = [
  [NoteName["c"], NoteName["b#"], NoteName["dbb"]],
  [NoteName["c#"], NoteName["db"]],
  [NoteName["d"], NoteName["cx"], NoteName["ebb"]],
  [NoteName["d#"], NoteName["eb"]],
  [NoteName["e"], NoteName["dx"], NoteName["fb"]],
  [NoteName["f"], NoteName["e#"], NoteName["gbb"]],
  [NoteName["f#"], NoteName["gb"]],
  [NoteName["g"], NoteName["fx"], NoteName["abb"]],
  [NoteName["g#"], NoteName["ab"]],
  [NoteName["a"], NoteName["gx"], NoteName["bbb"]],
  [NoteName["a#"], NoteName["bb"]],
  [NoteName["b"], NoteName["ax"], NoteName["cb"]],
];

function isNatural(note: AppNote): boolean {
  const noteName = note.split("/")[0] as NoteName;
  return noteName.length === 1;
}
function isSimpleSharp(note: AppNote): boolean {
  const noteName = note.split("/")[0] as NoteName;
  return noteName.length === 2 && noteName[1] === "#" && !["b#", "e#"].includes(noteName);
}
function isSimpleFlat(note: AppNote): boolean {
  const noteName = note.split("/")[0] as NoteName;
  return noteName.length === 2 && noteName[1] === "b" && !["cb", "fb"].includes(noteName);
}

export function getNoteIdx(note: AppNote) {
  const idx = PITCH_INDICES.get(note) ?? -1;
  if (idx < 0) {
    console.error("<<< getNoteIdx [ERROR]", { note, idx, PITCH_INDICES });
  }
  return idx;
}

export function isFlatKeySignature(keySignature: KeySignature) {
  return FLAT_KEY_SIGNATURES.includes(keySignature);
}

export function getNoteFromIdx(noteIdx: number, isFlatKeySignature = true) {
  const resultNote = isFlatKeySignature ? NOTE_INDICES_FLAT.get(noteIdx) : NOTE_INDICES_SHARP.get(noteIdx);
  if (!resultNote) {
    console.error(`getNoteFromIdx [ERROR]:: Could not find note for index ${noteIdx}`);
  }
  return resultNote;
}

export function addHalfSteps(note: AppNote, incr: number, isFlatKeySignature = true) {
  let noteIdx = getNoteIdx(note);

  let steps = Math.abs(incr);
  while (steps > 0) {
    noteIdx += incr;
    steps--;
  }

  const resultNote = getNoteFromIdx(noteIdx, isFlatKeySignature);
  return resultNote ?? note;
}

export function buildPitchIndexDicts() {
  const PITCH_INDICES = new Map<AppNote, number>();

  let oct = 1;
  let idx = 1;

  // set "b/0", "ax", "cb"
  noteMathTable[11].forEach((noteName) => {
    PITCH_INDICES.set(`${noteName}/0` as AppNote, 0);
  });

  while (oct < 8) {
    noteMathTable.forEach((noteNames) => {
      noteNames.forEach((noteName) => {
        PITCH_INDICES.set(`${noteName}/${oct}` as AppNote, idx);
      });
      idx++;
    });
    oct++;
  }

  // set "c/8", "b#", "dbb",
  noteMathTable[0].forEach((noteName) => {
    PITCH_INDICES.set(`${noteName}/8` as AppNote, PITCH_INDICES.size);
  });

  const NOTE_INDICES = new Map<number, AppNote[]>();
  const NOTE_INDICES_FLAT = new Map<number, AppNote>();
  const NOTE_INDICES_SHARP = new Map<number, AppNote>();
  Array.from(PITCH_INDICES.entries()).forEach(([note, idx]) => {
    if (isNatural(note) || isSimpleFlat(note)) {
      NOTE_INDICES_FLAT.set(idx, note);
    }
    if (isNatural(note) || isSimpleSharp(note)) {
      NOTE_INDICES_SHARP.set(idx, note);
    }

    NOTE_INDICES.has(idx) ? NOTE_INDICES.get(idx)?.push(note) : NOTE_INDICES.set(idx, [note]);
  });
  console.log("buildPitchIndicesDict:::", { PITCH_INDICES, NOTE_INDICES_FLAT, NOTE_INDICES_SHARP });
  return { PITCH_INDICES, NOTE_INDICES_FLAT, NOTE_INDICES_SHARP, NOTE_INDICES };
}

export const { PITCH_INDICES, NOTE_INDICES_FLAT, NOTE_INDICES_SHARP, NOTE_INDICES } = buildPitchIndexDicts();
