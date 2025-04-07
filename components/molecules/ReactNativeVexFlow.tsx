import React, { Component } from "react";
// @ts-ignore
import { Accidental } from "vexflow/src/accidental";
// @ts-ignore
import { Stave } from "vexflow/src/stave";
// @ts-ignore
import { Stem } from "vexflow/src/stem";
// @ts-ignore
import { StaveNote } from "vexflow/src/stavenote";
// @ts-ignore
import { Voice } from "vexflow/src/voice";
// @ts-ignore
import { Formatter } from "vexflow/src/formatter";
// @ts-ignore
import { ReactNativeSVGContext, NotoFontPack } from "standalone-vexflow-context";

import { AppRegistry, StyleSheet, Text, View } from "react-native";

/*
durations:
  w, h, q, 8, 16, 32, 64
*/

function runVexFlowCode(context: any) {
    const stave = new Stave(100, 150, 200);
    stave.setContext(context);
    stave.setClef("treble");
    stave.setTimeSignature("4/4");
    stave.setText("VexFlow on React Native!", 3);
    stave.draw();

    const notes = [
        new StaveNote({ clef: "treble", keys: ["c/4", "e/4"], duration: "q" })
            .addAccidental(0, new Accidental("#"))
            .addDotToAll(),
        new StaveNote({ clef: "treble", keys: ["d/5"], duration: "q", stem_direction: -1 }),
        new StaveNote({ clef: "treble", keys: ["b/4"], duration: "qr" }),
        new StaveNote({ clef: "treble", keys: ["c/4", "e/4", "g/4"], duration: "q" }),
    ];

    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    new Formatter().joinVoices([voice]).formatToStave([voice], stave);

    voice.draw(context, stave);
}

export default function ReactNativeVexFlow() {
    const context = new ReactNativeSVGContext(NotoFontPack, { width: 400, height: 400 });
    runVexFlowCode(context);
    const result = context.render();

    return <View style={styles.container}>{result}</View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 64,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#F5FCFF",
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    },
});
