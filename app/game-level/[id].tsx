import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { MusicNote } from "@/components/molecules/MusicNote";
import { Timer } from "@/components/molecules/Timer";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ALL_NOTES_BEMOL_ALL_OCTAVES, ALL_NOTES_SHARP_ALL_OCTAVES, WHITE_NOTES } from "@/constants/notes";
import { getLevel, getRandInRange, isNoteMatch } from "@/constants/helperFns";
import { useState } from "react";
import { NoteRange, Accident, Clef } from "@/constants/types";
import { SECTIONED_LEVELS } from "@/constants/levels";

export enum GameState {
  Idle = "idle",
  Success = "success",
  Mistake = "mistake",
}

export interface GameScore {
  successes: number;
  mistakes: number;
}

const intl = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });
const delay = 260;

const BLACK_NOTES = ["db", "eb", "", "gb", "ab", "bb"];
// const SHARP_NOTES = ["c#", "d#", "f#", "g#", "a#"];
// const BEMOL_NOTES = ["db", "eb", "gb", "ab", "bb"];

let previousRandomNote = "";
export function getRandomNoteInRange(range: NoteRange, accident: Accident) {
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
  const { id, clef } = useLocalSearchParams() as { id: string; clef: Clef };
  const level = getLevel(clef, id);

  const [gameScore, setGameScore] = useState<GameScore>({ successes: 0, mistakes: 0 });
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [currNote, setCurrNote] = useState(() =>
    getRandomNoteInRange(level.range as NoteRange, level.accident as Accident)
  );

  const keyboardMargin = width * 0.2;
  const pianoLocked = gameState !== GameState.Idle;
  const attempts = Object.values(gameScore).reduce((acc, nxt) => acc + nxt);
  const mean = gameScore.successes / attempts;
  const accuracy = isNaN(mean) ? "--" : intl.format(mean * 100) + "%";

  function onPianoKeyPress(userNote: string) {
    const key = currNote.split("/")[0];
    const success = isNoteMatch(userNote, key);
    setGameScore((prev) =>
      success ? { ...prev, successes: prev.successes + 1 } : { ...prev, mistakes: prev.mistakes + 1 }
    );
    setGameState(success ? GameState.Success : GameState.Mistake);

    setTimeout(() => {
      const nextNote = getRandomNoteInRange(level.range as NoteRange, level.accident as Accident);
      setGameState(GameState.Idle);
      setCurrNote(nextNote);
    }, delay);
  }

  return (
    <AppView style={s.container}>
      <AppView>
        <Text>Level {id}</Text>
        <Text>range: {level.range}</Text>
        <Text>accident: {level.accident}</Text>
        <Text>gameState: {gameState}</Text>
        <Text>successes: {gameScore.successes}</Text>
        <Text>mistakes: {gameScore.mistakes}</Text>
        <Text>attempts: {attempts}</Text>
        <Text>accuracy: {accuracy}</Text>

        <Timer />

        {gameState === GameState.Idle ? (
          <MusicNote keys={[currNote]} clef={clef} />
        ) : (
          <MusicNote
            keys={[currNote]}
            clef={clef}
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
