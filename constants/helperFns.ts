import { Accident, Clef, GameType, KeySignature, NoteName, WinRank } from "./enums";
import { GameScore, Level, Note } from "./types";

const ID_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
export const intl = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });

export const winScore = 5;

import { FLAT_KEY_SIGNATURES, noteMathTable } from "./notes";
import { AppNote } from "./types";

function isNatural(note: AppNote): boolean {
  const noteName = note.split("/")[0] as NoteName;
  return noteName.length === 1;
}
function isSharp(note: AppNote): boolean {
  const noteName = note.split("/")[0] as NoteName;
  return noteName.length === 2 && noteName[1] === "#";
}
function isSimpleSharp(note: AppNote): boolean {
  const noteName = note.split("/")[0] as NoteName;
  return isSharp(note) && !["b#", "e#"].includes(noteName);
}
function isDoubleSharp(note: AppNote) {
  const noteName = note.split("/")[0] as NoteName;
  return noteName.length === 2 && noteName[1] === "x";
}
function isFlat(note: AppNote): boolean {
  const noteName = note.split("/")[0] as NoteName;
  return noteName.length === 2 && noteName[1] === "b";
}
function isSimpleFlat(note: AppNote): boolean {
  const noteName = note.split("/")[0] as NoteName;
  return isFlat(note) && !["cb", "fb"].includes(noteName);
}
function isDoubleFlat(note: AppNote) {
  const noteName = note.split("/")[0] as NoteName;
  return noteName.length === 3 && noteName[2] === "b";
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

// @TODO: update getNoteFromIdx -> getNoteFromIdx(noteIdx, keySignature, scaleType)
export function getNoteFromIdx(noteIdx: number, keySignature: KeySignature, forceAltered = false) {
  const isFlatKeySig = isFlatKeySignature(keySignature);

  const allOpts = NOTE_INDICES.get(noteIdx)!;

  const filteredOpts = allOpts.filter((n) => {
    if (isFlatKeySig) {
      return isNatural(n) || isFlat(n) || isDoubleFlat(n);
    } else {
      return isNatural(n) || isSharp(n) || isDoubleSharp(n);
    }
  });

  const resultNote = filteredOpts[0];
  // console.log("getNoteFromIdx 2:::", { allOpts, filteredOpts, resultNote });
  if (!resultNote) {
    console.error(`getNoteFromIdx [ERROR]:: Could not find note for index ${noteIdx}`);
  }
  return resultNote;
}

export function addHalfSteps(note: AppNote, incr: number, keySignature: KeySignature) {
  let noteIdx = getNoteIdx(note);

  let steps = Math.abs(incr);
  while (steps > 0) {
    noteIdx += incr;
    steps--;
  }

  const resultNote = getNoteFromIdx(noteIdx, keySignature);
  return resultNote ?? note;
}

export function buildPitchIndexDicts() {
  const PITCH_INDICES = new Map<AppNote, number>();
  let oct = 1;
  let idx = 1;

  // set "b/0", "ax/0", "cb/1"
  noteMathTable[11].forEach((noteName) => {
    let oct = noteName === NoteName.cb ? 1 : 0;
    PITCH_INDICES.set(`${noteName}/${oct}` as AppNote, 0);
  });

  while (oct < 8) {
    noteMathTable.forEach((noteNames) => {
      noteNames.forEach((noteName) => {
        let octave = oct;
        if (noteName === NoteName["b#"]) octave--;
        else if (noteName === NoteName["cb"]) octave++;
        PITCH_INDICES.set(`${noteName}/${octave}` as AppNote, idx);
      });
      idx++;
    });
    oct++;
  }

  // set "c/8", "b#/7", "dbb/8",
  noteMathTable[0].forEach((noteName) => {
    let oct = noteName === NoteName["b#"] ? 7 : 8;
    PITCH_INDICES.set(`${noteName}/${oct}` as AppNote, PITCH_INDICES.size);
  });

  const NOTE_INDICES = new Map<number, AppNote[]>();

  Array.from(PITCH_INDICES.entries()).forEach(([note, idx]) => {
    NOTE_INDICES.has(idx) ? NOTE_INDICES.get(idx)?.push(note) : NOTE_INDICES.set(idx, [note]);
  });
  console.log("buildPitchIndicesDict:::", { PITCH_INDICES, NOTE_INDICES });
  return { PITCH_INDICES, NOTE_INDICES };
}

export const { PITCH_INDICES, NOTE_INDICES } = buildPitchIndexDicts();

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

    case "c":
    case "dbb":
    case "b#":
      return ["c", "dbb", "b#"].includes(noteB);

    case "d":
    case "ebb":
    case "cx":
      return ["d", "ebb", "cx"].includes(noteB);

    case "e":
    case "fb":
    case "dx":
      return ["e", "fb", "dx"].includes(noteB);

    case "f":
    case "gbb":
    case "e#":
      return ["f", "gbb", "e#"].includes(noteB);

    case "g":
    case "abb":
    case "fx":
      return ["g", "abb", "fx"].includes(noteB);

    case "a":
    case "bbb":
    case "gx":
      return ["a", "bbb", "gx"].includes(noteB);

    case "b":
    case "cb":
    case "ax":
      return ["b", "cb", "ax"].includes(noteB);
  }

  return false;
}

/** is noteA higher than noteB ? */
export function isNoteHigher(noteA: Note, noteB: Note) {
  const [a, octA] = noteA.split("/");
  const [b, octB] = noteB.split("/");
  if (octA === octB) return a > b;
  else return octA > octB;
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

export function pickKeySignature(level: Level) {
  switch (level.gameType) {
    case GameType.Single:
    case GameType.Chord:
    case GameType.Melody: {
      if (level.hasKey) {
        const randomIndex = Math.floor(Math.random() * level.keySignatures.length);
        return level.keySignatures[randomIndex];
      } else {
        return [Accident.b].includes(level.accident) ? KeySignature.F : KeySignature.C;
      }
    }

    case GameType.Rhythm:
      return KeySignature.C;
  }
}
