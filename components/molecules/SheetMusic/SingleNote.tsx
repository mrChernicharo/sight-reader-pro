import { AppView } from "../../atoms/AppView";

import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
// @ts-ignore
import { Accidental } from "vexflow/src/accidental";
// @ts-ignore
import { Stave } from "vexflow/src/stave";
// @ts-ignore
import { StaveNote } from "vexflow/src/stavenote";
// @ts-ignore
import { Voice } from "vexflow/src/voice";
// @ts-ignore
import { Formatter } from "vexflow/src/formatter";
// @ts-ignore
import { NotoFontPack, ReactNativeSVGContext } from "standalone-vexflow-context";

import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import { AppEvents, Clef, KeySignature } from "@/utils/enums";
import { getDrawNote } from "@/utils/noteFns";
import { Note, NotePlayedEventData } from "@/utils/types";
import { StyleSheet } from "react-native";
import { eventEmitter } from "@/app/_layout";
import { explodeNote, isNoteMatch, wait } from "@/utils/helperFns";

export interface MusicNoteProps {
    targetNote: Note;
    clef: Clef;
    keySignature: KeySignature;
}

const widthPerKeySig = {
    [KeySignature.Cb]: 70,
    [KeySignature.Gb]: 60,
    [KeySignature.Db]: 50,
    [KeySignature.Ab]: 40,
    [KeySignature.Eb]: 30,
    [KeySignature.Bb]: 20,
    [KeySignature.F]: 10,
    [KeySignature.C]: 0,
    [KeySignature.G]: 10,
    [KeySignature.D]: 20,
    [KeySignature.A]: 30,
    [KeySignature.E]: 40,
    [KeySignature.B]: 50,
    [KeySignature["F#"]]: 60,
    [KeySignature["C#"]]: 70,

    [KeySignature.Abm]: 70,
    [KeySignature.Ebm]: 60,
    [KeySignature.Bbm]: 50,
    [KeySignature.Fm]: 40,
    [KeySignature.Cm]: 30,
    [KeySignature.Gm]: 20,
    [KeySignature.Dm]: 10,
    [KeySignature.Am]: 0,
    [KeySignature.Em]: 10,
    [KeySignature.Bm]: 20,
    [KeySignature["F#m"]]: 30,
    [KeySignature["C#m"]]: 40,
    [KeySignature["G#m"]]: 50,
    [KeySignature["D#m"]]: 60,
    [KeySignature["A#m"]]: 70,
};

const height = 220;
const waitTime = 400;

export function SingleNoteComponent(props: MusicNoteProps) {
    const { clef, keySignature, targetNote: propNote } = props;

    const prevNote = useRef<Note | null>(null);
    const [playedNote, setPlayedNote] = useState<Note | null>(null);
    const [targetNote, setTargetNote] = useState<Note | null>(null);

    const svgResult = useRef<ReactNode>(null);

    const width = useMemo(() => 180 + widthPerKeySig[keySignature], [keySignature]);

    // const context: ReactNativeSVGContext = useMemo(() => {
    //     const ctx = new ReactNativeSVGContext(NotoFontPack, { width });
    //     return ctx;
    // }, []);

    const SvgResult = useMemo(() => {
        if (playedNote || targetNote) {
            const context = new ReactNativeSVGContext(NotoFontPack, { width });
            svgResult.current = runVexFlowCode2({ context, clef, targetNote, playedNote, keySignature, width });
        }
        return svgResult.current;
    }, [playedNote, targetNote, keySignature, clef]);

    useEffect(() => {
        eventEmitter.addListener(AppEvents.NotePlayed, async (event) => {
            const { playedNote: userNote, isSuccess } = event.data as NotePlayedEventData;
            setPlayedNote(userNote);
        });

        return () => eventEmitter.removeAllListeners(AppEvents.NotePlayed);
    }, []);

    // useEffect(() => {
    //     console.log({ playedNote, targetNote });
    // }, [playedNote, propNote]);

    useEffect(() => {
        setTargetNote(null);
        setPlayedNote(null);
        wait(waitTime).then(() => {
            setTargetNote(propNote);
        });

        return () => console.log("\n");
    }, [propNote]);

    return (
        <AppView style={styles.container}>
            <AppView style={styles.sheetMusic}>
                <AppView style={styles.innerView}>{SvgResult}</AppView>
            </AppView>
        </AppView>
    );
}

/*
durations:
  w, h, q, 8, 16, 32, 64
*/

// const notes = [
//  new StaveNote({ clef, keys, duration: "w", align_center: true }),
//  new StaveNote({ clef, keys, duration: "h", stem_direction: -1 }),
//  new StaveNote({ clef, keys: ["c/4", "e/4"], duration: "q" }).addAccidental(0, new Accidental("#")).addDotToAll(),
// ];

function runVexFlowCode2({
    context,
    clef,
    targetNote,
    playedNote,
    keySignature,
    width,
}: {
    context: ReactNativeSVGContext;
    clef: Clef;
    targetNote: Note | null;
    playedNote: Note | null;
    keySignature: KeySignature;
    width: number;
}) {
    const color = Colors.dark.text;
    const notes = [targetNote, playedNote].filter(Boolean) as Note[];
    const noteNames = notes.map((n) => explodeNote(n).noteName);
    const isSuccess = noteNames.length == 2 ? isNoteMatch(noteNames[0], noteNames[1]) : null;
    if (isSuccess) notes.pop();

    // console.log({ noteNames, notes, targetNote, playedNote });

    // const color = Colors.dark.green;
    // context.clearRect(0, 0, 300, 300);
    context.setFont("Arial", 20, "").setFillStyle(color).setStrokeStyle(color).setLineWidth(3);

    const stave = new Stave(0, 80, width);
    stave.setContext(context);
    stave.setClef(clef);
    stave.setKeySignature(keySignature);
    // stave.setTimeSignature("4/4");
    // stave.setNoteStartX(90);
    stave.draw();

    // const staveNotes: StaveNote[] = [];
    const voices: Voice[] = [];

    notes.forEach((note, idx) => {
        const { drawNote, drawAccident } = getDrawNote(note, keySignature, [note]);

        const staveNote = new StaveNote({
            clef,
            keys: [drawNote],
            duration: "w",
            // align_center: i == 1 ? true : false,
            align_center: true,
            glyph_font_scale: 38,
            // left_modPx: i == 0 ? 0 : 90,
        });

        // staveNote
        // staveNote.setStroke("green");

        if (drawAccident) {
            const accidental = new Accidental(drawAccident);
            accidental.setXShift(0);
            console.log({ accidental });
            staveNote.addAccidental(0, accidental);
        }

        // staveNotes.push(staveNote);
        const voice = new Voice({ num_beats: 4, beat_value: 4 });
        voice.addTickables([staveNote]);
        voices.push(voice);
    });

    const formatter = new Formatter();
    formatter.joinVoices(voices).formatToStave(voices, stave);

    voices.forEach((voice, idx) => {
        const staveNoteRef = voice.tickables[0];

        staveNoteRef.setXShift(idx == 0 ? -20 : 0);

        if (isSuccess != null) {
            if (isSuccess) {
                context.setFillStyle(Colors.dark.green);
            }
            //
            else if (!isSuccess && idx == 1) {
                context.setFillStyle(Colors.dark.red);
            }
        }
        voice.draw(context, stave);
    });

    //     try {
    //     console.log({
    //         staveNote,
    //         // stemX: staveNote.getStemX(),
    //         flagStyle: staveNote.getFlagStyle(),
    //         x: staveNote.getX(),
    //         // noteHeadBeginX: staveNote.getNoteHeadBeginX(),
    //         // noteHeadBeginX: staveNote.getNoteHeadBeginX(),
    //     });
    // } catch (error) {
    //     console.log(error);
    // }
    const staveNotes = voices.map((v) => v.tickables[0]);

    try {
        console.log({
            voices,
            stave,
            staveNotes,
            xPos: staveNotes.map((n) => n.getX()),
            noteStyles: staveNotes.map((n) => n.getStyle()),
            //     noteHeads: voices.map((v) => v.tickables[0].note_heads[0]),
            //     noteHeadsX: voices.map((v) => v.tickables[0].note_heads[0].x),
        });

        staveNotes.forEach((n, idx) => {
            n.setXShift(0);
        });
    } catch (error) {
        console.log(error);
    }

    const renderResult = context.render() as ReactNode;
    // context.clear();
    // const result = noteColor ? addColorToNoteOutput(renderResult, noteColor) : renderResult;
    // return result;
    return renderResult;
}

// function runVexFlowCode(
//     context: any,
//     clef: Clef,
//     note: Note,
//     keySignature: KeySignature,
//     width: number,
//     color: string,
//     noteColor?: string
// ) {
//     context.setFont("Arial", 20, "").setFillStyle(color).setStrokeStyle(color).setLineWidth(3);

//     const stave = new Stave(0, 80, width);
//     stave.setContext(context);
//     stave.setClef(clef);
//     stave.setKeySignature(keySignature);
//     // stave.setTimeSignature("4/4");
//     // stave.setNoteStartX(90);
//     stave.draw();

//     const notes = [];
//     const { drawNote, drawAccident } = getDrawNote(note, keySignature, [note]);

//     const isError = noteColor === Colors.dark.red;

//     // console.log({ noteColor, isError, note, drawNote, drawAccident });

//     const staveNote = new StaveNote({
//         clef,
//         keys: [drawNote],
//         duration: "w",
//         align_center: true,
//         glyph_font_scale: 38,
//     });

//     if (drawAccident) {
//         staveNote.addAccidental(0, new Accidental(drawAccident));
//     }

//     notes.push(staveNote);

//     const voice = new Voice({ num_beats: 4, beat_value: 4 });
//     voice.addTickables(notes);

//     new Formatter().joinVoices([voice]).formatToStave([voice], stave);
//     voice.draw(context, stave);

//     const renderResult = context.render() as ReactNode;

//     const result = noteColor ? addColorToNoteOutput(renderResult, noteColor) : renderResult;
//     return result;
// }

// type SvgStrut = {
//     props: {
//         children: {
//             props: {
//                 className?: string;
//                 children: {
//                     props: {
//                         children: {
//                             props: {
//                                 fill: string;
//                                 stroke: string;
//                                 children: {
//                                     props: {
//                                         fill: string;
//                                         stroke: string;
//                                     };
//                                 };
//                             };
//                         }[];
//                     };
//                 }[];
//             };
//         }[];
//     };
// };

// function addColorToNoteOutput(svgStruct: any, color: string) {
//     // console.log("svgStruct", svgStruct);
//     const result: SvgStrut = {
//         ...svgStruct,
//         props: {
//             ...svgStruct.props,
//             children: svgStruct.props.children.map((staveG: any) => {
//                 if (staveG.props.className === "vf-stavenote") {
//                     const svg = {
//                         ...staveG,
//                         props: {
//                             ...staveG.props,
//                             children: staveG.props.children.map((noteG: any) => ({
//                                 ...noteG,
//                                 props: {
//                                     ...noteG.props,
//                                     children: noteG.props.children.map((noteHeadG: any) => ({
//                                         ...noteHeadG,
//                                         props: {
//                                             ...noteHeadG.props,
//                                             fill: color,
//                                             stroke: color,
//                                             children: noteHeadG.props.children.map((notePath: any, i: number) => {
//                                                 // console.log('::::addColorToNoteOutput',{ i, staveG, noteG, noteHeadG, notePath });
//                                                 return {
//                                                     ...notePath,
//                                                     props: {
//                                                         ...notePath.props,
//                                                         fill: color,
//                                                         stroke: color,
//                                                         // scale,
//                                                         // onLayout: (ev: LayoutChangeEvent) => {},
//                                                         // style: {},
//                                                     },
//                                                 };
//                                             }),
//                                         },
//                                     })),
//                                 },
//                             })),
//                         },
//                     };

//                     return svg;
//                 } else {
//                     return staveG;
//                 }
//             }),
//         },
//     };

//     return result as React.ReactNode;
// }

const styles = StyleSheet.create({
    container: {
        height,
        // borderWidth: 2,
        // borderStyle: "dashed",
        // backgroundColor: "#F5FCFF",
        backgroundColor: "transparent",
        // ...testBorder("blue"),
    },
    sheetMusic: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        transform: [{ scaleX: 1.4 }, { scaleY: 1.2 }],
    },
    innerView: {
        transform: [{ translateX: 2 }],
        backgroundColor: "transparent",
        // ...testBorder(),
    },
});
