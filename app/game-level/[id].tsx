import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { GameStatsDisplay } from "@/components/molecules/GameStatsDisplay";
import { MusicNote } from "@/components/molecules/MusicNote";
import { Piano } from "@/components/molecules/Piano";
import { TimerAndStatsDisplay } from "@/components/molecules/TimeAndStatsDisplay";
import { CountdownTimer } from "@/components/molecules/Timer";
import { Colors } from "@/constants/Colors";
import { Clef, GameState, SoundEffect, GameType } from "@/constants/enums";
import { getGameStats, getRandomNoteInRange, isNoteMatch, randomUID, winScore } from "@/constants/helperFns";
import { getLevel } from "@/constants/levels";
import { GameScore, Note, NoteRange, SingleNoteRound } from "@/constants/types";
import { usePianoSound, useSoundEfx } from "@/hooks/usePianoSound";
import { useAppStore } from "@/hooks/useStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DELAY = 40;

export default function GameLevel() {
  const theme = useColorScheme() ?? "light";
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, "background");
  const { id, clef } = useLocalSearchParams() as { id: string; clef: Clef };
  const { addGame } = useAppStore();
  const { playPianoNote } = usePianoSound();
  const { playSoundEfx } = useSoundEfx();

  const level = getLevel(id);

  // @ts-ignore
  const initialNote = getRandomNoteInRange(level.noteRanges[0] as NoteRange, level.accident as Accident, "");

  const [gameScore, setGameScore] = useState<GameScore>({ successes: 0, mistakes: 0 });
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [currNote, setCurrNote] = useState(initialNote);
  const [rounds, setRounds] = useState<SingleNoteRound[]>([]);

  const { hasWon } = getGameStats(level, gameScore);

  function onPianoKeyPress(attempt: string) {
    if (gameState !== GameState.Idle) return;

    const [note, octave] = currNote.split("/");
    const attemptedNote: Note = `${attempt}/${+octave}`;
    const success = isNoteMatch(attempt, note);
    // console.log({ currNote, attempt, attemptedNote });

    if (success) {
      playPianoNote(attemptedNote);
      setGameScore((prev) => ({ ...prev, successes: prev.successes + 1 }));
      setGameState(GameState.Success);
    } else {
      playSoundEfx(SoundEffect.WrongAnswer);
      playPianoNote(attemptedNote);
      playPianoNote(currNote);
      setGameScore((prev) => ({ ...prev, mistakes: prev.mistakes + 1 }));
      setGameState(GameState.Mistake);
    }

    setRounds((prev) => [...prev, { value: currNote, attempt: attemptedNote }]);

    setTimeout(() => {
      if (level.gameType !== GameType.Single) return;
      if (level.hasKey) return;
      const nextNote = getRandomNoteInRange(level.noteRanges[0], level.accident, currNote);
      setGameState(GameState.Idle);
      setCurrNote(nextNote);
    }, DELAY);
  }

  const onCountdownFinish = useCallback(async () => {
    setGameState(GameState.Idle);

    await addGame({
      id: randomUID(),
      level_id: id,
      rounds,
      timestamp: Date.now(),
      type: GameType.Single,
      durationInSeconds: level.durationInSeconds,
    });

    router.replace({
      pathname: "/game-over/[gameState]",
      params: { gameState: hasWon ? "win" : "lose", levelId: id, clef },
    });
  }, [hasWon, gameState, gameScore.successes, winScore]);

  useEffect(() => {
    console.log("::: game start", level, gameScore, gameState);
  }, []);

  return (
    <SafeAreaView style={[s.container, { backgroundColor }]}>
      <BackLink to="/level-details" style={s.backLink} />

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

      {level.gameType === GameType.Single && !level.hasKey && (
        <Piano accident={level.accident} onPianoKeyPress={onPianoKeyPress} />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 16,
  },
  backLink: {
    left: 16,
    // borderWidth: 1,
    // transform: [{ translateX: 16 }, { translateY: 16 }],
  },
});
