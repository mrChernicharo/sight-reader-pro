import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { MusicNote } from "@/components/molecules/MusicNote";
import { CountdownTimer, Timer } from "@/components/molecules/Timer";
import { useLocalSearchParams, router, Href } from "expo-router";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ALL_NOTES_BEMOL_ALL_OCTAVES, ALL_NOTES_SHARP_ALL_OCTAVES, WHITE_NOTES } from "@/constants/notes";
import { getLevel, getRandInRange, isNoteMatch, randomUID } from "@/constants/helperFns";
import { useCallback, useEffect, useState } from "react";
import { NoteRange, Accident, Clef, GameNote } from "@/constants/types";
import { SECTIONED_LEVELS } from "@/constants/levels";
import { HelloWave } from "@/components/atoms/HelloWave";
import { Piano } from "@/components/molecules/Piano";
import { useAppStore } from "@/hooks/useStore";

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
const delay = 200;
const winScore = 5;

let previousRandomNote = "";
export function getRandomNoteInRange(range: NoteRange, accident: Accident) {
  const notesArr = accident === "b" ? ALL_NOTES_BEMOL_ALL_OCTAVES : ALL_NOTES_SHARP_ALL_OCTAVES;
  const [lowNote, highNote] = range.split(":::");
  const [lowIdx, highIdx] = [notesArr.findIndex((n) => n === lowNote), notesArr.findIndex((n) => n === highNote)];
  const chosenIdx = getRandInRange(lowIdx, highIdx);
  const chosenNote = notesArr[chosenIdx];
  // console.log({ range, lowIdx, highIdx, chosenIdx, chosenNote });
  if (chosenNote === previousRandomNote) return getRandomNoteInRange(range, accident); // recurse if same note as before
  previousRandomNote = chosenNote;
  return chosenNote;
}

export default function GameLevel() {
  const { id, clef } = useLocalSearchParams() as { id: string; clef: Clef };
  const { addGame } = useAppStore();

  const level = getLevel(clef, id);
  const initialNote = getRandomNoteInRange(level.range as NoteRange, level.accident as Accident);

  const [gameScore, setGameScore] = useState<GameScore>({ successes: 0, mistakes: 0 });
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [currNote, setCurrNote] = useState(initialNote);
  const [gameNotes, setGameNotes] = useState<GameNote[]>([]);

  const { accuracy, attempts, hasWon } = getGameStats(gameScore);

  const pianoLocked = gameState !== GameState.Idle;

  function onPianoKeyPress(attempt: string) {
    if (pianoLocked) return;

    const note = currNote.split("/")[0];
    const success = isNoteMatch(attempt, note);

    setGameNotes((prev) => [...prev, { note, attempt }]);

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

  const onCountdownFinish = useCallback(async () => {
    // console.log("onCountdownFinish:::", { hasWon, gameState, successes: gameScore.successes, winScore });
    const finalState = hasWon ? "win" : "lose";

    await addGame({
      level_id: id,
      notes: gameNotes,
      timestamp: Date.now(),
      id: randomUID(),
      durationInSeconds: level.durationInSeconds,
    });

    router.navigate({
      pathname: "/game-over/[gameState]",
      params: { gameState: finalState, levelId: id, clef },
    });
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

        <AppView style={s.countdownContainer}>
          <CountdownTimer seconds={level.durationInSeconds} onCountdownFinish={onCountdownFinish} />
          {hasWon && <Text>you made it 🎉</Text>}
        </AppView>

        <AppView>
          {gameState === GameState.Idle ? <MusicNote keys={[currNote]} clef={clef} /> : null}

          {gameState === GameState.Success ? (
            <MusicNote keys={[currNote]} clef={clef} noteColor={"mediumseagreen"} />
          ) : null}
          {gameState === GameState.Mistake ? <MusicNote keys={[currNote]} clef={clef} noteColor={"red"} /> : null}
        </AppView>
      </AppView>

      {/* PIANO */}
      <Piano accident={level.accident} onPianoKeyPress={onPianoKeyPress} />
    </AppView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  countdownContainer: { flexDirection: "row", justifyContent: "space-between" },
});

function getGameStats(gameScore: GameScore) {
  const attempts = Object.values(gameScore).reduce((acc, nxt) => acc + nxt);
  const mean = gameScore.successes / attempts;
  const accuracy = isNaN(mean) ? "--" : intl.format(mean * 100) + "%";
  const hasWon = gameScore.successes >= winScore;
  return { attempts, accuracy, hasWon };
}

/* <ReactNativeVexFlow /> */
/* <MusicNote keys={["f#/4", "a/4", "eb/5"]} clef="treble" /> */
/* <MusicNote keys={["c/5"]} clef="treble" /> */
/* <MusicNote keys={["e/2"]} clef="bass" /> */
