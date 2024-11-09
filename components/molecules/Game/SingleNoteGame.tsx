import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { Colors } from "@/constants/Colors";
import { GameState, GameType, KeySignature, NoteName, SoundEffect } from "@/constants/enums";
import { getGameStats, isNoteMatch, randomUID } from "@/constants/helperFns";
import { ALL_LEVELS, getLevel } from "@/constants/levels";
import { decideNextRound, explodeNote, getPossibleNotesInLevel } from "@/constants/noteFns";
import { CurrentGame, GameScreenParams, Note, Round } from "@/constants/types";
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
  const { id, keySignature: ksig, previousPage } = useLocalSearchParams() as unknown as GameScreenParams;

  const { currentGame, saveGameRecord, startNewGame, endGame, setGameState, updateRound, addNewRound } = useAppStore();
  const { playPianoNote } = usePianoSound();
  const { playSoundEfx } = useSoundEfx();

  const gameState = currentGame?.state;
  const rounds = currentGame?.rounds || [];
  const keySignature = decodeURIComponent(ksig) as KeySignature;
  const level = getLevel(id);

  const possibleNotes = getPossibleNotesInLevel(level, keySignature);

  const [currNote, setCurrNote] = useState<Note>(
    decideNextRound<Round<GameType.Single>>(level, keySignature, possibleNotes).value
  );

  function onPianoKeyPress(attempt: NoteName) {
    if (gameState !== GameState.Idle) return;

    const { noteName, octave } = explodeNote(currNote);
    const attemptedNote = `${attempt}/${+octave}` as Note;
    const success = isNoteMatch(attempt, noteName);
    // console.log({ currNote, attempt, attemptedNote, success });

    if (success) {
      playPianoNote(attemptedNote);
      setGameState(GameState.Success);
    } else {
      playSoundEfx(SoundEffect.WrongAnswer);
      playPianoNote(attemptedNote);
      playPianoNote(currNote);
      setGameState(GameState.Mistake);
    }

    setTimeout(() => {
      if (!currentGame || currentGame.type !== GameType.Single) return;

      addNewRound({ value: currNote, attempt: attemptedNote });

      const { value: nextNote } = decideNextRound<Round<GameType.Single>>(level, keySignature, possibleNotes, {
        value: currNote,
        attempt: attemptedNote,
      })!;

      if (nextNote) setCurrNote(nextNote);

      setGameState(GameState.Idle);
    }, DELAY);
  }

  const onCountdownFinish = useCallback(async () => {
    setGameState(GameState.Idle);

    await saveGameRecord({
      id: randomUID(),
      levelId: id,
      rounds,
      timestamp: Date.now(),
      type: GameType.Single,
      durationInSeconds: level.durationInSeconds,
    });

    router.replace({
      pathname: "/game-over",
    });
  }, [level, id, rounds]);

  const onBackLinkClick = () => {
    // console.log(">>> onBackLinkClick");
    if (previousPage === "/practice-settings") {
      ALL_LEVELS.pop();
    }
    endGame();
  };

  useEffect(() => {
    const gameInfo: Partial<CurrentGame<GameType.Single>> = {
      levelId: id,
      timestamp: Date.now(),
      type: GameType.Single,
      rounds: [
        { value: decideNextRound<Round<GameType.Single>>(level, keySignature, possibleNotes).value, attempt: null },
      ],
      state: GameState.Idle,
    };

    startNewGame({ ...level, ...gameInfo } as CurrentGame<GameType.Single>);
  }, []);

  // useEffect(() => {
  //   // console.log("currentGame:::", currentGame);
  // }, [currentGame]);

  if (currentGame?.type !== GameType.Single) return <AppText>[ERROR]: Wrong GameType</AppText>;

  const noteProps = { keys: [currNote], clef: level.clef, keySignature };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: Colors[theme].background }]}>
      <BackLink to={previousPage} style={s.backLink} onPress={onBackLinkClick} />

      <TimerAndStatsDisplay onCountdownFinish={onCountdownFinish} levelId={id} />

      {currNote && (
        <AppView>
          {gameState === GameState.Idle ? <SheetMusic.SingleNote {...noteProps} /> : null}

          {gameState === GameState.Success ? (
            <SheetMusic.SingleNote {...noteProps} noteColor={Colors[theme].green} />
          ) : null}
          {gameState === GameState.Mistake ? (
            <SheetMusic.SingleNote {...noteProps} noteColor={Colors[theme].red} />
          ) : null}
        </AppView>
      )}

      <Piano keySignature={keySignature} onPianoKeyPress={onPianoKeyPress} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 36,
  },
  backLink: {
    left: 16,
    // borderWidth: 1,
    // transform: [{ translateX: 16 }, { translateY: 16 }],
  },
});
