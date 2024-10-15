import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { GameStatsDisplay } from "@/components/molecules/GameStatsDisplay";
import { MusicNote } from "@/components/molecules/MusicNote";
import { Piano } from "@/components/molecules/Piano";
import { TimerAndStatsDisplay } from "@/components/molecules/TimeAndStatsDisplay";
import { CountdownTimer } from "@/components/molecules/Timer";
import { Colors } from "@/constants/Colors";
import { getGameStats, getRandomNoteInRange, isNoteMatch, randomUID, winScore } from "@/constants/helperFns";
import { getLevel } from "@/constants/levels";
import { Accident, Clef, GameNote, GameScore, GameState, Note, NoteRange } from "@/constants/types";
import { usePianoSound } from "@/hooks/usePianoSound";
import { useAppStore } from "@/hooks/useStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DELAY = 250;

export default function GameLevel() {
  const theme = useColorScheme() ?? "light";
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, "background");
  const { id, clef } = useLocalSearchParams() as { id: string; clef: Clef };
  const { addGame } = useAppStore();
  const { playSound } = usePianoSound();

  const level = getLevel(id);
  const initialNote = getRandomNoteInRange(level.range as NoteRange, level.accident as Accident, "");

  const [gameScore, setGameScore] = useState<GameScore>({ successes: 0, mistakes: 0 });
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [currNote, setCurrNote] = useState(initialNote);
  const [gameNotes, setGameNotes] = useState<GameNote[]>([]);

  const { hasWon } = getGameStats(level, gameScore);
  const pianoLocked = gameState !== GameState.Idle;

  function onPianoKeyPress(attempt: string) {
    if (pianoLocked) return;
    const [note, octave] = currNote.split("/");
    const attemptedNote: Note = `${attempt}/${+octave}`;
    console.log({ currNote, attempt, attemptedNote });
    playSound(attemptedNote);

    const success = isNoteMatch(attempt, note);

    setGameNotes((prev) => [...prev, { note, attempt }]);

    if (success) {
      setGameScore((prev) => ({ ...prev, successes: prev.successes + 1 }));
      setGameState(GameState.Success);
    } else {
      playSound(currNote);
      setGameScore((prev) => ({ ...prev, mistakes: prev.mistakes + 1 }));
      setGameState(GameState.Mistake);
    }

    setTimeout(() => {
      const nextNote = getRandomNoteInRange(level.range as NoteRange, level.accident as Accident, currNote);
      setGameState(GameState.Idle);
      setCurrNote(nextNote);
    }, DELAY);
  }

  const onCountdownFinish = useCallback(async () => {
    setGameState(GameState.Idle);
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

  useEffect(() => {
    console.log({ currNote });
  }, [currNote]);

  return (
    <SafeAreaView style={[s.container, { backgroundColor }]}>
      <BackLink to="/level-details" style={s.backLink} />

      <AppView>
        <TimerAndStatsDisplay onCountdownFinish={onCountdownFinish} gameScore={gameScore} levelId={id} />

        <AppView>
          {gameState === GameState.Idle ? <MusicNote keys={[currNote]} clef={clef} /> : null}

          {gameState === GameState.Success ? (
            <MusicNote keys={[currNote]} clef={clef} noteColor={Colors[theme].green} />
          ) : null}
          {gameState === GameState.Mistake ? (
            <MusicNote keys={[currNote]} clef={clef} noteColor={Colors[theme].red} />
          ) : null}
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
});

// const test = ["a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"];

// test.forEach((noteStr) => {
//   console.log(":::", { flattened: flattenEventualSharpNote(noteStr), noteStr });
// });

// console.log(":::playNote", note, filepath);

// const source: AVPlaybackSource = {
//   uri: filepath,
// };
// // const { sound, status } = await Audio.Sound.createAsync(source);
// const { sound } = await Audio.Sound.createAsync(require(filepath));
// await sound.playAsync();

// setTimeout(async () => {
//   await sound.stopAsync();
//   await sound.unloadAsync();
// }, 1000);

/* <ReactNativeVexFlow /> */
/* <MusicNote keys={["f#/4", "a/4", "eb/5"]} clef="treble" /> */
/* <MusicNote keys={["c/5"]} clef="treble" /> */
/* <MusicNote keys={["e/2"]} clef="bass" /> */
