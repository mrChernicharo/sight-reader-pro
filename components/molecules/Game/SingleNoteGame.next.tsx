import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useAppStore } from "@/hooks/useAppStore";
import { usePianoSound, useSoundEfx } from "@/hooks/usePianoSound";
import { Colors } from "@/utils/Colors";
import { Clef, GameState, GameType, KeySignature, NoteName, SoundEffect } from "@/utils/enums";
import { explodeNote, getPreviousPage, isNoteMatch, randomUID, wait } from "@/utils/helperFns";
import { getLevel } from "@/utils/levels";
import { decideNextRound, getPossibleNotesInLevel } from "@/utils/noteFns";
import { CurrentGame, GameScreenParams, Note, Round } from "@/utils/types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, useColorScheme } from "react-native";
import { Piano } from "../Piano/Piano";
import { SheetMusic } from "../SheetMusic";
import { TimerAndStatsDisplay } from "../TimeAndStatsDisplay";

const DELAY = 60;

export function SingleNoteGameComponent() {
  const theme = useColorScheme() ?? "light";
  const backgroundColor = Colors[theme].background;
  const { id, keySignature: keySig, previousPage: prevPage } = useLocalSearchParams() as unknown as GameScreenParams;

  const { currentGame, saveGameRecord, startNewGame, endGame, updateRound, addNewRound } = useAppStore();
  const { pianoReady, playPianoNote, releasePianoNote } = usePianoSound();
  const { playSoundEfx } = useSoundEfx();

  const rounds = currentGame?.rounds || [];
  const keySignature = decodeURIComponent(keySig) as KeySignature;
  const level = getLevel(id);
  const possibleNotes = getPossibleNotesInLevel(level, keySignature);
  const previousPage = getPreviousPage(String(prevPage), id);

  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [currNote, setCurrNote] = useState<Note>(
    decideNextRound<Round<GameType.Single>>(level, keySignature, possibleNotes).value
  );

  async function onPianoKeyPress(notename: NoteName) {
    if (gameState !== GameState.Idle) return;
    const { noteName, octave } = explodeNote(currNote);
    const attemptedNote = `${notename}/${+octave}` as Note;
    const success = isNoteMatch(notename, noteName);

    // console.log({ notename, currNote, attemptedNote, success });

    if (success) {
      playPianoNote(attemptedNote);
      setGameState(GameState.Success);
    } else {
      playSoundEfx(SoundEffect.WrongAnswer);
      playPianoNote(attemptedNote);
      playPianoNote(currNote);
      setGameState(GameState.Mistake);
    }

    await wait(DELAY);

    if (!currentGame || currentGame.type !== GameType.Single) return;

    addNewRound({ value: currNote, attempt: attemptedNote });

    const { value: nextNote } = decideNextRound<Round<GameType.Single>>(level, keySignature, possibleNotes, {
      value: currNote,
      attempt: attemptedNote,
    })!;

    if (nextNote) setCurrNote(nextNote);

    setGameState(GameState.Idle);
  }

  function onPianoKeyReleased(notename: NoteName) {}

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

  const onBackLinkPress = () => {
    endGame(String(prevPage));
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

  if (currentGame?.type !== GameType.Single) return null;

  const noteProps = { keys: [currNote], clef: level.clef, keySignature };

  return (
    <SafeAreaView style={[s.container, { backgroundColor }]}>
      <AppView style={s.top}>
        <TimerAndStatsDisplay onCountdownFinish={onCountdownFinish} levelId={id} />
        <BackLink to={previousPage} style={s.backLink} onPress={onBackLinkPress} />
      </AppView>

      {currNote && <SingleNoteGameStage gameState={gameState} noteProps={noteProps} />}

      <Piano keySignature={keySignature} onKeyPressed={onPianoKeyPress} onKeyReleased={onPianoKeyReleased} />
    </SafeAreaView>
  );
}

function SingleNoteGameStage({
  gameState,
  noteProps,
}: {
  gameState: GameState;
  noteProps: {
    keys: Note[];
    clef: Clef;
    keySignature: KeySignature;
  };
}) {
  const theme = useColorScheme() ?? "light";
  //   const backgroundColor = Colors[theme].background;
  return (
    <>
      {gameState === GameState.Idle ? <SheetMusic.SingleNote {...noteProps} /> : null}

      {gameState === GameState.Success ? (
        <SheetMusic.SingleNote {...noteProps} noteColor={Colors[theme].green} />
      ) : null}
      {gameState === GameState.Mistake ? <SheetMusic.SingleNote {...noteProps} noteColor={Colors[theme].red} /> : null}
    </>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    position: "relative",
    paddingTop: 8,
    // borderWidth: 1,
    // borderColor: "blue",
  },
  top: {
    position: "relative",
    height: 130,
    // borderWidth: 1,
    // borderColor: "green",
  },
  backLink: {
    position: "absolute",
    top: -120,
    left: 0,
    zIndex: 20,
    // borderWidth: 1,
    // borderColor: "red",
  },
});
