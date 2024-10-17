/* https://www.alt-codes.net/music_note_alt_codes.php */

import { Note } from "./types";

// export const glyphs = ["♯", "♭", "♮", "𝄪", "𝄫", "𝄀", "𝄁", "𝄆", "𝄇", "𝄞", "𝄢", "𝄡", "𝄐"];
export const glyphs = {
  sharp: "\u{266F}",
  flat: "\u{266D}",
  natural: "\u{266E}",
  quarter: "\u{2663}",
  two8Notes: "\u{266B}",
  two16Notes: "\u{266C}",
};

// prettier-ignore
export const ALL_NOTES = ["c", "c#", "db", "d", "d#", "eb", "e", "f", "f#", "gb", "g", "g#", "ab", "a", "a#", "bb", "b"];

export const WHITE_NOTES = ["c", "d", "e", "f", "g", "a", "b"];
export const ALL_NOTES_SHARP = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
export const ALL_NOTES_FLAT = ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b"];

// prettier-ignore
export const ALL_NOTES_SHARP_DOUBLE_SHARP = ["c", "c#","cx","d", "d#", "dx", "e", "e#", "f", "f#", "fx", "g", "g#", "gx", "a", "a#", "b", "b#"]
// ["cx", "dx", "e#", "fx", "gx", "ax", "b#"];
// prettier-ignore
export const ALL_NOTES_FLAT_DOUBLE_FLAT = ["cb", "c", "dbb", "db", "d",  "ebb", "eb", "e", "fb", "f", "gbb", "gb", "g", "abb", "ab", "a", "bbb", "bb", "b"];
// ["cb", "dbb", "ebb", "fb", "gbb", "abb", "bbb"];

export const WHITE_NOTES_ALL_OCTAVES: Note[] = [];
let oct = 1;
while (oct < 9) {
  WHITE_NOTES.forEach((n) => {
    WHITE_NOTES_ALL_OCTAVES.push(`${n}/${oct}`);
  });
  oct++;
}

// #
export const NOTES_SHARP_ALL_OCTAVES: Note[] = [];
oct = 1;
while (oct < 9) {
  ALL_NOTES_SHARP.forEach((n) => {
    NOTES_SHARP_ALL_OCTAVES.push(`${n}/${oct}`);
  });
  oct++;
}

// b
export const NOTES_FLAT_ALL_OCTAVES: Note[] = [];
oct = 1;
while (oct < 9) {
  ALL_NOTES_FLAT.forEach((n) => {
    NOTES_FLAT_ALL_OCTAVES.push(`${n}/${oct}`);
  });
  oct++;
}

// #b
export const NOTES_SHARP_FLAT_ALL_OCTAVES: Note[] = [];
oct = 1;
while (oct < 9) {
  ALL_NOTES.forEach((n) => {
    NOTES_SHARP_FLAT_ALL_OCTAVES.push(`${n}/${oct}`);
  });
  oct++;
}

// x
export const DOUBLE_SHARP_NOTES_ALL_OCTAVES: Note[] = [];
oct = 1;
while (oct < 9) {
  ALL_NOTES_SHARP_DOUBLE_SHARP.forEach((n) => {
    DOUBLE_SHARP_NOTES_ALL_OCTAVES.push(`${n}/${oct}`);
  });
  oct++;
}

// bb
export const DOUBLE_FLAT_NOTES_ALL_OCTAVES: Note[] = [];
oct = 1;
while (oct < 9) {
  ALL_NOTES_FLAT_DOUBLE_FLAT.forEach((n) => {
    DOUBLE_FLAT_NOTES_ALL_OCTAVES;
  });
  oct++;
}

// all
export const POSSIBLE_NOTES_ALL_OCTAVES = Array.from(
  new Set([...DOUBLE_SHARP_NOTES_ALL_OCTAVES, ...DOUBLE_FLAT_NOTES_ALL_OCTAVES])
);

// console.log(ALL_NOTES_FLAT_ALL_OCTAVES, ALL_NOTES_FLAT_ALL_OCTAVES.length);
