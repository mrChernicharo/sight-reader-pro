import { AppView } from "../../atoms/AppView";

import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
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

import { eventEmitter } from "@/app/_layout";
import { useAppStore } from "@/hooks/useAppStore";
import { Colors } from "@/utils/Colors";
import { AppEvents, Clef, KeySignature } from "@/utils/enums";
import { explodeNote, isNoteMatch, wait } from "@/utils/helperFns";
import { getDrawNote } from "@/utils/noteFns";
import { Note, NotePlayedEventData } from "@/utils/types";
import { StyleSheet } from "react-native";
import { getScoreHeight } from "@/utils/device_sizes";

const armatureSpace = {
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
// const maxArmatureSpace = armatureSpace[KeySignature.Abm];
// const safetyXMargin = 40;

const scoreDims = getScoreHeight();
const height = scoreDims.stageHeight;
const MIN_STAVE_WIDTH = 180;

const WAIT_SUCCESS = 100;
const WAIT_MISTAKE = 350;
export interface MusicNoteProps {
    targetNote: Note;
    clef: Clef;
    keySignature: KeySignature;
}

export function SingleNoteComponent(props: MusicNoteProps) {
    const { clef, keySignature, targetNote: propNote } = props;
    const isTourCompleted = useAppStore((state) => state.completedTours.game);

    const waitTime = useRef<number>(WAIT_MISTAKE);
    const [playedNote, setPlayedNote] = useState<Note | null>(null);
    const [targetNote, setTargetNote] = useState<Note | null>(null);

    const svgResult = useRef<ReactNode>(null);

    const width = useMemo(() => MIN_STAVE_WIDTH + armatureSpace[keySignature], [keySignature]);

    const context: ReactNativeSVGContext = useMemo(() => {
        return new ReactNativeSVGContext(NotoFontPack, { width, height });
    }, [width]);

    const SvgResult = useMemo(() => {
        if (playedNote || targetNote) {
            context.setFillStyle(Colors.dark.text).setStrokeStyle(Colors.dark.text).setLineWidth(3);

            const renderResult = runVexFlowCode({
                context,
                clef,
                targetNote,
                playedNote,
                keySignature,
                width,
            });

            svgResult.current = renderResult;
        } else {
            context.setBackgroundFillStyle(isTourCompleted ? Colors.dark.bg : "rgba(0, 0, 0, 0)");
            context.clearRect(0, 25, width, height);
        }
        return svgResult.current;
    }, [context, playedNote, targetNote, keySignature, clef]);

    useEffect(() => {
        eventEmitter.addListener(AppEvents.NotePlayed, ({ data }: { data: NotePlayedEventData }) => {
            // console.log("listenerCount ::::", eventEmitter.listenerCount(AppEvents.NotePlayed));
            const { playedNote, isSuccess } = data;
            // console.log("NotePlayed:::", { playedNote, isSuccess });
            waitTime.current = isSuccess ? WAIT_SUCCESS : WAIT_MISTAKE;
            setPlayedNote(playedNote);
        });
    }, []);

    useEffect(() => {
        setTargetNote(null);
        setPlayedNote(null);
        wait(waitTime.current).then(() => {
            setTargetNote(propNote);
        });
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

interface RunVexFlowCodeArgs {
    context: ReactNativeSVGContext;
    clef: Clef;
    targetNote: Note | null;
    playedNote: Note | null;
    keySignature: KeySignature;
    width: number;
}

function runVexFlowCode({ context, clef, targetNote, playedNote, keySignature, width }: RunVexFlowCodeArgs) {
    const notes = [targetNote, playedNote].filter(Boolean) as Note[];
    const noteNames = notes.map((n) => explodeNote(n).noteName);
    const isSuccess = noteNames.length == 2 ? isNoteMatch(noteNames[0], noteNames[1]) : null;
    if (isSuccess) notes.pop(); // paint 2 notes only if mistake

    const stave = new Stave(0, scoreDims.staveYPos, width);

    stave.setContext(context);
    stave.setClef(clef);
    stave.setKeySignature(keySignature);
    // stave.setTimeSignature("4/4");
    // stave.setNoteStartX(90);
    stave.draw();

    const voices: Voice[] = [];

    notes.forEach((note, idx) => {
        const { drawNote, drawAccident } = getDrawNote(note, keySignature, [note]);

        const voice = new Voice({ num_beats: 4, beat_value: 4 });

        const staveNote = new StaveNote({
            clef,
            keys: [drawNote],
            duration: "w",
            align_center: true,
            glyph_font_scale: 38,
        });

        if (drawAccident) {
            const accidental = new Accidental(drawAccident);
            staveNote.addAccidental(0, accidental);
            // console.log({ accidental });
        }

        voice.addTickables([staveNote]);
        voices.push(voice);
    });

    const formatter = new Formatter();
    formatter.joinVoices(voices).formatToStave(voices, stave);

    voices.forEach((voice, idx) => {
        const staveNoteRef = voice.tickables[0];
        staveNoteRef.setXShift(-20);
        staveNoteRef.modifiers.forEach((mod: any) => mod.setXShift(20));

        if (isSuccess === null) return voice.draw(context, stave);

        if (isSuccess) {
            context.setFillStyle(Colors.dark.green);
        }
        if (!isSuccess && idx == 1) {
            context.setFillStyle(Colors.dark.red);
        }
        voice.draw(context, stave);
    });

    const renderResult = context.render() as ReactNode;
    return renderResult;
}

const styles = StyleSheet.create({
    container: {
        height,
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
        backgroundColor: "transparent",
        // ...testBorder(),
    },
});
