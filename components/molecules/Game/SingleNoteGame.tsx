import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { Colors } from "@/constants/Colors";
import { Clef, GameState, SoundEffect, GameType } from "@/constants/enums";
import { getGameStats, isNoteMatch, randomUID, winScore } from "@/constants/helperFns";
import { getLevel } from "@/constants/levels";
import { GameScore, SingleNoteRound, Note } from "@/constants/types";
import { usePianoSound, useSoundEfx } from "@/hooks/usePianoSound";
import { useAppStore } from "@/hooks/useStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import { useColorScheme, SafeAreaView, StyleSheet } from "react-native";
import { Piano } from "../Piano";
import { SheetMusic } from "../SheetMusic";
import { TimerAndStatsDisplay } from "../TimeAndStatsDisplay";
import { decideNextRound } from "@/constants/brain-storming";

const DELAY = 60;

export function SingleNoteGameComponent() {
  const theme = useColorScheme() ?? "light";
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, "background");
  const { id } = useLocalSearchParams() as { id: string };
  const { addGame } = useAppStore();
  const { playPianoNote } = usePianoSound();
  const { playSoundEfx } = useSoundEfx();

  const level = getLevel(id);

  const initialRound = decideNextRound<SingleNoteRound>(level)!;
  const { value: initialNote } = initialRound;

  const [gameScore, setGameScore] = useState<GameScore>({ successes: 0, mistakes: 0 });
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [currNote, setCurrNote] = useState<Note>(initialNote);
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
      const { value: nextNote } = decideNextRound<SingleNoteRound>(level, { value: currNote, attempt: attemptedNote })!;
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
      params: { gameState: hasWon ? "win" : "lose", levelId: id, clef: level.clef },
    });
  }, [hasWon, gameState, gameScore.successes, winScore]);

  useEffect(() => {
    console.log("::: useEffect", level, gameScore, gameState, currNote);
  }, [level, gameScore, gameState, currNote]);

  return (
    <SafeAreaView style={[s.container, { backgroundColor }]}>
      <BackLink to="/level-details" style={s.backLink} />

      <TimerAndStatsDisplay onCountdownFinish={onCountdownFinish} gameScore={gameScore} levelId={id} />

      <AppView>
        {gameState === GameState.Idle ? <SheetMusic.SingleNote keys={[currNote]} clef={level.clef} /> : null}

        {gameState === GameState.Success ? (
          <SheetMusic.SingleNote keys={[currNote]} clef={level.clef} noteColor={Colors[theme].green} />
        ) : null}
        {gameState === GameState.Mistake ? (
          <SheetMusic.SingleNote keys={[currNote]} clef={level.clef} noteColor={Colors[theme].red} />
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
