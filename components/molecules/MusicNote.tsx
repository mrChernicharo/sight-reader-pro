import { AppView } from "../atoms/AppView";

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
import { Clef } from "@/constants/types";

export interface MusicNoteProps {
  keys: string[];
  clef: Clef;
  noteColor?: string;
}

export function useMusicNote(props: MusicNoteProps) {
  const { height, width, scale, fontScale } = useWindowDimensions();
  const context = new ReactNativeSVGContext(NotoFontPack, { width, height: 280 });
  const renderResult = runVexFlowCode(context, props.clef, props.keys, props.noteColor);
  return renderResult;
}

export function MusicNote(props: MusicNoteProps) {
  const svgResult = useMusicNote(props);

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

function runVexFlowCode(context: any, clef: Clef, keys: string[], noteColor?: string) {
  const stave = new Stave(20, 80, 200);
  stave.setContext(context);
  stave.setClef(clef);
  //   stave.setTimeSignature("4/4");
  stave.setNoteStartX(0);
  stave.draw();

  const accidentsInfo = keys
    .map((key, i) => {
      const note = key.split("/")[0];
      if (note.length > 1) {
        return { accident: note.charAt(1), idx: i };
      }
      return null;
    })
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

  const renderResult = context.render() as ReactNode;
  return noteColor ? addColorToNoteOutput(renderResult, noteColor) : renderResult;
}

function addColorToNoteOutput(svgStruct: any, color: string) {
  const result = {
    ...svgStruct,
    props: {
      ...svgStruct.props,
      children: svgStruct.props.children.map((ch: any) => {
        if (ch.props.className === "vf-stavenote") {
          return {
            ...ch,
            props: {
              ...ch.props,
              children: ch.props.children.map((ich: any) => ({
                ...ich,
                props: {
                  ...ich.props,
                  children: ich.props.children.map((iich: any) => ({
                    ...iich,
                    props: {
                      ...iich.props,
                      fill: color,
                      stroke: color,
                      children: iich.props.children.map((iiich: any) => ({
                        ...iiich,
                        props: { ...iiich.props, fill: color, stroke: color },
                      })),
                    },
                  })),
                },
              })),
            },
          };
        } else {
          return ch;
        }
      }),
    },
  };

  return result;
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
