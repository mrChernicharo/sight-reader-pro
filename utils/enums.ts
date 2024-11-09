import { glyphs } from "./constants";

export enum NoteNameBase {
  "c" = "c",
  "d" = "d",
  "e" = "e",
  "f" = "f",
  "g" = "g",
  "a" = "a",
  "b" = "b",
}

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

export enum Accident {
  "#" = "#",
  "b" = "b",
  "x" = "x",
  "bb" = "bb",
  "[]" = "[]", // Bequadro
}

export enum LevelAccidentType {
  "None" = "none",
  "#" = "#",
  "b" = "b",
  // "#b" = "#b",
  // "x" = "x",
  // "bb" = "bb",
  // "All" = "all",
}

export enum Clef {
  Treble = "treble",
  Bass = "bass",
  // both, // treble + bass
}

export enum SoundEffect {
  WrongAnswer = "wrong-answer",
}

export enum GameType {
  Single = "single",
  Chord = "chord",
  Melody = "melody",
  Rhythm = "rhythm",
}

export enum WinRank {
  Gold = "gold",
  Silver = "silver",
  Bronze = "bronze",
}

export enum ScaleType {
  Diatonic = "diatonic",
  Chromatic = "chromatic",
}

export enum GameState {
  Idle = "idle",
  Success = "success",
  Mistake = "mistake",
}

export enum KeySignature {
  Cb = "Cb",
  Gb = "Gb",
  Db = "Db",
  Ab = "Ab",
  Eb = "Eb",
  Bb = "Bb",
  F = "F",
  C = "C",
  G = "G",
  D = "D",
  A = "A",
  E = "E",
  B = "B",
  "F#" = "F#",
  "C#" = "C#",
  Abm = "Abm",
  Ebm = "Ebm",
  Bbm = "Bbm",
  Fm = "Fm",
  Cm = "Cm",
  Gm = "Gm",
  Dm = "Dm",
  Am = "Am",
  Em = "Em",
  Bm = "Bm",
  "F#m" = "F#m",
  "C#m" = "C#m",
  "G#m" = "G#m",
  "D#m" = "D#m",
  "A#m" = "A#m",
}

export enum TimeSignature {
  "2/4" = "2/4",
  "3/4" = "3/4",
  "4/4" = "4/4",
}

export enum NoteDuration {
  "w" = "w",
  "h." = "h.",
  "h" = "h",
  "q." = "q.",
  "q" = "q",
  "8th." = "8.",
  "8th" = "8",
  "16th" = "16",
}

export enum Difficulty {
  Newbie = "newbie",
  Easy = "easy",
  Normal = "normal",
  Hard = "hard",
  Expert = "expert",
}
