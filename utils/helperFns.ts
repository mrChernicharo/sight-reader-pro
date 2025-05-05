import { Clef, GameType, KeySignature, NoteName, WinRank, Accident, Knowledge } from "./enums";
import {
    Game,
    Level,
    LevelGroupSpec,
    LevelScore,
    MelodyRound,
    Note,
    NoteRange,
    Round,
    Scale,
    SingleNoteRound,
    WinConditions,
} from "./types";
import { noteMathTable } from "./notes";
import { FLAT_KEY_SIGNATURES, scaleTypeNoteSequences } from "./keySignature";
import { GAME_WIN_MIN_ACCURACY } from "./constants";
import { RelativePathString } from "expo-router";

const ID_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
export const randomUID = (length = 12) =>
    Array(length)
        .fill(0)
        .map((item) => ID_CHARS.split("")[Math.round(Math.random() * ID_CHARS.length)])
        .join("");

export async function wait(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getPreviousPage(prevPage: string, id: string) {
    return prevPage === "/practice" ? "/practice" : (`${prevPage}/${id}` as RelativePathString);
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

export function isScaleNote(note: Note, scale: Scale, keySignature: KeySignature) {
    const noteMap = scaleTypeNoteSequences[scale];
    const scaleNoteNames = noteMap[keySignature];
    const notename = explodeNote(note).noteName;

    if (!scaleNoteNames.includes(notename)) {
        return false;
    }
    return true;
}

export function fixNoteUntilItFitsScale(
    note: Note,
    scale: Scale,
    keySignature: KeySignature,
    direction: "ASC" | "DESC"
) {
    while (!isScaleNote(note, scale, keySignature)) {
        note = addHalfSteps(note, direction === "ASC" ? 1 : -1, keySignature);
    }
    return note;
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

// @TODO: update getNoteFromIdx -> getNoteFromIdx(noteIdx, keySignature, scaleType)
export function getNoteFromIdx(noteIdx: number, keySignature: KeySignature) {
    const isFlatKeySig = isFlatKeySignature(keySignature);

    // console.log("getNoteFromIdx 1:::", { noteIdx, keySignature, isFlatKeySig });

    const allOpts = NOTE_INDICES.get(noteIdx)!;

    if (!allOpts) {
        console.error(`getNoteFromIdx [ERROR]:: Could not find note for index ${noteIdx}`);
        return null;
    }

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
        return null;
    }
    return resultNote;
}

export function getPossibleNotesInLevel({ keySignature, scale }: { keySignature: KeySignature; scale: Scale }) {
    // console.log("::: getPossibleNotesInLevel", { keySignature, scale });
    const noteMap = scaleTypeNoteSequences[scale];
    const scaleNoteNames = noteMap[keySignature];

    const availableNotes: Note[] = [];
    const allNotes = Array.from(NOTE_INDICES);
    allNotes.forEach(([idx, notes]) => {
        notes.forEach((note) => {
            const [nn, oct] = note.split("/");
            if (scaleNoteNames.includes(nn as NoteName)) {
                availableNotes.push(note);
            }
        });
    });
    // console.log("::: getPossibleNotesInLevel", { keySignature, scale, availableNotes });
    return availableNotes;
}

export function getEquivalentNotes(note: Note) {
    const noteIdx = getNoteIdx(note);
    return NOTE_INDICES.get(noteIdx);
}

export function addHalfSteps(note: Note, incr: number, keySignature: KeySignature) {
    let noteIdx = getNoteIdx(note);

    const positive = incr >= 0;
    let steps = Math.abs(incr);
    while (steps > 0) {
        if (positive) noteIdx++;
        else noteIdx--;
        steps--;
    }

    const resultNote = getNoteFromIdx(noteIdx, keySignature);
    return resultNote ?? note;
}

export function getNextScaleNote(note: Note, interval: number, keySignature: KeySignature, scale: Scale) {
    if ([-1, 0, 1].includes(interval)) return note;

    const possibleNotes = getPossibleNotesInLevel({ keySignature, scale });

    const noteIdx = possibleNotes.findIndex((n) => n == note);

    let nextNoteIdx = -1;

    if (interval > 0) {
        nextNoteIdx = noteIdx + interval - 1;
    } else {
        nextNoteIdx = noteIdx + interval + 1;
    }
    const nextNote = possibleNotes[nextNoteIdx];
    // console.log(
    //     "getNextScaleNote :::",
    //     JSON.stringify(
    //         {
    //             note,
    //             keySignature,
    //             scale,
    //             interval,
    //             nextNoteIdx,
    //             noteIdx,
    //             nextNote,
    //             // scaleNoteNames,
    //             // possibleNotes,
    //         },
    //         null,
    //         2
    //     )
    // );
    return nextNote;
}

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

export function getIsGameWinAndStars(game: Game | undefined, winConditions: WinConditions) {
    if (!game) return { isGameWin: false, stars: 0 };

    const isGameWin =
        game.score.hitsPerMinute >= winConditions[WinRank.Bronze] && game.score.accuracy >= winConditions.minAccuracy;

    let stars = 0;
    if (game.score.hitsPerMinute >= winConditions[WinRank.Gold]) stars = 3;
    else if (game.score.hitsPerMinute >= winConditions[WinRank.Silver]) stars = 2;
    else if (game.score.hitsPerMinute >= winConditions[WinRank.Bronze]) stars = 1;
    if (!isGameWin) stars = 0;

    return { isGameWin, stars };
}

export function getGameStats(level: Level, rounds: Round<GameType>[], intl: Intl.NumberFormat) {
    const DEFAULT_STATS = {
        attempts: 0,
        successes: 0,
        mistakes: 0,
        hasWon: false,
        accuracy: "--",
        hitsPerMinute: 0,
    };

    // if (true) return DEFAULT_STATS;
    if (!level || !rounds) return DEFAULT_STATS;
    // console.log("getGameStats:::", { level, rounds, gameType: level.gameType });

    switch (level.type) {
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
                    acc.hasWon =
                        acc.hitsPerMinute >= level.winConditions[WinRank.Bronze] &&
                        accuracy >= level.winConditions.minAccuracy;

                    return acc;
                },
                {
                    attempts: 0,
                    successes: 0,
                    mistakes: 0,
                    hasWon: false,
                    accuracy: "--",
                    hitsPerMinute: 0,
                }
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

            const { successes, attempts, mistakes } = baseInfo;
            const accuracy = successes / attempts;
            const accuracyStr = isNaN(accuracy) ? "--" : intl.format(accuracy * 100) + "%";
            const hitsPerMinute = successes * (60 / level.durationInSeconds);
            const hasWon = hitsPerMinute >= level.winConditions[WinRank.Bronze] && accuracy >= GAME_WIN_MIN_ACCURACY;

            const result = { successes, attempts, mistakes, accuracy: accuracyStr, hasWon, hitsPerMinute };
            return result;

        case GameType.Chord:
        case GameType.Rhythm:
        default:
            // prettier-ignore
            return DEFAULT_STATS;
    }
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

export function toCamelCase(str: string) {
    // Remove initial and final spaces and divides the string into words using spaces as delimiters.
    const words = str.trim().split(" ");

    // If the string is empty or contains only spaces, returns an empty string.
    if (!words || words.length === 0) {
        return "";
    }

    // Converts the first word to lowercase.
    let result = words[0].toLowerCase();

    // Iterates over the remaining words (starting from the second word).
    for (let i = 1; i < words.length; i++) {
        // Converts the word to lowercase and capitalizes the first letter.
        const capitalizedWord = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
        // Concatenates the capitalized word to the result.
        result += capitalizedWord;
    }
    // Returns the resulting string in camelCase.
    return result;
}

export function getLevelName(item: Level) {
    const splitLevelName = item.name.split(" ");
    const levelIdx = splitLevelName.pop();
    const levelName = splitLevelName.join(" ");
    return { levelIdx, levelName };
}

export function getAudioFilepath(note: Note) {
    const filepathBase = "@/assets/sounds/piano-notes";
    const [key, octave] = note.split("/");
    // console.log({ key, octave, note });
    const filename = `Piano.mf.${capitalizeStr(key)}${octave}_cut.mp3`;
    const filepath = `${filepathBase}/${filename}`;
    return filepath;
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
    return groupedArray;
}

export function mapRange(zeroToOneInput = 0, min = 0, max = 1, step = 0.5) {
    if (zeroToOneInput < 0 || zeroToOneInput > 1) {
        throw new Error("Input must be between 0 and 1.");
    }

    const mappedValue = min + (max - min) * zeroToOneInput;
    return Math.round(mappedValue / step) * step;
}

// MAJOR_KEY_SIGNATURES
export function makeLevelGroup(spec: LevelGroupSpec) {
    const {
        name,
        clef,
        levelCount,
        durations,
        winConditions,
        keySignatures,
        timeSignatures,
        scales,
        noteRanges,
        skillLevel,
    } = spec;

    const levels: Level[] = [];

    for (let i = 0; i < levelCount; i++) {
        const groupProgress = i / levelCount;

        const scaleIdx = mapRange(groupProgress, 0, scales.length - 1, 1);
        const keySignatureIdx = mapRange(groupProgress, 0, keySignatures.length - 1, 1);
        const timeSignatureIdx = mapRange(groupProgress, 0, timeSignatures.length - 1, 1);

        const keySignature = keySignatures[keySignatureIdx];
        const scale = scales[scaleIdx];

        let [minMinNote, maxMinNote] = [noteRanges.min[0], noteRanges.min[1]];
        let [minMaxNote, maxMaxNote] = [noteRanges.max[0], noteRanges.max[1]];

        maxMinNote = fixNoteUntilItFitsScale(maxMinNote, scale, keySignature, "DESC");
        minMinNote = fixNoteUntilItFitsScale(minMinNote, scale, keySignature, "ASC");
        let currNote = maxMinNote;

        let minIdx = explodeNote(minMinNote).index;
        let maxIdx = explodeNote(maxMinNote).index;

        const minNotes: Note[] = [];
        const nextNote = getNextScaleNote(currNote, -2, keySignature, scale);
        // console.log({ minIdx, maxIdx, minMinNote, maxMinNote, currNote, nextNote });
        while (maxIdx >= minIdx) {
            minNotes.push(currNote);
            currNote = getNextScaleNote(currNote, -2, keySignature, scale);
            maxIdx = explodeNote(currNote).index;
        }

        /////

        minMaxNote = fixNoteUntilItFitsScale(minMaxNote, scale, keySignature, "ASC");
        maxMaxNote = fixNoteUntilItFitsScale(maxMaxNote, scale, keySignature, "DESC");
        currNote = minMaxNote;

        minIdx = explodeNote(minMaxNote).index;
        maxIdx = explodeNote(maxMaxNote).index;

        const maxNotes: Note[] = [];
        while (minIdx <= maxIdx) {
            maxNotes.push(currNote);
            currNote = getNextScaleNote(currNote, 2, keySignature, scale);
            minIdx = explodeNote(currNote).index;
        }

        // if (i == 0) console.log({ maxNotes, minNotes });

        const loNoteIdx = mapRange(groupProgress, 0, minNotes.length - 1, 1);
        const hiNoteIdx = mapRange(groupProgress, 0, maxNotes.length - 1, 1);
        const loNote = minNotes[loNoteIdx];
        const hiNote = maxNotes[hiNoteIdx];

        levels.push({
            // id: `${name}-${padZero(i)}`,
            // name: `${name} ${padZero(i + 1)}`,
            // these will be set later, in useAllLevels
            id: name,
            name,
            index: 0,

            type: groupProgress < 0.7 ? GameType.Single : GameType.Melody,
            skillLevel,
            clef,
            durationInSeconds: mapRange(groupProgress, durations.min, durations.max, 5),

            keySignature,
            timeSignature: timeSignatures[timeSignatureIdx],
            scale,
            noteRanges: [`${loNote}:::${hiNote}` as NoteRange],

            winConditions: {
                minAccuracy: mapRange(groupProgress, winConditions.min.minAccuracy, winConditions.max.minAccuracy, 0.1),
                bronze: mapRange(groupProgress, winConditions.min.bronze, winConditions.max.bronze, 1),
                silver: mapRange(groupProgress, winConditions.min.silver, winConditions.max.silver, 1),
                gold: mapRange(groupProgress, winConditions.min.gold, winConditions.max.gold, 1),
            },
        });
    }

    return levels;
}

export function getLevelHintCount(skillLevel: Knowledge) {
    switch (skillLevel) {
        case Knowledge.novice:
            return 4;
        case Knowledge.beginner:
            return 3;
        case Knowledge.intermediary:
            return 2;
        default:
            return 1;
    }
}

export function getAttemptedNoteDuration(success: boolean) {
    // return success ? 10000 : 15000;
    return success ? 1000 : 1500;
}

export function getIsPracticeLevel(levelId = "") {
    return Boolean(levelId && ["treble-practice", "bass-practice"].includes(levelId));
}

export const skillFilter = (lvl: Level, knowledge: Knowledge) => {
    switch (knowledge) {
        case Knowledge.pro:
            return lvl.skillLevel === Knowledge.pro;
        case Knowledge.advanced:
            return [Knowledge.pro, Knowledge.advanced].includes(lvl.skillLevel);
        case Knowledge.intermediary:
            return [Knowledge.novice, Knowledge.beginner].includes(lvl.skillLevel);
        case Knowledge.beginner:
            return lvl.skillLevel !== Knowledge.novice;
        default:
            true;
    }
};

export function pluckNoteFromMp3Filename(filename: string) {
    // console.log("pluckNoteFromMp3Filename :::", filename);
    if (filename.startsWith("Piano")) {
        const [piano, mf, note] = filename.split(".");
        const oct = note.at(-1);
        let nn = note.substring(0, note.length - 1).toLowerCase();

        return `${nn}/${oct}`;
    }
    return filename;
}

// function calcLevelScore(
//     hits: number,
//     accuracy: number,
//     hitsPerMinute: number,
//     winConditions: WinConditions
// ): LevelScore {
//     const hitScore = 1000;
//     let multiplier = 1;

//     if (accuracy < 1 && accuracy >= 0.9) {
//         multiplier -= 0.1;
//     } else if (accuracy >= 0.8) {
//         multiplier -= 0.2;
//     } else if (accuracy >= 0.7) {
//         multiplier -= 0.3;
//     } else if (accuracy >= 0.6) {
//     }

//     if (hitsPerMinute >= winConditions.gold) {
//         multiplier += 0.5;
//     } else if (hitsPerMinute >= winConditions.silver) {
//         multiplier += 0.4;
//     } else if (hitsPerMinute >= winConditions.bronze) {
//         multiplier += 0.3;
//     }

//     const score = {
//         value: hits * hitScore * multiplier,
//         // valueStr: intl.format(hits * hitScore * multiplier),
//         multiplier,
//         hits,
//         hitScore,
//         winConditions,
//         accuracy,
//         formula: `hits * hitScore * multiplier = score`,
//     };
//     // console.log("<<< calcLevelScore >>> ", {
//     //   hits,
//     //   accuracy,
//     //   hitsPerMinute,
//     //   winConditions,
//     //   score,
//     //   multiplier,
//     //   formula: `hits${hits} * hitScore${hitScore} * multiplier${multiplier} = score${score}`,
//     // });

//     return score;
// }
