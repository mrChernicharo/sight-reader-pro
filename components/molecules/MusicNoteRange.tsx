import { AppView } from "../atoms/AppView";

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
import { Voice } from "vexflow/src/voice";
// @ts-ignore
import { Formatter } from "vexflow/src/formatter";
// @ts-ignore
import { ReactNativeSVGContext, NotoFontPack } from "standalone-vexflow-context";

import { AppRegistry, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { AppText } from "../atoms/AppText";
import { Clef, Note } from "@/constants/types";
import { stemDown } from "@/constants/helperFns";

export interface MusicNoteRangeProps {
  keys: string[];
  clef: Clef;
  noteColor?: string;
}

export function useMusicNoteRange(props: MusicNoteRangeProps) {
  const { height, width, scale, fontScale } = useWindowDimensions();
  const context = new ReactNativeSVGContext(NotoFontPack, { width, height: 280 });
  // console.log(props.keys);
  const renderResult = runVexFlowRangeCode(context, props.clef, props.keys, props.noteColor);
  return renderResult;
}

export function MusicNoteRange(props: MusicNoteRangeProps) {
  const svgResult = useMusicNoteRange(props);

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

function runVexFlowRangeCode(context: any, clef: Clef, keys: string[], noteColor?: string) {
  const stave = new Stave(20, 80, 200);
  stave.setContext(context);
  stave.setClef(clef);
  // stave.setText("Note range", 3);
  //   stave.setTimeSignature("4/4");
  //   stave.setNoteStartX(80);
  stave.draw();

  const notes = [];
  const [low, high] = [keys[0], keys[1]];
  const staveNoteLow = new StaveNote({
    clef,
    keys: [low],
    duration: "h",
    stem_direction: stemDown(low as Note, clef) ? -1 : 1,
  });
  const staveNoteHigh = new StaveNote({
    clef,
    keys: [high],
    duration: "h",
    stem_direction: stemDown(high as Note, clef) ? -1 : 1,
  });
  const lowNote = low.split("/")[0];
  if (lowNote.length > 1) {
    const accident = lowNote[1];
    staveNoteLow.addAccidental(0, new Accidental(accident));
  }
  const highNote = high.split("/")[0];
  if (highNote.length > 1) {
    const accident = highNote[1];
    staveNoteHigh.addAccidental(0, new Accidental(accident));
  }

  notes.push(staveNoteLow, staveNoteHigh);

  const voice = new Voice({ num_beats: 4, beat_value: 4 });
  voice.addTickables(notes);

  new Formatter().joinVoices([voice]).formatToStave([voice], stave);
  voice.draw(context, stave);

  //   const renderResult = context.render() as ReactNode;
  //   return noteColor ? addColorToNoteOutput(renderResult, noteColor) : renderResult;
  const renderResult = context.render() as ReactNode;
  return renderResult;
}

const styles = StyleSheet.create({
  container: {
    height: 280,
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
