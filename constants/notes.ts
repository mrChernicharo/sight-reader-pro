/* https://www.alt-codes.net/music_note_alt_codes.php */

import { keySignature } from "./enums";
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
    DOUBLE_FLAT_NOTES_ALL_OCTAVES.push(`${n}/${oct}`);
  });
  oct++;
}

// all
export const POSSIBLE_NOTES_ALL_OCTAVES = Array.from(
  new Set([...DOUBLE_SHARP_NOTES_ALL_OCTAVES, ...DOUBLE_FLAT_NOTES_ALL_OCTAVES])
);

// console.log(ALL_NOTES_FLAT_ALL_OCTAVES, ALL_NOTES_FLAT_ALL_OCTAVES.length);

export const diatonicKeyNotes: Record<keySignature, string[]> = {
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

export const chromaticNotes: Record<keySignature, string[]> = {
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
