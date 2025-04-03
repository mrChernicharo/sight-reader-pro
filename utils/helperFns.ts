import { LevelAccidentType, Clef, GameType, KeySignature, NoteName, WinRank, Accident } from "./enums";
import { GameScore, Level, LevelScore, MelodyRound, Note, Round, SingleNoteRound, WinConditions } from "./types";

const ID_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";

import { noteMathTable } from "./notes";
import { FLAT_KEY_SIGNATURES } from "./keySignature";
import { GAME_WIN_MIN_ACCURACY } from "./constants";
import { RelativePathString } from "expo-router";

export function getPreviousPage(prevPage: string, id: string) {
  return prevPage === "/practice" ? "/practice" : (`${prevPage}/${id}` as RelativePathString);
}

export async function wait(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isNatural(note: Note): boolean {
  const noteName = note.split("/")[0] as NoteName;
  return noteName.length === 1;
}
function isSharp(note: Note): boolean {
  const noteName = note.split("/")[0] as NoteName;
  return noteName.length === 2 && noteName[1] === "#";
}
function isSimpleSharp(note: Note): boolean {
  const noteName = note.split("/")[0] as NoteName;
  return isSharp(note) && !["b#", "e#"].includes(noteName);
}
function isDoubleSharp(note: Note) {
  const noteName = note.split("/")[0] as NoteName;
  return noteName.length === 2 && noteName[1] === "x";
}
function isFlat(note: Note): boolean {
  const noteName = note.split("/")[0] as NoteName;
  return noteName.length === 2 && noteName[1] === "b";
}
function isSimpleFlat(note: Note): boolean {
  const noteName = note.split("/")[0] as NoteName;
  return isFlat(note) && !["cb", "fb"].includes(noteName);
}
function isDoubleFlat(note: Note) {
  const noteName = note.split("/")[0] as NoteName;
  return noteName.length === 3 && noteName[2] === "b";
}

export function getNoteIdx(note: Note) {
  const idx = PITCH_INDICES.get(note) ?? -1;
  // if (idx < 0) {
  //   console.error("<<< getNoteIdx [ERROR]", { note, idx, PITCH_INDICES });
  // }
  return idx;
}

export function explodeNote(note: Note = "b/0") {
  let baseName = "";
  let accident = "";
  const [noteName, octave] = note?.split("/");

  switch (noteName.length) {
    case 0:
    default:
      throw Error(`[explodeNote::ERROR] invalid note "${note}"`);
    case 1:
      baseName = noteName;
    case 2:
    case 3: {
      const noteChars = noteName.split("");
      baseName = noteChars.shift()!;
      accident = noteChars.join("") as Accident;
    }
  }

  return {
    index: getNoteIdx(note),
    baseName,
    accident,
    octave,
    noteName: `${baseName}${accident}` as NoteName,
    fullName: `${baseName}${accident}/${octave}`,
  };
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

export function addHalfSteps(note: Note, incr: number, keySignature: KeySignature) {
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
  const PITCH_INDICES = new Map<Note, number>();
  let oct = 1;
  let idx = 1;

  // set "b/0", "ax/0", "cb/1"
  noteMathTable[11].forEach((noteName) => {
    let oct = noteName === NoteName.cb ? 1 : 0;
    PITCH_INDICES.set(`${noteName}/${oct}` as Note, 0);
  });

  while (oct < 8) {
    noteMathTable.forEach((noteNames) => {
      noteNames.forEach((noteName) => {
        let octave = oct;
        if (noteName === NoteName["b#"]) octave--;
        else if (noteName === NoteName["cb"]) octave++;
        PITCH_INDICES.set(`${noteName}/${octave}` as Note, idx);
      });
      idx++;
    });
    oct++;
  }

  // set "c/8", "b#/7", "dbb/8",
  noteMathTable[0].forEach((noteName) => {
    let oct = noteName === NoteName["b#"] ? 7 : 8;
    PITCH_INDICES.set(`${noteName}/${oct}` as Note, idx);
  });

  const NOTE_INDICES = new Map<number, Note[]>();

  Array.from(PITCH_INDICES.entries()).forEach(([note, idx]) => {
    NOTE_INDICES.has(idx) ? NOTE_INDICES.get(idx)?.push(note) : NOTE_INDICES.set(idx, [note]);
  });

  // console.log({ oct, idx });
  // console.log({ noteMathTable });
  // console.log({ NOTE_INDICES });
  // console.log({ NOTE_INDICES });
  // console.log("buildPitchIndicesDict:::", { PITCH_INDICES, NOTE_INDICES });
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

export function isNoteMatch(noteA: NoteName, noteB: NoteName) {
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

export function getGameStats<T>(level: Level<T>, rounds: Round<T>[], intl: Intl.NumberFormat) {
  const DEFAULT_STATS = {
    attempts: 0,
    successes: 0,
    mistakes: 0,
    hasWon: false,
    accuracy: "--",
    hitsPerMinute: 0,
    score: { value: 0 },
  };

  // if (true) return DEFAULT_STATS;
  if (!level || !rounds) return DEFAULT_STATS;
  // console.log("getGameStats:::", { level, rounds, gameType: level.gameType });

  switch (level.gameType) {
    case GameType.Single:
      return (rounds as SingleNoteRound[]).reduce(
        (acc, ro) => {
          if (ro.attempt) {
            acc.attempts++;
            const { noteName: attemptName } = explodeNote(ro.attempt);
            const { noteName: valName } = explodeNote(ro.value);
            isNoteMatch(attemptName, valName) ? acc.successes++ : acc.mistakes++;
          }

          const accuracy = acc.successes / acc.attempts;

          acc.accuracy = isNaN(accuracy) ? "--" : intl.format(accuracy * 100) + "%";
          acc.hitsPerMinute = acc.successes * (60 / level.durationInSeconds);
          acc.score = calcLevelScore(acc.successes, accuracy, acc.hitsPerMinute, level.winConditions);
          acc.hasWon = acc.hitsPerMinute >= level.winConditions[WinRank.Bronze] && accuracy >= GAME_WIN_MIN_ACCURACY;

          return acc;
        },
        { attempts: 0, successes: 0, mistakes: 0, hasWon: false, accuracy: "--", hitsPerMinute: 0, score: { value: 0 } }
      );
    case GameType.Melody:
      const baseInfo = { successes: 0, mistakes: 0, attempts: 0 };
      // console.log({ level, rounds });
      (rounds as MelodyRound[]).forEach((round) => {
        if (!round.attempts || !round.values) return;

        (round.attempts || []).forEach((attempt, i) => {
          const { noteName: attemptName } = explodeNote(attempt);
          const { noteName: valName } = explodeNote(round.values[i]);
          baseInfo.attempts++;
          isNoteMatch(attemptName, valName) ? baseInfo.successes++ : baseInfo.mistakes++;
        });
      });

      const { successes, attempts } = baseInfo;

      const accuracy = successes / attempts;

      const accuracyStr = isNaN(accuracy) ? "--" : intl.format(accuracy * 100) + "%";
      const hitsPerMinute = successes * (60 / level.durationInSeconds);
      const score = calcLevelScore(successes, accuracy, hitsPerMinute, level.winConditions);
      const hasWon = hitsPerMinute >= level.winConditions[WinRank.Bronze] && accuracy >= GAME_WIN_MIN_ACCURACY;

      return { ...baseInfo, accuracy: accuracyStr, score, hasWon, hitsPerMinute };

    case GameType.Chord:
    case GameType.Rhythm:
    default:
      // prettier-ignore
      return DEFAULT_STATS;
  }
}

function calcLevelScore(
  hits: number,
  accuracy: number,
  hitsPerMinute: number,
  winConditions: WinConditions
): LevelScore {
  const hitScore = 1000;
  let multiplier = 1;

  if (accuracy < 1 && accuracy >= 0.9) {
    multiplier -= 0.1;
  } else if (accuracy >= 0.8) {
    multiplier -= 0.2;
  } else if (accuracy >= 0.7) {
    multiplier -= 0.3;
  } else if (accuracy >= 0.6) {
  }

  if (hitsPerMinute >= winConditions.gold) {
    multiplier += 0.5;
  } else if (hitsPerMinute >= winConditions.silver) {
    multiplier += 0.4;
  } else if (hitsPerMinute >= winConditions.bronze) {
    multiplier += 0.3;
  }

  const score = {
    value: hits * hitScore * multiplier,
    // valueStr: intl.format(hits * hitScore * multiplier),
    multiplier,
    hits,
    hitScore,
    winConditions,
    accuracy,
    formula: `hits * hitScore * multiplier = score`,
  };
  // console.log("<<< calcLevelScore >>> ", {
  //   hits,
  //   accuracy,
  //   hitsPerMinute,
  //   winConditions,
  //   score,
  //   multiplier,
  //   formula: `hits${hits} * hitScore${hitScore} * multiplier${multiplier} = score${score}`,
  // });

  return score;
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
  // console.log({ key, octave, note });
  const filename = `Piano.mf.${capitalizeStr(key)}${octave}_cut.mp3`;
  const filepath = `${filepathBase}/${filename}`;
  return filepath;
}

export function pickKeySignature(level: Level<GameType>) {
  switch (level.gameType) {
    case GameType.Single:
    case GameType.Chord:
    case GameType.Melody: {
      if (level.hasKey) {
        const randomIndex = Math.floor(Math.random() * level.keySignatures.length);
        return level.keySignatures[randomIndex];
      } else {
        return [LevelAccidentType.b].includes(level.accident) ? KeySignature.F : KeySignature.C;
      }
    }

    case GameType.Rhythm:
      return KeySignature.C;
  }
}

export function shuffle<T>(array: T[]): T[] {
  const shuffledArray = [...array]; // Create a copy of the original array

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }

  return shuffledArray;
}

export function groupArrayElements<T>(arr: T[]): T[] {
  const elementsMap = new Map<T, number>();
  for (let i = 0; i < arr.length; i++) {
    const ele = arr[i];
    elementsMap.set(ele, (elementsMap.get(ele) || 0) + 1);
  }

  const groupedArray: T[] = [];
  for (const [ele, count] of elementsMap.entries()) {
    Array(count)
      .fill(0)
      .forEach((_, i) => {
        groupedArray.push(ele);
      });
  }

  // let currentElement = arr[0];
  // let count = 1;

  // for (let i = 1; i < arr.length; i++) {
  //   if (arr[i] === currentElement) {
  //     count++;
  //   } else {
  //     groupedArray.push(...Array(count).fill(currentElement));
  //     currentElement = arr[i];
  //     count = 1;
  //   }
  // }

  // groupedArray.push(...Array(count).fill(currentElement));

  return groupedArray;
}
