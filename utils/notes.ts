/* https://www.alt-codes.net/music_note_alt_codes.php */

import { LevelAccidentType, KeySignature, NoteName, ScaleType } from "./enums";
import { Note } from "./types";

export const WHITE_NOTES = ["c", "d", "e", "f", "g", "a", "b"];
export const ALL_NOTES_SHARP = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
export const ALL_NOTES_FLAT = ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b"];

// prettier-ignore
export const ALL_NOTES = ["c", "c#", "db", "d", "d#", "eb", "e", "f", "f#", "gb", "g", "g#", "ab", "a", "a#", "bb", "b"];
// prettier-ignore
export const ALL_NOTES_SHARP_DOUBLE_SHARP = ["c", "c#", "cx", "d", "d#", "dx", "e", "e#", "f", "f#", "fx", "g", "g#", "gx", "a", "a#", "b", "b#"]
// prettier-ignore
export const ALL_NOTES_FLAT_DOUBLE_FLAT = ["cb", "c", "dbb", "db", "d",  "ebb", "eb", "e", "fb", "f", "gbb", "gb", "g", "abb", "ab", "a", "bbb", "bb", "b"];
// ["cx", "dx", "e#", "fx", "gx", "ax", "b#"];
// ["cb", "dbb", "ebb", "fb", "gbb", "abb", "bbb"];

export const WHITE_NOTES_ALL_OCTAVES: Note[] = [];
WHITE_NOTES_ALL_OCTAVES.push("b/0");
let oct = 1;
while (oct < 8) {
  WHITE_NOTES.forEach((n) => {
    const note = `${n}/${oct}` as Note;
    WHITE_NOTES_ALL_OCTAVES.push(note);
  });
  oct++;
}
WHITE_NOTES_ALL_OCTAVES.push("c/8");

// #
export const NOTES_SHARP_ALL_OCTAVES: Note[] = [];
NOTES_SHARP_ALL_OCTAVES.push("b/0");
oct = 1;
while (oct < 8) {
  ALL_NOTES_SHARP.forEach((n) => {
    const note = `${n}/${oct}` as Note;
    NOTES_SHARP_ALL_OCTAVES.push(note);
  });
  oct++;
}
NOTES_SHARP_ALL_OCTAVES.push("c/8");

// b
export const NOTES_FLAT_ALL_OCTAVES: Note[] = [];
NOTES_FLAT_ALL_OCTAVES.push("b/0");
oct = 1;
while (oct < 8) {
  ALL_NOTES_FLAT.forEach((n) => {
    const note = `${n}/${oct}` as Note;
    NOTES_FLAT_ALL_OCTAVES.push(note);
  });
  oct++;
}
NOTES_FLAT_ALL_OCTAVES.push("c/8");

// #b
export const NOTES_SHARP_FLAT_ALL_OCTAVES: Note[] = [];
oct = 1;
NOTES_SHARP_FLAT_ALL_OCTAVES.push("b/0");
while (oct < 8) {
  ALL_NOTES.forEach((n) => {
    const note = `${n}/${oct}` as Note;
    NOTES_SHARP_FLAT_ALL_OCTAVES.push(note);
  });
  oct++;
}
NOTES_SHARP_FLAT_ALL_OCTAVES.push("c/8");

// x
export const DOUBLE_SHARP_NOTES_ALL_OCTAVES: Note[] = [];
oct = 1;
DOUBLE_SHARP_NOTES_ALL_OCTAVES.push("b/0");
while (oct < 8) {
  ALL_NOTES_SHARP_DOUBLE_SHARP.forEach((n) => {
    const note = `${n}/${oct}` as Note;
    DOUBLE_SHARP_NOTES_ALL_OCTAVES.push(note);
  });
  oct++;
}
DOUBLE_SHARP_NOTES_ALL_OCTAVES.push("c/8");

// bb
export const DOUBLE_FLAT_NOTES_ALL_OCTAVES: Note[] = [];
oct = 1;
DOUBLE_FLAT_NOTES_ALL_OCTAVES.push("b/0");
while (oct < 8) {
  ALL_NOTES_FLAT_DOUBLE_FLAT.forEach((n) => {
    const note = `${n}/${oct}` as Note;
    DOUBLE_FLAT_NOTES_ALL_OCTAVES.push(note);
  });
  oct++;
}
DOUBLE_FLAT_NOTES_ALL_OCTAVES.push("c/8");

// all
export const POSSIBLE_NOTES_ALL_OCTAVES = Array.from(
  new Set([...DOUBLE_SHARP_NOTES_ALL_OCTAVES, ...DOUBLE_FLAT_NOTES_ALL_OCTAVES])
);

// console.log(ALL_NOTES_FLAT_ALL_OCTAVES, ALL_NOTES_FLAT_ALL_OCTAVES.length);

export const noteMathTable: NoteName[][] = [
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

// export const noteMathTable = [
//   ["c", "b#", "dbb"],
//   ["c#", "db"],
//   ["d", "cx", "ebb"],
//   ["d#", "eb"],
//   ["e", "dx", "fb"],
//   ["f", "e#", "gbb"],
//   ["f#", "gb"],
//   ["g", "fx", "abb"],
//   ["g#", "ab"],
//   ["a", "gx", "bbb"],
//   ["a#", "bb"],
//   ["b", "ax", "cb"],
// ];
