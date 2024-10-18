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

import { AppRegistry, StyleSheet, Text, View, useColorScheme, useWindowDimensions } from "react-native";
import { AppText } from "../atoms/AppText";
import { Note } from "@/constants/types";
import { Clef, GameState } from "@/constants/enums";
import { stemDown } from "@/constants/helperFns";
import { Colors } from "@/constants/Colors";

export interface MusicNoteRangeProps {
  keys: [Note, Note][];
  clef: Clef;
}

export function useMusicNoteRange(props: MusicNoteRangeProps) {
  const { height, width, scale, fontScale } = useWindowDimensions();
  const theme = useColorScheme() ?? "light";
  const textColor = Colors[theme].text;

  // console.log(props.keys);
  const renderResult = runVexFlowRangeCode(props.clef, props.keys, textColor);
  return renderResult;
}

export function MusicNoteRange(props: MusicNoteRangeProps) {
  // console.log(":::MusicNoteRange", props);
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

function runVexFlowRangeCode(clef: Clef, keys: [Note, Note][], color: string): React.ReactNode {
  if (keys.length <= 0 || keys.length >= 4) {
    return <></>;
  }
  const width = widthPerRangeCount[keys.length as 1 | 2 | 3];
  const context = new ReactNativeSVGContext(NotoFontPack, { width, height: 280 });

  // console.log("::", { clef, keys });

  context
    .setFont("Arial", 48, "")
    .setBackgroundFillStyle("transparent")
    .setFillStyle(color)
    .setStrokeStyle(color)
    .setLineWidth(2);

  const stave = new Stave(0, 80, width);
  stave.setContext(context);
  stave.setClef(clef);
  // stave.setTimeSignature("6/4");
  stave.draw();

  const notes = [];
  const ties = [];
  const duration = noteDurationsPerRangeCount[keys.length as 1 | 2 | 3];
  const num_beats = numBeatsPerRangeCount[keys.length as 1 | 2 | 3];

  let noteIdx = 0;
  for (const [low, high] of keys) {
    const staveNoteLow = new StaveNote({
      clef,
      keys: [low],
      duration,
      stem_direction: stemDown(low as Note, clef) ? -1 : 1,
    });
    const staveNoteHigh = new StaveNote({
      clef,
      keys: [high],
      duration,
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
  container: {
    height: 280,
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
