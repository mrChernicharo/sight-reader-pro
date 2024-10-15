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

export const WHITE_NOTES = ["c", "d", "e", "f", "g", "a", "b"];
export const ALL_NOTES_SHARP = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
export const ALL_NOTES_FLAT = ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b"];
// prettier-ignore
export const ALL_NOTES = ["c", "c#", "db", "d", "d#", "eb", "e", "f", "f#", "gb", "g", "g#", "ab", "a", "a#", "bb", "b"];

export const WHITE_NOTES_ALL_OCTAVES: Note[] = [];
let oct = 1;
while (oct < 9) {
  WHITE_NOTES.forEach((n) => {
    WHITE_NOTES_ALL_OCTAVES.push(`${n}/${oct}`);
  });
  oct++;
}

export const ALL_NOTES_SHARP_ALL_OCTAVES: Note[] = [];
oct = 1;
while (oct < 9) {
  ALL_NOTES_SHARP.forEach((n) => {
    ALL_NOTES_SHARP_ALL_OCTAVES.push(`${n}/${oct}`);
  });
  oct++;
}

export const ALL_NOTES_FLAT_ALL_OCTAVES: Note[] = [];
oct = 1;
while (oct < 9) {
  ALL_NOTES_FLAT.forEach((n) => {
    ALL_NOTES_FLAT_ALL_OCTAVES.push(`${n}/${oct}`);
  });
  oct++;
}

// console.log(ALL_NOTES_FLAT_ALL_OCTAVES, ALL_NOTES_FLAT_ALL_OCTAVES.length);
