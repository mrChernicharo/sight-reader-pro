import { drawAccidents } from "./constants";
import { Accident, GameType, KeySignature, NoteDuration, NoteName, ScaleType } from "./enums";
import { addHalfSteps, explodeNote, getNoteIdx, getRandInRange, NOTE_INDICES } from "./helperFns";
import { scaleTypeNoteSequences } from "./keySignature";
import { ChordRound, Level, MelodyRound, Note, NoteRange, RhythmRound, Scale, SingleNoteRound } from "./types";

function generateRandomNote(
    level: Level,
    keySignature: KeySignature,
    possibleNotes: Note[],
    previousRound?: SingleNoteRound
): Note {
    if (level.type !== GameType.Single) throw Error("gameType incompatible");

    let rangeNotes = getNotesInRange(level.noteRanges, possibleNotes, keySignature);
    if (previousRound) {
        rangeNotes = rangeNotes.filter((note) => note !== previousRound.value);
    }
    const nextNote = pickNextRoundNote(rangeNotes);
    // console.log("::: generateRandomNote :::", { possibleNotes, rangeNotes, nextNote });
    return nextNote;
}

function generateRandomChord(level: Level, previousRound: ChordRound) {
    if (level.type !== GameType.Chord) throw Error("gameType incompatible");
}

export const noteDurationDict = {
    [NoteDuration.w]: 16,
    [NoteDuration["h."]]: 12,
    [NoteDuration.h]: 8,
    [NoteDuration["q."]]: 6,
    [NoteDuration.q]: 4,
    [NoteDuration["8th."]]: 3,
    [NoteDuration["8th"]]: 2,
    [NoteDuration["16th"]]: 1,
};

export const melodyPatterns = [
    // 4 beats
    [NoteDuration.w],
    // 3 beats
    [NoteDuration["h."]],
    [NoteDuration.h, NoteDuration.q],
    [NoteDuration.q, NoteDuration.h],
    // 2 beats
    [NoteDuration.h],
    [NoteDuration["q."], NoteDuration["8th"]],
    [NoteDuration["8th"], NoteDuration["q."]],
    // 1 beat
    [NoteDuration.q],
    [NoteDuration["8th"], NoteDuration["8th"]],
    [NoteDuration["8th."], NoteDuration["16th"]],
    [NoteDuration["16th"], NoteDuration["8th."]],
    [NoteDuration["8th"], NoteDuration["16th"], NoteDuration["16th"]],
    [NoteDuration["16th"], NoteDuration["16th"], NoteDuration["8th"]],
    [NoteDuration["16th"], NoteDuration["8th"], NoteDuration["16th"]],
];

function generateRandomMelody(
    level: Level,
    keySignature: KeySignature,
    possibleNotes: Note[],
    previousRound: MelodyRound
): MelodyRound {
    if (level.type !== GameType.Melody) throw Error("gameType incompatible");
    const rangeNotes = getNotesInRange(level.noteRanges, possibleNotes, keySignature);

    const slots = +level.timeSignature.split("/")[0];
    const totalTime = slots * 4;
    let fillTimeLeft = totalTime;

    const durationList: NoteDuration[][] = [];
    while (fillTimeLeft > 0) {
        const randIdx = getRandInRange(0, melodyPatterns.length - 1);

        const pattern = melodyPatterns[randIdx];
        const patternTime = pattern.reduce((acc, duration) => acc + noteDurationDict[duration], 0);

        if (patternTime <= fillTimeLeft) {
            durationList.push(pattern);
            fillTimeLeft =
                totalTime - durationList.flat().reduce((acc, duration) => acc + noteDurationDict[duration], 0);
        }
    }

    const melodyRound: MelodyRound = { attempts: [], values: [], durations: durationList };
    durationList.forEach((pattern) => {
        pattern.forEach((duration) => {
            const value = pickNextRoundNote(rangeNotes);
            melodyRound.values.push(value);
        });
    });

    // console.log(":::generateRandomMelody", JSON.stringify({ slots, durationList, melodyRound }, null, 2));
    /// 4 slots -> [w]
    /// 4 slots -> [h,h]
    /// 4 slots -> [q,8,8,q,8,8]

    return melodyRound;
}

function generateRandomRhythm(level: Level, previousRound: RhythmRound) {
    if (level.type !== GameType.Rhythm) throw Error("gameType incompatible");
}

export function getNotesInRange(ranges: NoteRange[], keyNotesInAllOctaves: Note[], keySignature: KeySignature) {
    // console.log(":::getNotesInRange", { keyNotesInAllOctaves, ranges });
    // const isFlatKSig = isFlatKeySignature(keySignature);
    const noteSet = new Set<Note>();

    for (const range of ranges) {
        let [rangeNoteLow, rangeNoteHigh] = range.split(":::") as [Note, Note];
        let [rangeNoteIdxLow, rangeNoteIdxHigh] = [rangeNoteLow, rangeNoteHigh].map(getNoteIdx);

        if (rangeNoteIdxLow > rangeNoteIdxHigh) {
            [rangeNoteHigh, rangeNoteLow] = [rangeNoteLow, rangeNoteHigh];
            [rangeNoteIdxHigh, rangeNoteIdxLow] = [rangeNoteIdxLow, rangeNoteIdxHigh];
        }

        let loKeyIdx = keyNotesInAllOctaves.findIndex((n) => n === rangeNoteLow);
        while (loKeyIdx < 0) {
            rangeNoteLow = addHalfSteps(rangeNoteLow, 1, keySignature);
            loKeyIdx = keyNotesInAllOctaves.findIndex((n) => n === rangeNoteLow);
        }

        let hiKeyIdx = keyNotesInAllOctaves.findIndex((n) => n === rangeNoteHigh);
        while (hiKeyIdx < 0) {
            rangeNoteHigh = addHalfSteps(rangeNoteHigh, -1, keySignature);
            hiKeyIdx = keyNotesInAllOctaves.findIndex((n) => n === rangeNoteHigh);
        }

        rangeNoteIdxLow = getNoteIdx(rangeNoteLow);
        rangeNoteIdxHigh = getNoteIdx(rangeNoteHigh);

        keyNotesInAllOctaves.forEach((note) => {
            if (getNoteIdx(note) >= rangeNoteIdxLow && getNoteIdx(note) <= rangeNoteIdxHigh) {
                noteSet.add(note);
            }
        });

        // console.log(":::getNotesInRange", {
        //   range,
        //   keyNotesInAllOctaves,
        //   rangeNoteHigh,
        //   rangeNoteIdxHigh,
        //   rangeNoteLow,
        //   rangeNoteIdxLow,
        //   keySignature,
        //   isFlatKSig,
        // });
    }

    const result = Array.from(noteSet);
    // console.log(":::getNotesInRange", { result, noteSet });
    return result;
}

function pickNextRoundNote(rangeNotes: Note[]): Note {
    const chosenIdx = getRandInRange(0, rangeNotes.length - 1);
    const chosenNote = rangeNotes[chosenIdx];
    // console.log(":::pickNextRoundNote", { rangeNotes, chosenIdx, chosenNote });
    return chosenNote;
}

export function getDrawNote2(
    note: Note,
    keySignature: KeySignature,
    keys: Note[][], // [[lo, hi], [lo, hi]]
    noteIdx?: number
): { drawNote: string; drawAccident: string } {
    // const result = {
    //     drawNote: `${drawNoteName}${noBeQuadroAccident}/${octave}` as Note,
    //     drawAccident: drawAccidents[drawNoteAccident as Accident],
    // };

    console.log({
        note,
        keySignature,
        keys,
        noteIdx,
    });

    return {
        drawNote: `c/3` as Note,
        drawAccident: "#",
    };
}

export function getDrawNote(
    note: Note,
    keySignature: KeySignature,
    roundKeys: Note[],
    noteIdx?: number // <- melody game only
): { drawNote: string; drawAccident: string } {
    const noteMap = scaleTypeNoteSequences[ScaleType.Diatonic];
    const keyNotes = noteMap[keySignature];
    const { baseName, accident, octave, noteName } = explodeNote(note);
    const isMelodyGame = noteIdx !== undefined;

    // console.log("getDrawNote:::", { note, keySignature, roundKeys, noteIdx, isMelodyGame });

    let drawNoteName = "";
    let drawNoteAccident = "";
    let result = { drawNote: note, drawAccident: "" };
    let sameNoteBefore: Note | undefined;
    // @TODO: consider past notes when assigning drawAccidents
    for (const keyNote of keyNotes) {
        const { baseName: keyNoteBaseName, accident: keyAccident } = explodeNote(`${keyNote}/${octave}` as Note);

        if (baseName == keyNoteBaseName) {
            if (isMelodyGame) {
                const previousNotes = roundKeys.filter((n, nIdx) => nIdx < noteIdx);
                const reversedPreviousNotes = previousNotes.toReversed();

                sameNoteBefore = reversedPreviousNotes.find((n) => {
                    const { baseName: bn, noteName: nn, octave: nOct } = explodeNote(n);
                    return bn == baseName && octave == nOct;
                });
            }

            drawNoteName = baseName;

            if (keyAccident && accident) {
                // draw without the accident
            }
            if (keyAccident && !accident) {
                // draw bequadro
                drawNoteAccident = "[]";
            }
            if ((!keyAccident && accident) || (!keyAccident && !accident)) {
                // draw normal
                drawNoteAccident = accident;
            }

            if (sameNoteBefore) {
                const { noteName: beforeNoteName, accident: beforeAccident } = explodeNote(sameNoteBefore);

                if (beforeAccident === accident) {
                    drawNoteAccident = "";
                }
                if (beforeAccident && !accident) {
                    drawNoteAccident = "[]";
                }
                if (beforeAccident == "[]" && accident) {
                    drawNoteAccident = accident;
                }
            }

            const noBeQuadroAccident = drawNoteAccident === Accident["[]"] ? "" : drawNoteAccident;
            result = {
                drawNote: `${drawNoteName}${noBeQuadroAccident}/${octave}` as Note,
                drawAccident: drawAccidents[drawNoteAccident as Accident],
            };
        }
    }

    // console.log("getDrawNote:::", { note, result });
    return result;
}

export function decideNextRound<Round>(
    level: Level,
    keySignature: KeySignature,
    possibleNotes: Note[],
    previousRound?: Round
): Round {
    if (!level) {
        console.warn("decideNextRound ::: no level", { level });
    }

    switch (level?.type) {
        case GameType.Single: {
            const round = {
                value: generateRandomNote(
                    level as Level,
                    keySignature,
                    possibleNotes,
                    previousRound as SingleNoteRound
                ),
                attempt: null,
            } as SingleNoteRound;
            // console.log(">>>>decideNextRound", { level, keySignature, previousRound, round });
            return round as Round;
        }
        case GameType.Chord: {
            //   return generateRandomChord(level, previousRound as ChordRound),
            return { value: ["c/4", "e/4", "g/4"], attempt: [] } as Round;
        }
        case GameType.Melody: {
            const round = generateRandomMelody(
                level as Level,
                keySignature,
                possibleNotes,
                previousRound as MelodyRound
            );
            // console.log(">>>>decideNextRound", { level, keySignature, previousRound, round });
            return round as Round;
        }
        case GameType.Rhythm: {
            // return generateRandomRhythm(level, previousRound as RhythmRound),
            return [{ value: 12, attempt: null }] as Round;
        }
    }
}
/*********
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * ******/

// const game1: Game = {
//   id: "",
//   level_id: "",
//   durationInSeconds: 30,
//   timestamp: 1029839080982,
//   type: GameType.Single,
//   rounds: [
//     { value: "c/5", attempt: null },
//     { value: "eb/5", attempt: null },
//   ],
// };

// const game2: Game = {
//   id: "",
//   level_id: "",
//   durationInSeconds: 30,
//   timestamp: 1029839080982,
//   type: GameType.Rhythm,
//   rounds: [
//     [
//       { value: 10, attempt: null },
//       { value: 2, attempt: null },
//     ],
//     [
//       { value: 4, attempt: null },
//       { value: 2, attempt: null },
//       { value: 2, attempt: null },
//     ],
//   ],
// };

// const games: Game[] = [game1, game2];
// games.forEach((g) => {
//   if (g.type === GameType.Single) {
//     g.rounds[0].value;
//   }

//   if (g.type === GameType.Melody) {
//     g.rounds[0][0].value;
//   }

//   if (g.type === GameType.Chord) {
//     g.rounds[0].value[0];
//   }
// });
