/* https://www.alt-codes.net/music_note_alt_codes.php */

import { LevelAccidentType, KeySignature, NoteName, ScaleType } from "./enums";
import { Note } from "./types";

export const WHITE_NOTES = ["c", "d", "e", "f", "g", "a", "b"] as NoteName[];
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

// export const NOTE_INDICES = {
//     "0": ["b/0", "ax/0", "cb/1"],
//     "1": ["c/1", "b#/0", "dbb/1"],
//     "2": ["c#/1", "db/1"],
//     "3": ["d/1", "cx/1", "ebb/1"],
//     "4": ["d#/1", "eb/1"],
//     "5": ["e/1", "dx/1", "fb/1"],
//     "6": ["f/1", "e#/1", "gbb/1"],
//     "7": ["f#/1", "gb/1"],
//     "8": ["g/1", "fx/1", "abb/1"],
//     "9": ["g#/1", "ab/1"],
//     "10": ["a/1", "gx/1", "bbb/1"],
//     "11": ["a#/1", "bb/1"],
//     "12": ["b/1", "ax/1", "cb/2"],
//     "13": ["c/2", "b#/1", "dbb/2"],
//     "14": ["c#/2", "db/2"],
//     "15": ["d/2", "cx/2", "ebb/2"],
//     "16": ["d#/2", "eb/2"],
//     "17": ["e/2", "dx/2", "fb/2"],
//     "18": ["f/2", "e#/2", "gbb/2"],
//     "19": ["f#/2", "gb/2"],
//     "20": ["g/2", "fx/2", "abb/2"],
//     "21": ["g#/2", "ab/2"],
//     "22": ["a/2", "gx/2", "bbb/2"],
//     "23": ["a#/2", "bb/2"],
//     "24": ["b/2", "ax/2", "cb/3"],
//     "25": ["c/3", "b#/2", "dbb/3"],
//     "26": ["c#/3", "db/3"],
//     "27": ["d/3", "cx/3", "ebb/3"],
//     "28": ["d#/3", "eb/3"],
//     "29": ["e/3", "dx/3", "fb/3"],
//     "30": ["f/3", "e#/3", "gbb/3"],
//     "31": ["f#/3", "gb/3"],
//     "32": ["g/3", "fx/3", "abb/3"],
//     "33": ["g#/3", "ab/3"],
//     "34": ["a/3", "gx/3", "bbb/3"],
//     "35": ["a#/3", "bb/3"],
//     "36": ["b/3", "ax/3", "cb/4"],
//     "37": ["c/4", "b#/3", "dbb/4"],
//     "38": ["c#/4", "db/4"],
//     "39": ["d/4", "cx/4", "ebb/4"],
//     "40": ["d#/4", "eb/4"],
//     "41": ["e/4", "dx/4", "fb/4"],
//     "42": ["f/4", "e#/4", "gbb/4"],
//     "43": ["f#/4", "gb/4"],
//     "44": ["g/4", "fx/4", "abb/4"],
//     "45": ["g#/4", "ab/4"],
//     "46": ["a/4", "gx/4", "bbb/4"],
//     "47": ["a#/4", "bb/4"],
//     "48": ["b/4", "ax/4", "cb/5"],
//     "49": ["c/5", "b#/4", "dbb/5"],
//     "50": ["c#/5", "db/5"],
//     "51": ["d/5", "cx/5", "ebb/5"],
//     "52": ["d#/5", "eb/5"],
//     "53": ["e/5", "dx/5", "fb/5"],
//     "54": ["f/5", "e#/5", "gbb/5"],
//     "55": ["f#/5", "gb/5"],
//     "56": ["g/5", "fx/5", "abb/5"],
//     "57": ["g#/5", "ab/5"],
//     "58": ["a/5", "gx/5", "bbb/5"],
//     "59": ["a#/5", "bb/5"],
//     "60": ["b/5", "ax/5", "cb/6"],
//     "61": ["c/6", "b#/5", "dbb/6"],
//     "62": ["c#/6", "db/6"],
//     "63": ["d/6", "cx/6", "ebb/6"],
//     "64": ["d#/6", "eb/6"],
//     "65": ["e/6", "dx/6", "fb/6"],
//     "66": ["f/6", "e#/6", "gbb/6"],
//     "67": ["f#/6", "gb/6"],
//     "68": ["g/6", "fx/6", "abb/6"],
//     "69": ["g#/6", "ab/6"],
//     "70": ["a/6", "gx/6", "bbb/6"],
//     "71": ["a#/6", "bb/6"],
//     "72": ["b/6", "ax/6", "cb/7"],
//     "73": ["c/7", "b#/6", "dbb/7"],
//     "74": ["c#/7", "db/7"],
//     "75": ["d/7", "cx/7", "ebb/7"],
//     "76": ["d#/7", "eb/7"],
//     "77": ["e/7", "dx/7", "fb/7"],
//     "78": ["f/7", "e#/7", "gbb/7"],
//     "79": ["f#/7", "gb/7"],
//     "80": ["g/7", "fx/7", "abb/7"],
//     "81": ["g#/7", "ab/7"],
//     "82": ["a/7", "gx/7", "bbb/7"],
//     "83": ["a#/7", "bb/7"],
//     "84": ["b/7", "ax/7", "cb/8"],
//     "85": ["c/8", "b#/7", "dbb/8"],
// };
// export const PITCH_INDICES: Partial<Record<Note, number>> = {
//     "a#/1": 11,
//     "a#/2": 23,
//     "a#/3": 35,
//     "a#/4": 47,
//     "a#/5": 59,
//     "a#/6": 71,
//     "a#/7": 83,
//     "a/1": 10,
//     "a/2": 22,
//     "a/3": 34,
//     "a/4": 46,
//     "a/5": 58,
//     "a/6": 70,
//     "a/7": 82,
//     "ab/1": 9,
//     "ab/2": 21,
//     "ab/3": 33,
//     "ab/4": 45,
//     "ab/5": 57,
//     "ab/6": 69,
//     "ab/7": 81,
//     "abb/1": 8,
//     "abb/2": 20,
//     "abb/3": 32,
//     "abb/4": 44,
//     "abb/5": 56,
//     "abb/6": 68,
//     "abb/7": 80,
//     "ax/0": 0,
//     "ax/1": 12,
//     "ax/2": 24,
//     "ax/3": 36,
//     "ax/4": 48,
//     "ax/5": 60,
//     "ax/6": 72,
//     "ax/7": 84,
//     "b#/0": 1,
//     "b#/1": 13,
//     "b#/2": 25,
//     "b#/3": 37,
//     "b#/4": 49,
//     "b#/5": 61,
//     "b#/6": 73,
//     "b#/7": 85,
//     "b/0": 0,
//     "b/1": 12,
//     "b/2": 24,
//     "b/3": 36,
//     "b/4": 48,
//     "b/5": 60,
//     "b/6": 72,
//     "b/7": 84,
//     "bb/1": 11,
//     "bb/2": 23,
//     "bb/3": 35,
//     "bb/4": 47,
//     "bb/5": 59,
//     "bb/6": 71,
//     "bb/7": 83,
//     "bbb/1": 10,
//     "bbb/2": 22,
//     "bbb/3": 34,
//     "bbb/4": 46,
//     "bbb/5": 58,
//     "bbb/6": 70,
//     "bbb/7": 82,
//     "c#/1": 2,
//     "c#/2": 14,
//     "c#/3": 26,
//     "c#/4": 38,
//     "c#/5": 50,
//     "c#/6": 62,
//     "c#/7": 74,
//     "c/1": 1,
//     "c/2": 13,
//     "c/3": 25,
//     "c/4": 37,
//     "c/5": 49,
//     "c/6": 61,
//     "c/7": 73,
//     "c/8": 85,
//     "cb/1": 0,
//     "cb/2": 12,
//     "cb/3": 24,
//     "cb/4": 36,
//     "cb/5": 48,
//     "cb/6": 60,
//     "cb/7": 72,
//     "cb/8": 84,
//     "cx/1": 3,
//     "cx/2": 15,
//     "cx/3": 27,
//     "cx/4": 39,
//     "cx/5": 51,
//     "cx/6": 63,
//     "cx/7": 75,
//     "d#/1": 4,
//     "d#/2": 16,
//     "d#/3": 28,
//     "d#/4": 40,
//     "d#/5": 52,
//     "d#/6": 64,
//     "d#/7": 76,
//     "d/1": 3,
//     "d/2": 15,
//     "d/3": 27,
//     "d/4": 39,
//     "d/5": 51,
//     "d/6": 63,
//     "d/7": 75,
//     "db/1": 2,
//     "db/2": 14,
//     "db/3": 26,
//     "db/4": 38,
//     "db/5": 50,
//     "db/6": 62,
//     "db/7": 74,
//     "dbb/1": 1,
//     "dbb/2": 13,
//     "dbb/3": 25,
//     "dbb/4": 37,
//     "dbb/5": 49,
//     "dbb/6": 61,
//     "dbb/7": 73,
//     "dbb/8": 85,
//     "dx/1": 5,
//     "dx/2": 17,
//     "dx/3": 29,
//     "dx/4": 41,
//     "dx/5": 53,
//     "dx/6": 65,
//     "dx/7": 77,
//     "e#/1": 6,
//     "e#/2": 18,
//     "e#/3": 30,
//     "e#/4": 42,
//     "e#/5": 54,
//     "e#/6": 66,
//     "e#/7": 78,
//     "e/1": 5,
//     "e/2": 17,
//     "e/3": 29,
//     "e/4": 41,
//     "e/5": 53,
//     "e/6": 65,
//     "e/7": 77,
//     "eb/1": 4,
//     "eb/2": 16,
//     "eb/3": 28,
//     "eb/4": 40,
//     "eb/5": 52,
//     "eb/6": 64,
//     "eb/7": 76,
//     "ebb/1": 3,
//     "ebb/2": 15,
//     "ebb/3": 27,
//     "ebb/4": 39,
//     "ebb/5": 51,
//     "ebb/6": 63,
//     "ebb/7": 75,
//     "f#/1": 7,
//     "f#/2": 19,
//     "f#/3": 31,
//     "f#/4": 43,
//     "f#/5": 55,
//     "f#/6": 67,
//     "f#/7": 79,
//     "f/1": 6,
//     "f/2": 18,
//     "f/3": 30,
//     "f/4": 42,
//     "f/5": 54,
//     "f/6": 66,
//     "f/7": 78,
//     "fb/1": 5,
//     "fb/2": 17,
//     "fb/3": 29,
//     "fb/4": 41,
//     "fb/5": 53,
//     "fb/6": 65,
//     "fb/7": 77,
//     "fx/1": 8,
//     "fx/2": 20,
//     "fx/3": 32,
//     "fx/4": 44,
//     "fx/5": 56,
//     "fx/6": 68,
//     "fx/7": 80,
//     "g#/1": 9,
//     "g#/2": 21,
//     "g#/3": 33,
//     "g#/4": 45,
//     "g#/5": 57,
//     "g#/6": 69,
//     "g#/7": 81,
//     "g/1": 8,
//     "g/2": 20,
//     "g/3": 32,
//     "g/4": 44,
//     "g/5": 56,
//     "g/6": 68,
//     "g/7": 80,
//     "gb/1": 7,
//     "gb/2": 19,
//     "gb/3": 31,
//     "gb/4": 43,
//     "gb/5": 55,
//     "gb/6": 67,
//     "gb/7": 79,
//     "gbb/1": 6,
//     "gbb/2": 18,
//     "gbb/3": 30,
//     "gbb/4": 42,
//     "gbb/5": 54,
//     "gbb/6": 66,
//     "gbb/7": 78,
//     "gx/1": 10,
//     "gx/2": 22,
//     "gx/3": 34,
//     "gx/4": 46,
//     "gx/5": 58,
//     "gx/6": 70,
//     "gx/7": 82,
// };
