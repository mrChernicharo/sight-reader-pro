import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { MusicNote } from "@/components/molecules/MusicNote";
import { CountdownTimer, Timer } from "@/components/molecules/Timer";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ALL_NOTES_BEMOL_ALL_OCTAVES, ALL_NOTES_SHARP_ALL_OCTAVES, WHITE_NOTES } from "@/constants/notes";
import { getLevel, getRandInRange, isNoteMatch } from "@/constants/helperFns";
import { useCallback, useEffect, useState } from "react";
import { NoteRange, Accident, Clef } from "@/constants/types";
import { SECTIONED_LEVELS } from "@/constants/levels";
import { HelloWave } from "@/components/atoms/HelloWave";

export enum GameState {
  Idle = "idle",
  Success = "success",
  Mistake = "mistake",
  Win = "win",
  Lose = "lose",
}

export interface GameScore {
  successes: number;
  mistakes: number;
}

const intl = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });
const delay = 320;
const winScore = 2;
const countdownSeconds = 10;

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

export default function GameLevel() {
  const { height, width, scale, fontScale } = useWindowDimensions();
  const { id, clef } = useLocalSearchParams() as { id: string; clef: Clef };
  const level = getLevel(clef, id);
  const initialNote = getRandomNoteInRange(level.range as NoteRange, level.accident as Accident);

  const [gameScore, setGameScore] = useState<GameScore>({ successes: 0, mistakes: 0 });
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [currNote, setCurrNote] = useState(initialNote);

  const keyboardMargin = width * 0.2;
  const pianoLocked = gameState !== GameState.Idle;
  const attempts = Object.values(gameScore).reduce((acc, nxt) => acc + nxt);
  const mean = gameScore.successes / attempts;
  const accuracy = isNaN(mean) ? "--" : intl.format(mean * 100) + "%";
  const hasWon = gameScore.successes >= winScore;
  const gameOver = [GameState.Win, GameState.Lose].includes(gameState);

  function onPianoKeyPress(userNote: string) {
    if (pianoLocked || gameOver) return;

    const key = currNote.split("/")[0];
    const success = isNoteMatch(userNote, key);
    setGameScore((prev) =>
      success ? { ...prev, successes: prev.successes + 1 } : { ...prev, mistakes: prev.mistakes + 1 }
    );
    setGameState(success ? GameState.Success : GameState.Mistake);

    setTimeout(() => {
      if (gameOver) return;
      const nextNote = getRandomNoteInRange(level.range as NoteRange, level.accident as Accident);
      setGameState(GameState.Idle);
      setCurrNote(nextNote);
    }, delay);
  }

  const onCountdownFinish = useCallback(() => {
    console.log("onCountdownFinish:::", { hasWon, gameState, successes: gameScore.successes, winScore });
    setGameState(hasWon ? GameState.Win : GameState.Lose);
  }, [hasWon, gameState, gameScore.successes, winScore]);

  return (
    <AppView style={s.container}>
      <AppView>
        {/* INFO */}
        <Text>Level {id}</Text>
        <Text>range: {level.range}</Text>
        <Text>accident: {level.accident}</Text>
        <Text>gameState: {gameState}</Text>
        <Text>successes: {gameScore.successes}</Text>
        <Text>mistakes: {gameScore.mistakes}</Text>
        <Text>attempts: {attempts}</Text>
        <Text>accuracy: {accuracy}</Text>

        <CountdownTimer seconds={countdownSeconds} onCountdownFinish={onCountdownFinish} />
        {hasWon && <Text>you made it 🎉</Text>}

        <AppView>
          {gameState === GameState.Idle ? <MusicNote keys={[currNote]} clef={clef} /> : null}

          {gameState === GameState.Success ? (
            <MusicNote keys={[currNote]} clef={clef} noteColor={"mediumseagreen"} />
          ) : null}
          {gameState === GameState.Mistake ? <MusicNote keys={[currNote]} clef={clef} noteColor={"red"} /> : null}

          {gameState === GameState.Win ? (
            <AppView>
              <AppText>Congratulations!</AppText>
              <AppText>🎉</AppText>
            </AppView>
          ) : null}

          {gameState === GameState.Lose ? (
            <AppView>
              <AppText>You Lose</AppText>
              <AppText>😩</AppText>
            </AppView>
          ) : null}
        </AppView>
      </AppView>

      {/* PIANO */}
      <AppView style={[s.piano]}>
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
