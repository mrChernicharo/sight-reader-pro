import { WHITE_NOTES } from "@/constants/notes";
import { StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import { Accident } from "@/constants/types";
const BEMOL_NOTES = ["db", "eb", "", "gb", "ab", "bb"];
const SHARP_NOTES = ["c#", "d#", "", "f#", "g#", "a#"];

export function Piano({ accident, onPianoKeyPress }: { accident: Accident; onPianoKeyPress: (note: string) => void }) {
  const { width } = useWindowDimensions();

  const BLACK_NOTES = accident === Accident.B ? BEMOL_NOTES : SHARP_NOTES;

  const keyboardMargin = width * 0.2;
  return (
    <AppView style={[s.piano]}>
      <AppView style={s.whiteNotes}>
        {WHITE_NOTES.map((note) => (
          <TouchableOpacity
            key={note}
            onPress={() => {
              onPianoKeyPress(note);
            }}
          >
            <AppView style={[s.whiteNote, { width: (width - keyboardMargin) / 7 }]}>
              <AppText>{note}</AppText>
            </AppView>
          </TouchableOpacity>
        ))}
      </AppView>

      {/* TODO: SPLIT BLACK_NOTES IN 2 CHUNKS */}
      <AppView style={s.blackNotes}>
        {BLACK_NOTES.map((note) => (
          <TouchableOpacity
            key={note}
            activeOpacity={0.7}
            onPress={() => {
              onPianoKeyPress(note);
            }}
          >
            <AppView
              style={[
                s.blackNote,
                {
                  width: (width - keyboardMargin) / 7,
                  ...(!note && { height: 0 }),
                },
              ]}
            >
              <AppView style={[s.blackNoteInner]}>
                <AppText style={{ color: "white" }}>{note}</AppText>
              </AppView>
            </AppView>
          </TouchableOpacity>
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
    paddingTop: 10,
    paddingBottom: 80,
  },
  whiteNotes: {
    flexDirection: "row",
    // borderWidth: 1,
    // borderColor: "#bbb",
    // borderStyle: "dashed",
    justifyContent: "center",
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
    left: 69,
    top: 0,
    backgroundColor: "transparent",
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
  },
});
