import { AppView } from "../../atoms/AppView";

import React, { Component, ReactNode } from "react";
// @ts-ignore
import { Accidental } from "vexflow/src/accidental";
// @ts-ignore
import { Stave } from "vexflow/src/stave";
// @ts-ignore
import { Stem } from "vexflow/src/stem";
// @ts-ignore
import { StaveNote } from "vexflow/src/stavenote";
// @ts-ignore
import { StaveTie } from "vexflow/src/stavetie";
// @ts-ignore
import { Voice } from "vexflow/src/voice";
// @ts-ignore
import { Formatter } from "vexflow/src/formatter";
// @ts-ignore
import { StaveLine } from "vexflow/src/staveline";
// @ts-ignore
import { Modifier } from "vexflow/src/modifier";
// @ts-ignore
import { Beam } from "vexflow/src/beam";
// @ts-ignore
import { ReactNativeSVGContext, NotoFontPack } from "standalone-vexflow-context";

import { AppRegistry, StyleSheet, useWindowDimensions } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { AppText } from "../../atoms/AppText";
import { Note } from "@/utils/types";
import { Clef, GameState, KeySignature } from "@/utils/enums";
import { stemDown } from "@/utils/helperFns";
import { Colors } from "@/utils/Colors";
import { getDrawNote } from "@/utils/noteFns";
import { testBorder } from "@/utils/styles";

const height = 182;
const yPos = 34;

export interface MusicNoteRangeProps {
    keys: [Note, Note][];
    clef: Clef;
    keySignature: KeySignature;
}

export function RangeComponent(props: MusicNoteRangeProps) {
    // const { height, width, scale, fontScale } = useWindowDimensions();
    const theme = useTheme();
    const textColor = Colors[theme].text;

    const { clef, keys, keySignature } = props;
    const svgResult = runVexFlowRangeCode(clef, keys, keySignature, textColor);

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

const numBeatsPerRangeCount = {
    1: 4,
    2: 4,
    3: 6,
};
const noteDurationsPerRangeCount = {
    1: "h",
    2: "q",
    3: "q",
};
const widthPerRangeCount = {
    1: 200,
    2: 240,
    3: 280,
};
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

function runVexFlowRangeCode(
    clef: Clef,
    keys: [Note, Note][],
    keySignature: KeySignature,
    color: string
): React.ReactNode {
    if (keys.length <= 0 || keys.length >= 4) {
        return <></>;
    }
    const width = widthPerRangeCount[keys.length as 1 | 2 | 3] + widthPerKeySig[keySignature];
    const context = new ReactNativeSVGContext(NotoFontPack, {
        width,
        height,
    });

    // console.log("::", { clef, keys, keySignature });

    context
        .setFont("Arial", 48, "")
        .setBackgroundFillStyle("rgba(0, 0, 0, 0)")
        .setFillStyle(color)
        .setStrokeStyle(color)
        .setLineWidth(2);

    const stave = new Stave(0, yPos, width);
    stave.setContext(context);
    stave.setClef(clef);
    stave.setKeySignature(keySignature);
    // stave.setTimeSignature("6/4");
    stave.draw();

    const notes = [];
    const ties = [];
    const duration = noteDurationsPerRangeCount[keys.length as 1 | 2 | 3];
    const num_beats = numBeatsPerRangeCount[keys.length as 1 | 2 | 3];

    let noteIdx = 0;
    for (const [low, high] of keys) {
        const { drawNote: loDrawNote, drawAccident: loDrawAccident } = getDrawNote(low, keySignature, [low, high]);
        const { drawNote: hiDrawNote, drawAccident: hiDrawAccident } = getDrawNote(high, keySignature, [low, high]);

        const staveNoteLow = new StaveNote({
            clef,
            keys: [loDrawNote],
            duration,
            stem_direction: stemDown(loDrawNote as Note, clef) ? -1 : 1,
        });
        const staveNoteHigh = new StaveNote({
            clef,
            keys: [hiDrawNote],
            duration,
            stem_direction: stemDown(hiDrawNote as Note, clef) ? -1 : 1,
        });

        if (loDrawAccident) {
            staveNoteLow.addAccidental(0, new Accidental(loDrawAccident));
        }

        if (hiDrawAccident) {
            staveNoteHigh.addAccidental(0, new Accidental(hiDrawAccident));
        }

        notes.push(staveNoteLow, staveNoteHigh);

        ties.push(
            new StaveTie({
                first_note: notes[noteIdx],
                last_note: notes[noteIdx + 1],
                first_indices: [0],
                last_indices: [0],
            })
        );
        noteIdx += 2;

        // console.log({ stave, staveNoteHigh, notes, ties });
    }

    const voice = new Voice({ num_beats, beat_value: 4 });
    voice.addTickables(notes);

    new Formatter().joinVoices([voice]).formatToStave([voice], stave);
    voice.draw(context, stave);

    ties.forEach((t) => {
        t.setContext(context).draw();
    });

    const renderResult = context.render() as ReactNode;
    return renderResult;
}

const styles = StyleSheet.create({
    container: {},
    sheetMusic: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    innerView: {
        // ...testBorder(),
    },
});
