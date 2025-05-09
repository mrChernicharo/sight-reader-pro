import { AppView } from "../../atoms/AppView";

import React, { ReactNode, useMemo } from "react";
// @ts-ignore
// import { StaveTie } from "vexflow/src/stavetie";
// import { Dot } from "vexflow/src/dot";
// import { Stem } from "vexflow/src/stem";
// import { StaveLine } from "vexflow/src/staveline";
// import { Modifier } from "vexflow/src/modifier";

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
import { Beam } from "vexflow/src/beam";
// @ts-ignore
import { NotoFontPack, ReactNativeSVGContext } from "standalone-vexflow-context";

import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import { Clef, KeySignature, NoteDuration, TimeSignature } from "@/utils/enums";
import { stemDown } from "@/utils/helperFns";
import { getDrawNote, noteDurationDict } from "@/utils/noteFns";
import { Note } from "@/utils/types";
import { StyleSheet, useWindowDimensions } from "react-native";
import { getScoreHeight } from "@/utils/device_sizes";

export interface MusicNoteRangeProps {
    keys: Note[];
    durations: NoteDuration[][];
    clef: Clef;
    keySignature: KeySignature;
    timeSignature: TimeSignature;
    roundResults: (1 | 0)[];
}

const scoreDims = getScoreHeight();
const height = scoreDims.stageHeight;

export function MelodyComponent(props: MusicNoteRangeProps) {
    const theme = useTheme();
    const { width } = useWindowDimensions();
    const { clef, keys, durations, keySignature, timeSignature, roundResults } = props;

    // console.log("props ::: MelodyComponent", { isDev: isDev() });

    const svgResult = useMemo(() => {
        const MARGIN = width * 0.06;
        const textColor = Colors[theme].text;

        return runVexFlowRangeCode(
            width - MARGIN * 2,
            clef,
            keys,
            durations,
            keySignature,
            timeSignature,
            roundResults,
            { success: Colors[theme].green, mistake: Colors[theme].red },
            textColor
        );
    }, [width, clef, keys, durations, keySignature, timeSignature, roundResults]);

    return (
        <AppView style={styles.container}>
            <AppView style={styles.sheetMusic}>
                <AppView style={styles.innerView}>{svgResult}</AppView>
            </AppView>
        </AppView>
    );
}

function runVexFlowRangeCode(
    width: number,
    clef: Clef,
    keys: Note[],
    durations: NoteDuration[][],
    keySignature: KeySignature,
    timeSignature: TimeSignature,
    roundResults: (1 | 0)[],
    colors: { success: string; mistake: string },
    textColor: string
): React.ReactNode {
    if (keys.length <= 0) {
        return <></>;
    }
    // console.log("runVexFlowCode ::: Melody", { keys });
    const context = new ReactNativeSVGContext(NotoFontPack, { width, height });
    // console.log(":::> runVexFlowRangeCode", { clef, keys, keySignature, timeSignature, width, durations });
    context
        .setFont("Arial", 48, "")
        .setBackgroundFillStyle("rgba(0, 0, 0, 0)")
        .setFillStyle(textColor)
        .setStrokeStyle(textColor)
        .setLineWidth(2);

    const stave = new Stave(0, scoreDims.staveYPos, width);
    stave.setContext(context);
    stave.setClef(clef);
    stave.setKeySignature(keySignature);
    stave.setTimeSignature(timeSignature);
    stave.draw();

    const notes: StaveNote[] = [];
    const beams: Beam[] = [];

    let noteIdx = 0;
    for (let patIdx = 0; patIdx < durations.length; patIdx++) {
        const pattern = durations[patIdx];
        const shouldBeam =
            pattern.length > 1 && pattern.reduce((acc, duration) => acc + noteDurationDict[duration], 0) === 4;

        // console.log({ pattern, shouldBeam });

        const patternNotes: StaveNote[] = [];

        for (let durIdx = 0; durIdx < pattern.length; durIdx++) {
            const note = keys[noteIdx];
            const { drawNote, drawAccident } = getDrawNote(note, keySignature, keys, noteIdx);

            const noteDuration = pattern[durIdx];
            const hasDot = noteDuration.endsWith(".");
            const duration = hasDot ? noteDuration.slice(0, -1) : noteDuration;
            // const isLongNote = noteDurationDict[noteDuration] > 4;

            const staveNote = new StaveNote({
                clef,
                keys: [drawNote],
                duration,
                dots: hasDot ? 1 : 0,
                ...(!shouldBeam && {
                    stem_direction: stemDown(drawNote as Note, clef) ? -1 : 1,
                }),
            });

            if (hasDot) {
                staveNote.addDotToAll();
            }

            if (drawAccident) {
                staveNote.addAccidental(0, new Accidental(drawAccident));
            }

            patternNotes.push(staveNote);
            noteIdx++;
        }

        patternNotes.forEach((stvNote) => {
            notes.push(stvNote);
        });
        if (shouldBeam) {
            beams.push(new Beam(patternNotes));
        }
    }

    // console.log("runVFMelody ::::", { notes });

    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    new Formatter().joinVoices([voice]).formatToStave([voice], stave);

    voice.draw(context, stave);

    beams.forEach((b) => {
        b.setContext(context).draw();
    });

    const renderResult = context.render() as ReactNode;

    // console.log("===================");

    return colorizeNoteOutput(renderResult, roundResults, colors);
    // return noteColor ? addColorToNoteOutput(renderResult, noteColor) : renderResult;
}

const styles = StyleSheet.create({
    container: {
        height,
        // borderWidth: 2,
        // borderStyle: "dashed",
        // backgroundColor: "#F5FCFF",
    },
    sheetMusic: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    innerView: {
        // marginHorizontal: "auto",
        // transform: [{ translateX: 25 }],
        // transform: "translateX(80px)",
    },
});

function colorizeNoteOutput(svgStruct: any, roundResults: (1 | 0)[], colors: { success: string; mistake: string }) {
    // console.log('svgStruct', svgStruct);
    // console.log('roundResults', roundResults);

    let noteCount = 0;

    const result = {
        ...svgStruct,
        props: {
            ...svgStruct.props,
            children: svgStruct.props.children.map((ch: any) => {
                if (ch.props.className === "vf-stavenote") {
                    const isSuccess = roundResults[noteCount] === 1;
                    noteCount++;
                    // console.log("note!", noteCount, ch, isSuccess);
                    if (noteCount > roundResults.length) {
                        return ch;
                    } else {
                        return {
                            ...ch,
                            props: {
                                ...ch.props,
                                children: ch.props.children.map((ich: any) => ({
                                    ...ich,
                                    props: {
                                        ...ich.props,
                                        children: ich.props.children.map((iich: any) => {
                                            return {
                                                ...iich,
                                                props: {
                                                    ...iich.props,
                                                    fill: isSuccess ? colors.success : colors.mistake,
                                                    stroke: isSuccess ? colors.success : colors.mistake,
                                                    children: iich.props.children.map((iiich: any, i: number) => {
                                                        return {
                                                            ...iiich,
                                                            props: {
                                                                ...iiich.props,
                                                                fill: isSuccess ? colors.success : colors.mistake,
                                                                stroke: isSuccess ? colors.success : colors.mistake,
                                                            },
                                                        };
                                                    }),
                                                },
                                            };
                                        }),
                                    },
                                })),
                            },
                        };
                    }
                }

                return ch;
            }),
        },
    };

    return result as React.ReactNode;
}
