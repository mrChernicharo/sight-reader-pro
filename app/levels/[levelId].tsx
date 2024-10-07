import { AppText } from "@/components/AppText";
import { AppView } from "@/components/AppView";
import { MusicNote } from "@/components/MusicNote";
import ReactNativeVexFlow from "@/components/ReactNativeVexFlow";
import { Timer } from "@/components/Timer";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const WHITE_NOTES = ["c", "d", "e", "f", "g", "a", "b"];
const BLACK_NOTES = ["db", "eb", "", "gb", "ab", "bb"];
// const SHARP_NOTES = ["c#", "d#", "f#", "g#", "a#"];
// const BEMOL_NOTES = ["db", "eb", "gb", "ab", "bb"];

export function getRandomNoteInRange() {}

export default function Level() {
  const { height, width, scale, fontScale } = useWindowDimensions();
  const keyboardMargin = width * 0.2;
  const { levelId, levelRange, levelAccidents } = useLocalSearchParams();
  const key = "c";
  const octave = 5;
  const selectedNote = `${key}/${octave}`;

  function onPianoKeyPress(note: string) {
    const key = selectedNote.split("/")[0];
    const success = note === key;
    console.log({ note, selectedNote, key, success });
  }

  return (
    <AppView style={s.container}>
      <AppView>
        <Text>Level {levelId}</Text>
        <Text>range: {levelRange}</Text>
        <Text>accidents: {levelAccidents}</Text>

        <Timer />

        {/* <ReactNativeVexFlow /> */}
        <MusicNote keys={["f#/4", "a/4", "eb/5"]} clef="treble" />
        {/* <MusicNote keys={["c/5"]} clef="treble" /> */}
        {/* <MusicNote keys={["e/2"]} clef="bass" /> */}
      </AppView>

      <AppView style={s.piano}>
        <AppView style={s.whiteNotes}>
          {WHITE_NOTES.map((note) => (
            <TouchableOpacity key={note} onPress={() => onPianoKeyPress(note)}>
              <AppView style={[s.whiteNote, { width: (width - keyboardMargin) / 7 }]}>
                <AppText>{note}</AppText>
              </AppView>
            </TouchableOpacity>
          ))}
        </AppView>

        {/* TODO: SPLIT BLACK_NOTES IN 2 CHUNKS */}
        <AppView style={s.blackNotes}>
          {BLACK_NOTES.map((note) => (
            <TouchableOpacity key={note} activeOpacity={0.7} onPress={() => onPianoKeyPress(note)}>
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
                  <AppText>{note}</AppText>
                </AppView>
              </AppView>
            </TouchableOpacity>
          ))}
        </AppView>
      </AppView>
    </AppView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  piano: {
    // borderWidth: 1,
    // borderColor: "#bbb",
    position: "relative",
    paddingTop: 10,
    paddingBottom: 100,
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
