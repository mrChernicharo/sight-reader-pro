import { AppView } from "./AppView";

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

import { AppRegistry, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { AppText } from "./AppText";

/*
durations:
  w, h, q, 8, 16, 32, 64
*/

//   const notes = [
// new StaveNote({ clef, keys, duration: "w", align_center: true }),
// new StaveNote({ clef, keys, duration: "h", stem_direction: -1 }),
// new StaveNote({ clef, keys: ["c/4", "e/4"], duration: "q" }).addAccidental(0, new Accidental("#")).addDotToAll(),
//   ];

function runVexFlowCode2(context: any, clef: "treble" | "bass", keys: string[]) {
  const stave = new Stave(20, 0, 200);
  stave.setContext(context);
  stave.setClef(clef);
  //   stave.setTimeSignature("4/4");
  stave.setNoteStartX(0);
  stave.draw();

  const accidentsInfo = keys
    .map((key, i) => (key.includes("#") || key.includes("b") ? { accident: key[1], idx: i } : null))
    .filter(Boolean);

  const notes = [];
  const staveNote = new StaveNote({ clef, keys, duration: "w", align_center: true });
  if (accidentsInfo.length > 0) {
    accidentsInfo.forEach((accidentInfo) => {
      staveNote.addAccidental(accidentInfo?.idx, new Accidental(accidentInfo?.accident));
    });
  }
  notes.push(staveNote);

  const voice = new Voice({ num_beats: 4, beat_value: 4 });
  voice.addTickables(notes);

  new Formatter().joinVoices([voice]).formatToStave([voice], stave);
  voice.draw(context, stave);
}

export function MusicNote(props: { keys: string[]; clef: "treble" | "bass" }) {
  const { height, width, scale, fontScale } = useWindowDimensions();
  const context = new ReactNativeSVGContext(NotoFontPack, { width, height: 120 });
  runVexFlowCode2(context, props.clef, props.keys);
  const result = context.render();

  return (
    <AppView style={styles.container}>
      <AppView style={styles.sheetMusic}>
        <AppView style={styles.innerView}>{result}</AppView>
      </AppView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    // borderWidth: 2,
    // borderStyle: "dashed",
    backgroundColor: "#F5FCFF",
  },
  sheetMusic: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerView: {
    transform: "translateX(80px)",
  },
});
