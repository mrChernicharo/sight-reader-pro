import { Clef, Accident, WinRank } from "./enums";
import { NOTES_FLAT_ALL_OCTAVES, NOTES_SHARP_ALL_OCTAVES, WHITE_NOTES_ALL_OCTAVES } from "./notes";
import { Game, GameScore, Level, Note, NoteRange } from "./types";

const ID_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
export const intl = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });

export const winScore = 5;

export const randomUID = (length = 12) =>
  Array(length)
    .fill(0)
    .map((item) => ID_CHARS.split("")[Math.round(Math.random() * ID_CHARS.length)])
    .join("");

export function padZero(n: number) {
  return n > 9 ? String(n) : `0${n}`;
}

export function getRandInRange(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isNoteMatch(noteA: string, noteB: string) {
  if (noteA === noteB) return true;

  switch (noteA) {
    case "c#":
      return noteB === "db";
    case "db":
      return noteB === "c#";

    case "d#":
      return noteB === "eb";
    case "eb":
      return noteB === "d#";

    case "f#":
      return noteB === "gb";
    case "gb":
      return noteB === "f#";

    case "g#":
      return noteB === "ab";
    case "ab":
      return noteB === "g#";

    case "a#":
      return noteB === "bb";
    case "bb":
      return noteB === "a#";
  }

  return false;
}

export function stemDown(note: Note, clef: Clef) {
  const [key, octave] = note.split("/");
  // console.log({ note, key, octave, clef });
  switch (clef) {
    case Clef.Treble:
      return +octave > 4 ? true : false;
    case Clef.Bass:
      return +octave > 2 || (+octave === 2 && key >= "d") ? true : false;
  }
}

export function getRandomNoteInRange(range: NoteRange, accident: Accident, previousNote: string): Note {
  let notesArr: Note[] = [];
  switch (accident) {
    case Accident["#"]:
      notesArr = NOTES_SHARP_ALL_OCTAVES;
      break;
    case Accident.b:
      notesArr = NOTES_FLAT_ALL_OCTAVES;
      break;
    case Accident.None:
    default:
      notesArr = WHITE_NOTES_ALL_OCTAVES;
      break;
  }

  const [lowNote, highNote] = range.split(":::");
  const [lowIdx, highIdx] = [notesArr.findIndex((n) => n === lowNote), notesArr.findIndex((n) => n === highNote)];
  const chosenIdx = getRandInRange(lowIdx, highIdx);
  const chosenNote = notesArr[chosenIdx];
  // console.log(":::getRandomNoteInRange", { range, lowIdx, highIdx, chosenIdx, chosenNote, previousNote });
  if (chosenNote === previousNote) {
    // console.log(":::getRandomNoteInRange ::: shit_same_note!", { chosenNote, previousNote });
    return getRandomNoteInRange(range, accident, chosenNote);
  } // recurse if same note as before
  return chosenNote;
}

export function getGameStats(level: Level, gameScore: GameScore) {
  const attempts = Object.values(gameScore).reduce((acc, nxt) => acc + nxt);
  const accuracy = gameScore.successes / attempts;
  const accuracyStr = isNaN(accuracy) ? "--" : intl.format(accuracy * 100) + "%";
  const hitsPerMinute = gameScore.successes * (60 / level.durationInSeconds);
  const hasWon = hitsPerMinute >= level.winConditions[WinRank.Bronze];

  // console.log("getGameStats", { hitsPerMinute, level, hasWon });

  // level.durationInSeconds
  // const hitsPerSecond = gameScore.successes
  return { attempts, accuracy: accuracyStr, hasWon };
}

const sharpToFlatTable = { a: "b", b: "c", c: "d", d: "e", e: "f", f: "g", g: "a" };
export function flattenEventualSharpNote(noteString: string) {
  if (noteString.length > 1 && noteString[1] === "#") {
    noteString = sharpToFlatTable[noteString[0] as keyof typeof sharpToFlatTable] + "b";
  }
  return noteString;
}

export function capitalizeStr(text: string) {
  const [first, ...rest] = text;
  return [first.toUpperCase(), ...rest].join("");
}
export function getAudioFilepath(note: Note) {
  const filepathBase = "@/assets/sounds/piano-notes";
  const [key, octave] = note.split("/");
  console.log({ key, octave, note });
  const filename = `Piano.mf.${capitalizeStr(key)}${octave}_cut.mp3`;
  const filepath = `${filepathBase}/${filename}`;
  return filepath;
}
