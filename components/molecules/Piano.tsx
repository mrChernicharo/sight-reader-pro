import { KeySignature, NoteName } from "@/utils/enums";
import { FLAT_KEY_SIGNATURES } from "@/utils/keySignature";
import { WHITE_NOTES } from "@/utils/notes";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";

const blackNoteNames: Record<"Flat" | "Sharp", NoteName[]> = {
  Flat: ["db", "eb", "", "gb", "ab", "bb"] as NoteName[],
  Sharp: ["c#", "d#", "", "f#", "g#", "a#"] as NoteName[],
};

export function Piano({
  keySignature,
  onPianoKeyPress,
}: {
  keySignature: KeySignature;
  onPianoKeyPress: (note: NoteName) => void;
}) {
  const { width } = useWindowDimensions();

  // const chromaticNotes = scaleTypeNoteSequences[ScaleType.Chromatic][keySignature];
  // const keySigBlackNotes = sortBlackNotes(chromaticNotes.filter((noteName) => noteName.length > 1));
  // const BLACK_NOTES = [...keySigBlackNotes.slice(0, 2), "", ...keySigBlackNotes.slice(2)] as NoteName[];
  const pianoBlackKeySpec = FLAT_KEY_SIGNATURES.includes(keySignature) ? "Flat" : "Sharp";
  const BLACK_NOTES = blackNoteNames[pianoBlackKeySpec];
  const [blackNotesLeft, blackNotesRight] = [BLACK_NOTES.slice(0, 2), BLACK_NOTES.slice(3)];
  //   console.log({ b1, b2 });

  const keyboardMargin = width * 0.06;
  const keyWidth = (width - keyboardMargin * 2) / 7;
  return (
    <AppView style={[s.piano]}>
      {/* TODO: SPLIT BLACK_NOTES IN 2 CHUNKS */}
      <AppView
        style={[
          s.blackNotes,
          {
            width: keyboardMargin + keyWidth * 1.36,
            left: keyboardMargin + keyWidth / 1.65,
          },
        ]}
      >
        {blackNotesLeft.map((note) => (
          <AppView
            key={note}
            style={[
              s.blackNote,
              {
                width: keyWidth,
                ...(!String(note) && { height: 0 }),
              },
            ]}
          >
            <Pressable
              style={[s.blackNoteInner]}
              android_ripple={{ radius: 20 }}
              android_disableSound
              cancelable
              onPress={() => {
                if (!note) return;
                onPianoKeyPress(note);
              }}
            >
              <AppText style={{ color: "white" }}>{note}</AppText>
            </Pressable>
          </AppView>
        ))}
      </AppView>

      <AppView
        style={[
          s.blackNotes,
          {
            width: keyboardMargin + keyWidth * 2.35,
            right: keyboardMargin + keyWidth / 1.75,
          },
        ]}
      >
        {blackNotesRight.map((note) => (
          <AppView
            key={note}
            style={[
              s.blackNote,
              {
                width: keyWidth,
                ...(!String(note) && { height: 0 }),
              },
            ]}
          >
            <Pressable
              style={[s.blackNoteInner]}
              android_ripple={{ radius: 20 }}
              android_disableSound
              cancelable
              onPress={() => {
                if (!note) return;
                onPianoKeyPress(note);
              }}
            >
              <AppText style={{ color: "white" }}>{note}</AppText>
            </Pressable>
          </AppView>
        ))}
      </AppView>

      <AppView style={s.whiteNotes}>
        {WHITE_NOTES.map((note) => (
          <Pressable
            key={note}
            android_ripple={{ radius: 20 }}
            cancelable
            android_disableSound
            onPress={() => {
              onPianoKeyPress(note as NoteName);
            }}
          >
            <AppView style={[s.whiteNote, { width: keyWidth }]}>
              <AppText>{note}</AppText>
            </AppView>
          </Pressable>
        ))}
      </AppView>
    </AppView>
  );
}

const s = StyleSheet.create({
  piano: {
    // borderWidth: 1,
    // borderColor: "#bbb",
    position: "relative",
    paddingBottom: 80,
    marginTop: -20,
  },
  whiteNotes: {
    flexDirection: "row",
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: "#bbb",
    // borderStyle: "dashed",
  },
  whiteNote: {
    borderWidth: 1,
    borderColor: "#bbb",
    height: 160,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  blackNotes: {
    flexDirection: "row",
    position: "absolute",
    top: -10,
    backgroundColor: "rgba(0, 0, 0, 0)",
    zIndex: 10000,
    // borderWidth: 1,
    // borderColor: "#bbb",
    // borderStyle: "dashed",
  },
  blackNote: {
    height: 110,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  blackNoteInner: {
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#333",
    height: "100%",
    width: "80%",
    borderRadius: 6,
    zIndex: 10000,
  },
});

function sortBlackNotes(notes: NoteName[]) {
  if (notes.length !== 5) throw Error("");
  const res: NoteName[] = [];

  let startPushing = false;
  let noteIdx = 0;
  while (res.length < 5) {
    if (notes[noteIdx].startsWith("c")) {
      startPushing = true;
    }

    if (startPushing == true) {
      res.push(notes[noteIdx]);
    }

    if (noteIdx >= 4) noteIdx = 0;
    else noteIdx++;
  }

  return res;
}
