import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { Colors } from "@/constants/Colors";
import { decideNextRound } from "@/constants/brain-storming";
import { Accident, GameState, GameType, KeySignature, SoundEffect } from "@/constants/enums";
import { getGameStats, isNoteMatch, randomUID, winScore } from "@/constants/helperFns";
import { getLevel } from "@/constants/levels";
import { FLAT_KEY_SIGNATURES } from "@/constants/notes";
import { GameScore, Level, Note, PianoKeySpec, SingleNoteRound } from "@/constants/types";
import { useAppStore } from "@/hooks/useAppStore";
import { usePianoSound, useSoundEfx } from "@/hooks/usePianoSound";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, useColorScheme } from "react-native";
import { Piano } from "../Piano";
import { SheetMusic } from "../SheetMusic";
import { TimerAndStatsDisplay } from "../TimeAndStatsDisplay";

const DELAY = 60;

export function SingleNoteGameComponent() {
  const theme = useColorScheme() ?? "light";

  const { addGame } = useAppStore();
  const { playPianoNote } = usePianoSound();
  const { playSoundEfx } = useSoundEfx();

  let { id, keySignature } = useLocalSearchParams() as { id: string; keySignature: KeySignature };
  keySignature = decodeURIComponent(keySignature) as KeySignature;
  // console.log("<<<< keySignature >>>>", keySignature);
  const level = getLevel(id);

  const [gameScore, setGameScore] = useState<GameScore>({ successes: 0, mistakes: 0 });
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [currNote, setCurrNote] = useState<Note>(decideNextRound<SingleNoteRound>(level, keySignature).value);
  const [rounds, setRounds] = useState<SingleNoteRound[]>([]);

  const { hasWon } = getGameStats(level, gameScore);
  const pianoBlackKeySpec = FLAT_KEY_SIGNATURES.includes(keySignature) ? "Flat" : "Sharp";

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
      const { value: nextNote } = decideNextRound<SingleNoteRound>(level, keySignature, {
        value: currNote,
        attempt: attemptedNote,
      })!;
      if (nextNote) setCurrNote(nextNote);
      setGameState(GameState.Idle);
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
      params: { gameState: hasWon ? "win" : "lose", levelId: id, clef: level.clef, keySignature },
    });
  }, [hasWon, gameState, gameScore.successes, winScore]);

  // useEffect(() => {
  //   console.log(":::SingleNoteGameComponent -> useEffect", {
  //     level,
  //     gameScore,
  //     gameState,
  //     currNote,
  //     keySignature,
  //     pianoBlackKeySpec,
  //   });
  // }, [level, gameScore, gameState, currNote, keySignature, pianoBlackKeySpec]);

  if (level.gameType !== GameType.Single) return <AppText>[ERROR]: Wrong GameType</AppText>;

  return (
    <SafeAreaView style={[s.container, { backgroundColor: Colors[theme].background }]}>
      <BackLink to="/level-details" style={s.backLink} />

      <TimerAndStatsDisplay onCountdownFinish={onCountdownFinish} gameScore={gameScore} levelId={id} />

      {currNote && (
        <AppView>
          {gameState === GameState.Idle ? <SheetMusic.SingleNote keys={[currNote]} clef={level.clef} /> : null}

          {gameState === GameState.Success ? (
            <SheetMusic.SingleNote keys={[currNote]} clef={level.clef} noteColor={Colors[theme].green} />
          ) : null}
          {gameState === GameState.Mistake ? (
            <SheetMusic.SingleNote keys={[currNote]} clef={level.clef} noteColor={Colors[theme].red} />
          ) : null}
        </AppView>
      )}

      <Piano keySpec={pianoBlackKeySpec} onPianoKeyPress={onPianoKeyPress} />
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
