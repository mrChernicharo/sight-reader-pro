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

export function SingleNoteComponent(props: MusicNoteProps) {
    const { clef, keySignature, targetNote } = props;

    const prevNote = useRef<Note | null>(null);
    const [playedNote, setPlayedNote] = useState<Note | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    const width = useMemo(() => 180 + widthPerKeySig[keySignature], [keySignature]);

    // const context: ReactNativeSVGContext = useMemo(() => {
    //     const ctx = new ReactNativeSVGContext(NotoFontPack, { width });
    //     return ctx;
    // }, []);

    // const note = keys[0];
    // const prevColor = useRef<string | undefined>(noteColor);

    // const SvgResult = useMemo(() => {
    //     let skip = false;
    //     if (note !== prevNote.current && noteColor === prevColor.current) skip = true;

    //     prevNote.current = note;
    //     prevColor.current = noteColor;

    //     if (skip) return null;

    //     const width = 180 + widthPerKeySig[keySignature];
    //     const context = new ReactNativeSVGContext(NotoFontPack, { width });

    //     return runVexFlowCode(context, clef, note, keySignature, width, Colors.dark.text, noteColor);
    // }, [note, keySignature, clef, noteColor]);

    const SvgResult = useMemo(() => {
        const context = new ReactNativeSVGContext(NotoFontPack, { width });
        // context.clear();

        return runVexFlowCode2({
            context,
            clef,
            targetNote,
            playedNote,
            keySignature,
            width,
        });
    }, [playedNote, targetNote, keySignature, clef]);

    useEffect(() => {
        eventEmitter.addListener(AppEvents.NotePlayed, async (event) => {
            const { currNote, playedNote: userNote, isSuccess, currNoteValue } = event.data as NotePlayedEventData;
            // console.log(event);
            setPlayedNote(userNote);
            // setIsSuccess(isSuccess);
            console.log("===============");
        });

        return () => eventEmitter.removeAllListeners(AppEvents.NotePlayed);
    }, []);

    // useEffect(() => {
    //     console.log({ note, keySignature, clef, noteColor });
    // }, [note, keySignature, clef, noteColor]);

    useEffect(() => {
        // console.log({ playedNote, targetNote });
    }, [playedNote, targetNote]);

    useEffect(() => {
        if (targetNote) {
            wait(200).then(() => {
                setPlayedNote(null);
            });
            // setIsSuccess(null);
        }
    }, [targetNote]);

    // useEffect(() => {
    //     if (!playedNote) console.log("===============");
    // }, [playedNote]);
    // console.log("querySelector", SvgResult?.toLocaleString().split("width={1} />"));

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
    targetNote: Note;
    playedNote: Note | null;
    keySignature: KeySignature;
    width: number;
}) {
    const color = Colors.dark.text;
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

    const notes = [targetNote, playedNote].filter(Boolean) as Note[];
    const noteNames = notes.map((n) => explodeNote(n).noteName);

    notes.forEach((note, i) => {
        const { drawNote, drawAccident } = getDrawNote(note, keySignature, [note]);

        const staveNote = new StaveNote({
            clef,
            keys: [drawNote],
            duration: "w",
            align_center: true,
            glyph_font_scale: 38,
            // glyph_stroke: "green",
            // stroke: "green",
            // glyph_fill: "green",
            // fill: "green",
            // fill_color: "green",
        });
        // console.log({ drawNote, staveNote });
        // staveNote
        // staveNote.setStroke("green");

        if (drawAccident) {
            staveNote.addAccidental(0, new Accidental(drawAccident));
        }

        // staveNotes.push(staveNote);
        const voice = new Voice({ num_beats: 4, beat_value: 4 });
        voice.addTickables([staveNote]);
        voices.push(voice);
    });

    const formatter = new Formatter();
    // if (noteNames.length > 0) {
    //     const isSuccess = isNoteMatch(noteNames[0], noteNames[0]);
    //     context.setFillStyle(isSuccess ? Colors.dark.green : Colors.dark.red);
    // } else {
    //     context.setFillStyle(color);
    // }

    formatter.joinVoices(voices).formatToStave(voices, stave);
    voices.forEach((v) => v.draw(context, stave));

    console.log({
        // formatter,
        // voices,
        // tickContexts: formatter.tickContexts,
        // modiferContexts: formatter.modiferContexts,
        modiferContext: formatter.modiferContexts[0],
        attrs: voices[0].attrs,
    });

    const renderResult = context.render() as ReactNode;
    context.clear();

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

type SvgStrut = {
    props: {
        children: {
            props: {
                className?: string;
                children: {
                    props: {
                        children: {
                            props: {
                                fill: string;
                                stroke: string;
                                children: {
                                    props: {
                                        fill: string;
                                        stroke: string;
                                    };
                                };
                            };
                        }[];
                    };
                }[];
            };
        }[];
    };
};

function addColorToNoteOutput(svgStruct: any, color: string) {
    // console.log("svgStruct", svgStruct);
    const result: SvgStrut = {
        ...svgStruct,
        props: {
            ...svgStruct.props,
            children: svgStruct.props.children.map((staveG: any) => {
                if (staveG.props.className === "vf-stavenote") {
                    const svg = {
                        ...staveG,
                        props: {
                            ...staveG.props,
                            children: staveG.props.children.map((noteG: any) => ({
                                ...noteG,
                                props: {
                                    ...noteG.props,
                                    children: noteG.props.children.map((noteHeadG: any) => ({
                                        ...noteHeadG,
                                        props: {
                                            ...noteHeadG.props,
                                            fill: color,
                                            stroke: color,
                                            children: noteHeadG.props.children.map((notePath: any, i: number) => {
                                                // console.log('::::addColorToNoteOutput',{ i, staveG, noteG, noteHeadG, notePath });
                                                return {
                                                    ...notePath,
                                                    props: {
                                                        ...notePath.props,
                                                        fill: color,
                                                        stroke: color,
                                                        // scale,
                                                        // onLayout: (ev: LayoutChangeEvent) => {},
                                                        // style: {},
                                                    },
                                                };
                                            }),
                                        },
                                    })),
                                },
                            })),
                        },
                    };

                    return svg;
                } else {
                    return staveG;
                }
            }),
        },
    };

    return result as React.ReactNode;
}

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
