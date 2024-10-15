import { WHITE_NOTES } from "@/constants/notes";
import { Pressable, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import { Accident } from "@/constants/types";
const FLAT_NOTES = ["db", "eb", "", "gb", "ab", "bb"];
const SHARP_NOTES = ["c#", "d#", "", "f#", "g#", "a#"];

export function Piano({ accident, onPianoKeyPress }: { accident: Accident; onPianoKeyPress: (note: string) => void }) {
  const { width } = useWindowDimensions();

  const BLACK_NOTES = accident === Accident.B ? FLAT_NOTES : SHARP_NOTES;

  const keyboardMargin = width * 0.06;
  const keyWidth = (width - keyboardMargin * 2) / 7;
  return (
    <AppView style={[s.piano]}>
      {/* TODO: SPLIT BLACK_NOTES IN 2 CHUNKS */}
      <AppView
        style={[
          s.blackNotes,
          {
            width: keyboardMargin * 1.73 + keyWidth * 5,
            left: keyboardMargin + keyWidth / 1.65,
          },
        ]}
      >
        {BLACK_NOTES.map((note) => (
          <AppView
            key={note}
            style={[
              s.blackNote,
              {
                width: keyWidth,
                ...(!note && { height: 0 }),
              },
            ]}
          >
            <Pressable
              style={[s.blackNoteInner]}
              android_ripple={{
                radius: 20,
              }}
              cancelable
              onPress={() => {
                if (!note) return;
                console.log(note, BLACK_NOTES);
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
            android_ripple={{
              radius: 20,
            }}
            cancelable
            onPress={() => {
              onPianoKeyPress(note);
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
    backgroundColor: "transparent",
    zIndex: 10000,
    // borderWidth: 1,
    // borderColor: "#bbb",
    // borderStyle: "dashed",
  },
  blackNote: {
    height: 110,
    backgroundColor: "transparent",
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
