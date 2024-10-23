/* https://www.alt-codes.net/music_note_alt_codes.php */

import { Accident, KeySignature, ScaleType } from "./enums";
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
    WHITE_NOTES_ALL_OCTAVES.push(`${n}/${oct}`);
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
    NOTES_SHARP_ALL_OCTAVES.push(`${n}/${oct}`);
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
    NOTES_FLAT_ALL_OCTAVES.push(`${n}/${oct}`);
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
    NOTES_SHARP_FLAT_ALL_OCTAVES.push(`${n}/${oct}`);
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
    DOUBLE_SHARP_NOTES_ALL_OCTAVES.push(`${n}/${oct}`);
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
    DOUBLE_FLAT_NOTES_ALL_OCTAVES.push(`${n}/${oct}`);
  });
  oct++;
}
DOUBLE_FLAT_NOTES_ALL_OCTAVES.push("c/8");

// all
export const POSSIBLE_NOTES_ALL_OCTAVES = Array.from(
  new Set([...DOUBLE_SHARP_NOTES_ALL_OCTAVES, ...DOUBLE_FLAT_NOTES_ALL_OCTAVES])
);

// console.log(ALL_NOTES_FLAT_ALL_OCTAVES, ALL_NOTES_FLAT_ALL_OCTAVES.length);

export const diatonicKeyNotes: Record<KeySignature, string[]> = {
  [KeySignature.C]: ["c", "d", "e", "f", "g", "a", "b"],
  [KeySignature.G]: ["g", "a", "b", "c", "d", "e", "f#"],
  [KeySignature.D]: ["d", "e", "f#", "g", "a", "b", "c#"],
  [KeySignature.A]: ["a", "b", "c#", "d", "e", "f#", "g#"],
  [KeySignature.E]: ["e", "f#", "g#", "a", "b", "c#", "d#"],
  [KeySignature.B]: ["b", "c#", "d#", "e", "f#", "g#", "a#"],
  [KeySignature["F#"]]: ["f#", "g#", "a#", "b", "c#", "d#", "e#"],
  [KeySignature["C#"]]: ["c#", "d#", "e#", "f#", "g#", "a#", "b#"],
  [KeySignature.Am]: ["a", "b", "c", "d", "e", "f", "g"],
  [KeySignature.Em]: ["e", "f#", "g", "a", "b", "c", "d"],
  [KeySignature.Bm]: ["b", "c#", "d", "e", "f#", "g", "a"],
  [KeySignature["F#m"]]: ["f#", "g#", "a", "b", "c#", "d", "e"],
  [KeySignature["C#m"]]: ["c#", "d#", "e", "f#", "g#", "a", "b"],
  [KeySignature["G#m"]]: ["g#", "a#", "b", "c#", "d#", "e", "f#"],
  [KeySignature["D#m"]]: ["d#", "e#", "f#", "g#", "a#", "b", "c#"],
  [KeySignature["A#m"]]: ["a#", "b#", "c#", "d#", "e#", "f#", "g#"],
  [KeySignature.F]: ["f", "g", "a", "bb", "c", "d", "e"],
  [KeySignature.Bb]: ["bb", "c", "d", "eb", "f", "g", "a"],
  [KeySignature.Eb]: ["eb", "f", "g", "ab", "bb", "c", "d"],
  [KeySignature.Ab]: ["ab", "bb", "c", "db", "eb", "f", "g"],
  [KeySignature.Db]: ["db", "eb", "f", "gb", "ab", "bb", "c"],
  [KeySignature.Gb]: ["gb", "ab", "bb", "cb", "db", "eb", "f"],
  [KeySignature.Cb]: ["cb", "db", "eb", "fb", "gb", "ab", "bb"],
  [KeySignature.Dm]: ["d", "e", "f", "g", "a", "bb", "c"],
  [KeySignature.Gm]: ["g", "a", "bb", "c", "d", "eb", "f"],
  [KeySignature.Cm]: ["c", "d", "eb", "f", "g", "ab", "bb"],
  [KeySignature.Fm]: ["f", "g", "ab", "bb", "c", "db", "eb"],
  [KeySignature.Bbm]: ["bb", "c", "db", "eb", "f", "gb", "ab"],
  [KeySignature.Ebm]: ["eb", "f", "gb", "ab", "bb", "cb", "db"],
  [KeySignature.Abm]: ["ab", "bb", "cb", "db", "eb", "fb", "gb"],
};

export const chromaticNotes: Record<KeySignature, string[]> = {
  [KeySignature.C]: ["c", "db", "d", "d#", "e", "f", "f#", "g", "ab", "a", "bb", "b"],
  [KeySignature.G]: ["g", "ab", "a", "bb", "b", "c", "c#", "d", "eb", "e", "f", "f#"],
  [KeySignature.D]: ["d", "eb", "e", "f", "f#", "g", "g#", "a", "bb", "b", "c", "c#"],
  [KeySignature.A]: ["a", "bb", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"],
  [KeySignature.E]: ["e", "f", "f#", "g", "g#", "a", "a#", "b", "c", "c#", "d", "d#"],
  [KeySignature.B]: ["b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#"],
  [KeySignature["F#"]]: ["f#", "g", "g#", "a", "a#", "b", "c", "c#", "d", "d#", "e", "f"],
  [KeySignature["C#"]]: ["c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", "c"],
  [KeySignature.Am]: ["a", "bb", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"],
  [KeySignature.Em]: ["e", "f", "f#", "g", "g#", "a", "a#", "b", "c", "c#", "d", "d#"],
  [KeySignature.Bm]: ["b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#"],
  [KeySignature["F#m"]]: ["f#", "g", "g#", "a", "a#", "b", "c", "c#", "d", "d#", "e", "f"],
  [KeySignature["C#m"]]: ["c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", "c"],
  [KeySignature["G#m"]]: ["g#", "a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g"],
  [KeySignature["D#m"]]: ["d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", "c", "c#", "d"],
  [KeySignature["A#m"]]: ["a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a"],
  [KeySignature.F]: ["f", "gb", "g", "g#", "a", "bb", "b", "c", "db", "d", "eb", "e"],
  [KeySignature.Bb]: ["bb", "b", "c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a"],
  [KeySignature.Eb]: ["eb", "e", "f", "gb", "g", "ab", "a", "bb", "cb", "c", "db", "d"],
  [KeySignature.Ab]: ["ab", "a", "bb", "b", "c", "db", "d", "eb", "e", "f", "gb", "g"],
  [KeySignature.Db]: ["db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b", "c"],
  [KeySignature.Gb]: ["gb", "g", "ab", "a", "bb", "cb", "c", "db", "d", "eb", "e", "f"],
  [KeySignature.Cb]: ["cb", "c", "db", "d", "eb", "fb", "f", "gb", "g", "ab", "a", "bb"],
  [KeySignature.Dm]: ["d", "eb", "e", "f", "f#", "g", "g#", "a", "bb", "b", "c", "c#"],
  [KeySignature.Gm]: ["g", "ab", "a", "bb", "b", "c", "c#", "d", "eb", "e", "f", "f#"],
  [KeySignature.Cm]: ["c", "db", "d", "d#", "e", "f", "f#", "g", "ab", "a", "bb", "b"],
  [KeySignature.Fm]: ["f", "gb", "g", "g#", "a", "bb", "b", "c", "db", "d", "eb", "e"],
  [KeySignature.Bbm]: ["bb", "b", "c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a"],
  [KeySignature.Ebm]: ["eb", "e", "f", "gb", "g", "ab", "a", "bb", "cb", "c", "db", "d"],
  [KeySignature.Abm]: ["ab", "a", "bb", "b", "c", "db", "d", "eb", "e", "f", "gb", "g"],
};

export const FLAT_KEY_SIGNATURES = [
  KeySignature.F,
  KeySignature.Bb,
  KeySignature.Eb,
  KeySignature.Ab,
  KeySignature.Db,
  KeySignature.Gb,
  KeySignature.Cb,
  KeySignature.Dm,
  KeySignature.Gm,
  KeySignature.Cm,
  KeySignature.Fm,
  KeySignature.Bbm,
  KeySignature.Ebm,
  KeySignature.Abm,
];

export const SHARP_KEY_SIGNATURES = [
  KeySignature.C,
  KeySignature.G,
  KeySignature.D,
  KeySignature.A,
  KeySignature.E,
  KeySignature.B,
  KeySignature["F#"],
  KeySignature["C#"],
  KeySignature.Am,
  KeySignature.Em,
  KeySignature.Bm,
  KeySignature["F#m"],
  KeySignature["C#m"],
  KeySignature["G#m"],
  KeySignature["D#m"],
  KeySignature["A#m"],
];

export const MAJOR_KEY_SIGNATURES = [
  KeySignature.C,
  KeySignature.G,
  KeySignature.D,
  KeySignature.A,
  KeySignature.E,
  KeySignature.B,
  KeySignature["F#"],
  KeySignature["C#"],
  KeySignature.F,
  KeySignature.Bb,
  KeySignature.Eb,
  KeySignature.Ab,
  KeySignature.Db,
  KeySignature.Gb,
  KeySignature.Cb,
];
export const MINOR_KEY_SIGNATURES = [
  KeySignature.Am,
  KeySignature.Em,
  KeySignature.Bm,
  KeySignature["F#m"],
  KeySignature["C#m"],
  KeySignature["G#m"],
  KeySignature["D#m"],
  KeySignature["A#m"],
  KeySignature.Dm,
  KeySignature.Gm,
  KeySignature.Cm,
  KeySignature.Fm,
  KeySignature.Bbm,
  KeySignature.Ebm,
  KeySignature.Abm,
];

export const MAJOR_KEY_SIGNATURES_SHARP = [
  KeySignature.C,
  KeySignature.G,
  KeySignature.D,
  KeySignature.A,
  KeySignature.E,
  KeySignature.B,
  KeySignature["F#"],
  KeySignature["C#"],
];
export const MAJOR_KEY_SIGNATURES_FLAT = [
  KeySignature.F,
  KeySignature.Bb,
  KeySignature.Eb,
  KeySignature.Ab,
  KeySignature.Db,
  KeySignature.Gb,
  KeySignature.Cb,
];

export const MINOR_KEY_SIGNATURES_SHARP = [
  KeySignature.Am,
  KeySignature.Em,
  KeySignature.Bm,
  KeySignature["F#m"],
  KeySignature["C#m"],
  KeySignature["G#m"],
  KeySignature["D#m"],
  KeySignature["A#m"],
];
export const MINOR_KEY_SIGNATURES_FLAT = [
  KeySignature.Dm,
  KeySignature.Gm,
  KeySignature.Cm,
  KeySignature.Fm,
  KeySignature.Bbm,
  KeySignature.Ebm,
  KeySignature.Abm,
];

export const noteMathTable = [
  ["c", "b#", "dbb"],
  ["c#", "db"],
  ["d", "cx", "ebb"],
  ["d#", "eb"],
  ["e", "dx", "fb"],
  ["f", "e#", "gbb"],
  ["f#", "gb"],
  ["g", "fx", "abb"],
  ["g#", "ab"],
  ["a", "gx", "bbb"],
  ["a#", "bb"],
  ["b", "ax", "cb"],
];

export const accidentNoteSequences = {
  [Accident.None]: WHITE_NOTES_ALL_OCTAVES,
  [Accident["#"]]: NOTES_SHARP_ALL_OCTAVES,
  [Accident.b]: NOTES_FLAT_ALL_OCTAVES,
  // [Accident["#b"]]: NOTES_SHARP_FLAT_ALL_OCTAVES,
  // [Accident.x]: DOUBLE_SHARP_NOTES_ALL_OCTAVES,
  // [Accident.bb]: DOUBLE_FLAT_NOTES_ALL_OCTAVES,
  // [Accident.All]: POSSIBLE_NOTES_ALL_OCTAVES,
};
export const scaleTypeNoteSequences = {
  [ScaleType.Chromatic]: chromaticNotes,
  [ScaleType.Diatonic]: diatonicKeyNotes,
};
