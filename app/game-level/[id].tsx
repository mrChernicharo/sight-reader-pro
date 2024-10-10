import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { GameStatsDisplay } from "@/components/molecules/GameStatsDisplay";
import { MusicNote } from "@/components/molecules/MusicNote";
import { Piano } from "@/components/molecules/Piano";
import { CountdownTimer } from "@/components/molecules/Timer";
import { getGameStats, getLevel, getRandomNoteInRange, isNoteMatch, randomUID, winScore } from "@/constants/helperFns";
import { Accident, Clef, GameNote, NoteRange } from "@/constants/types";
import { useAppStore } from "@/hooks/useStore";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export enum GameState {
  Idle = "idle",
  Success = "success",
  Mistake = "mistake",
}

export interface GameScore {
  successes: number;
  mistakes: number;
}

const delay = 200;

export default function GameLevel() {
  const { id, clef } = useLocalSearchParams() as { id: string; clef: Clef };
  const { addGame } = useAppStore();

  const level = getLevel(clef, id);
  const initialNote = getRandomNoteInRange(level.range as NoteRange, level.accident as Accident, "");

  const [gameScore, setGameScore] = useState<GameScore>({ successes: 0, mistakes: 0 });
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [currNote, setCurrNote] = useState(initialNote);
  const [gameNotes, setGameNotes] = useState<GameNote[]>([]);

  const { hasWon } = getGameStats(gameScore);

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
      const nextNote = getRandomNoteInRange(level.range as NoteRange, level.accident as Accident, currNote);
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
    <SafeAreaView style={s.container}>
      <BackLink to="/level-details" style={s.backLink} />
      <AppView>
        <AppView style={s.countdownContainer}>
          <CountdownTimer seconds={level.durationInSeconds} onCountdownFinish={onCountdownFinish} />
          {/* {hasWon && <Text>you made it 🎉</Text>} */}
          <GameStatsDisplay gameScore={gameScore} />
        </AppView>

        <AppView>
          {gameState === GameState.Idle ? <MusicNote keys={[currNote]} clef={clef} /> : null}

          {gameState === GameState.Success ? (
            <MusicNote keys={[currNote]} clef={clef} noteColor={"mediumseagreen"} />
          ) : null}
          {gameState === GameState.Mistake ? <MusicNote keys={[currNote]} clef={clef} noteColor={"red"} /> : null}
        </AppView>
      </AppView>

      <Piano accident={level.accident} onPianoKeyPress={onPianoKeyPress} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  backLink: {
    transform: [{ translateX: 16 }, { translateY: 16 }],
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 24,
  },
  countdownContainer: {
    padding: 24,
  },
});

/* <ReactNativeVexFlow /> */
/* <MusicNote keys={["f#/4", "a/4", "eb/5"]} clef="treble" /> */
/* <MusicNote keys={["c/5"]} clef="treble" /> */
/* <MusicNote keys={["e/2"]} clef="bass" /> */
