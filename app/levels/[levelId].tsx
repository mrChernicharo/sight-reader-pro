import { AppText } from "@/components/AppText";
import { AppView } from "@/components/AppView";
import { MusicNote } from "@/components/MusicNote";
import { Timer } from "@/components/Timer";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LevelAccident, NoteRange } from "../levels";
import { ALL_NOTES_BEMOL_ALL_OCTAVES, ALL_NOTES_SHARP_ALL_OCTAVES, WHITE_NOTES } from "@/constants/notes";
import { getRandInRange, isNoteMatch } from "@/constants/helperFns";
import { useState } from "react";

export enum GameState {
  Idle = "idle",
  Success = "success",
  Mistake = "mistake",
}

const BLACK_NOTES = ["db", "eb", "", "gb", "ab", "bb"];
// const SHARP_NOTES = ["c#", "d#", "f#", "g#", "a#"];
// const BEMOL_NOTES = ["db", "eb", "gb", "ab", "bb"];

let previousRandomNote = "";
export function getRandomNoteInRange(range: NoteRange, accident: LevelAccident) {
  const notesArr = accident === "b" ? ALL_NOTES_BEMOL_ALL_OCTAVES : ALL_NOTES_SHARP_ALL_OCTAVES;
  const [lowNote, highNote] = range.split(":::");
  const [lowIdx, highIdx] = [notesArr.findIndex((n) => n === lowNote), notesArr.findIndex((n) => n === highNote)];
  const chosenIdx = getRandInRange(lowIdx, highIdx);
  const chosenNote = notesArr[chosenIdx];
  // console.log({ range, lowIdx, highIdx, chosenIdx, chosenNote });
  if (chosenNote === previousRandomNote) return getRandomNoteInRange(range, accident);
  previousRandomNote = chosenNote;
  return chosenNote;
}

export default function Level() {
  const { height, width, scale, fontScale } = useWindowDimensions();
  const keyboardMargin = width * 0.2;
  const { levelId, levelRange, levelAccident } = useLocalSearchParams();

  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [currNote, setCurrNote] = useState(() =>
    getRandomNoteInRange(levelRange as NoteRange, levelAccident as LevelAccident)
  );

  const pianoLocked = gameState !== GameState.Idle;

  function onPianoKeyPress(userNote: string) {
    const key = currNote.split("/")[0];
    const success = isNoteMatch(userNote, key);
    setGameState(success ? GameState.Success : GameState.Mistake);

    setTimeout(() => {
      const nextNote = getRandomNoteInRange(levelRange as NoteRange, levelAccident as LevelAccident);
      setGameState(GameState.Idle);
      setCurrNote(nextNote);
    }, 800);
  }

  // const currNote = getRandomNoteInRange(levelRange as NoteRange, levelAccident as LevelAccident);

  return (
    <AppView style={s.container}>
      <AppView>
        <Text>Level {levelId}</Text>
        <Text>range: {levelRange}</Text>
        <Text>accident: {levelAccident}</Text>
        <Text>gameState: {gameState}</Text>

        <Timer />

        {gameState === GameState.Idle ? (
          <MusicNote keys={[currNote]} clef="treble" />
        ) : (
          <MusicNote
            keys={[currNote]}
            clef="treble"
            noteColor={gameState === GameState.Success ? "mediumseagreen" : "red"}
          />
        )}
      </AppView>

      <AppView style={[s.piano, { ...(pianoLocked && { pointerEvents: "none" }) }]}>
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
                  <AppText style={{ color: "white" }}>{note}</AppText>
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

/* <ReactNativeVexFlow /> */
/* <MusicNote keys={["f#/4", "a/4", "eb/5"]} clef="treble" /> */
/* <MusicNote keys={["c/5"]} clef="treble" /> */
/* <MusicNote keys={["e/2"]} clef="bass" /> */
