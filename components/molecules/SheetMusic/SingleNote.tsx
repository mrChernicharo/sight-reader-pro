import { AppView } from "../../atoms/AppView";

import React, { ReactNode } from "react";
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

import { StyleSheet, useWindowDimensions } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { GameScore, Level, Note } from "@/utils/types";
import { Clef, GameState, KeySignature } from "@/utils/enums";
import { Colors } from "@/utils/Colors";
import { getDrawNote } from "@/utils/noteFns";
import { transform } from "@babel/core";
import { testBorder } from "@/utils/styles";

export interface MusicNoteProps {
    keys: Note[];
    clef: Clef;
    keySignature: KeySignature;
    noteColor?: string;
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
    // const width = 210 + widthPerKeySig[props.keySignature];
    const width = 180 + widthPerKeySig[props.keySignature];
    // const { height, width, scale, fontScale } = useWindowDimensions();
    const theme = useTheme();
    const textColor = Colors[theme].text;
    const context = new ReactNativeSVGContext(NotoFontPack, { width });
    const { clef, keys, keySignature, noteColor } = props;
    const svgResult = runVexFlowCode(context, clef, keys, keySignature, width, textColor, noteColor);

    return (
        <AppView style={styles.container}>
            <AppView style={styles.sheetMusic}>
                <AppView style={styles.innerView}>{svgResult}</AppView>
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

function runVexFlowCode(
    context: any,
    clef: Clef,
    keys: Note[],
    keySignature: KeySignature,
    width: number,
    color: string,
    noteColor?: string
) {
    // console.log("runVexFlowCode :::: Single", { keys });
    if (!keys || keys.length > 1) {
        console.error("Single Note vexFlow function can only accept 1 note!");
        return <></>;
    }

    context.setFont("Arial", 20, "red").setFillStyle(color).setStrokeStyle(color).setLineWidth(3);

    const stave = new Stave(0, 80, width);
    stave.setContext(context);
    stave.setClef(clef);
    stave.setKeySignature(keySignature);
    //   stave.setTimeSignature("4/4");
    // stave.setNoteStartX(90);
    stave.draw();

    const notes = [];
    const note = keys[0];
    const { drawNote, drawAccident } = getDrawNote(note, keySignature, keys);

    const staveNote = new StaveNote({ clef, keys: [drawNote], duration: "w", align_center: true });

    if (drawAccident) {
        staveNote.addAccidental(0, new Accidental(drawAccident));
    }

    notes.push(staveNote);

    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    new Formatter().joinVoices([voice]).formatToStave([voice], stave);
    voice.draw(context, stave);

    const renderResult = context.render() as ReactNode;
    // console.log({ renderResult });

    return noteColor ? addColorToNoteOutput(renderResult, noteColor) : renderResult;
}

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
                    return {
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
                                                        // scale: 1.4,
                                                        // translateX: -66,
                                                        // translateY: "-50%",
                                                        // style: {
                                                        // scale: 1.4,
                                                        // transformOrigin: "center center",
                                                        // },
                                                    },
                                                };
                                            }),
                                        },
                                    })),
                                },
                            })),
                        },
                    };
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
        ...testBorder("green"),
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
        ...testBorder(),
    },
});
