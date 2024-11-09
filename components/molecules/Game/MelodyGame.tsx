import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { Colors } from "@/utils/Colors";
import { KeySignature, GameState, GameType, NoteName, SoundEffect } from "@/utils/enums";
import { isNoteMatch, randomUID } from "@/utils/helperFns";
import { ALL_LEVELS, getLevel } from "@/utils/levels";
import { CurrentGame, GameScreenParams, MelodyRound, Note, Round } from "@/utils/types";
import { useAppStore } from "@/hooks/useAppStore";
import { usePianoSound, useSoundEfx } from "@/hooks/usePianoSound";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, useColorScheme } from "react-native";
import { TimerAndStatsDisplay } from "../TimeAndStatsDisplay";
import { Piano } from "../Piano";
import { explodeNote, decideNextRound, getPossibleNotesInLevel } from "@/utils/noteFns";
import { SheetMusic } from "../SheetMusic";

export function MelodyGameComponent() {
  const theme = useColorScheme() ?? "light";

  const { id, keySignature: ksig, previousPage } = useLocalSearchParams() as unknown as GameScreenParams;
  const { currentGame, saveGameRecord, startNewGame, endGame, setGameState, updateRound, addNewRound } = useAppStore();
  const { playPianoNote } = usePianoSound();
  const { playSoundEfx } = useSoundEfx();

  const rounds = currentGame?.rounds || [];
  const currRound = rounds.at(-1) as MelodyRound;
  const keySignature = decodeURIComponent(ksig) as KeySignature;

  const level = getLevel(id);
  const possibleNotes = getPossibleNotesInLevel(level, keySignature);

  const [melodyIdx, setMelodyIdx] = useState(0);

  const noteProps = {
    keys: currRound?.values || [],
    durations: currRound?.durations || [],
    clef: level.clef,
    keySignature,
    timeSignature: (level as any).timeSignature,
    roundResults: (currRound?.attempts ?? []).reduce((acc: (0 | 1)[], attempt, i) => {
      if (isNoteMatch(attempt.split("/")[0] as NoteName, currRound.values[i].split("/")[0] as NoteName)) {
        acc.push(1);
      } else {
        acc.push(0);
      }
      return acc;
    }, []),
  };

  function onPianoKeyPress(attempt: NoteName) {
    const currNote = currRound.values[melodyIdx];
    const { noteName, octave } = explodeNote(currNote);
    const success = isNoteMatch(attempt, noteName);
    const attemptedNote = `${attempt}/${+octave}` as Note;

    const isLastNote = melodyIdx === currRound.values.length - 1;
    const attempts = [...currRound.attempts, attemptedNote];

    updateRound({ attempts });

    if (isLastNote) {
      setMelodyIdx(0);
      addNewRound(decideNextRound<Round<GameType.Melody>>(level, keySignature, possibleNotes));
    } else {
      setMelodyIdx((prev) => prev + 1);
    }

    if (success) {
      playPianoNote(attemptedNote);
    } else {
      playSoundEfx(SoundEffect.WrongAnswer);
      playPianoNote(attemptedNote);
      playPianoNote(currNote);
    }
  }

  const onCountdownFinish = useCallback(async () => {
    await saveGameRecord({
      id: randomUID(),
      levelId: id,
      rounds,
      timestamp: Date.now(),
      type: GameType.Melody,
      durationInSeconds: level.durationInSeconds,
    });

    router.replace({
      pathname: "/game-over",
    });
  }, [level, id, rounds]);

  const onBackLinkClick = () => {
    // console.log(">>> onBackLinkClick");
    if (previousPage === "/practice") {
      ALL_LEVELS.pop();
    }
    endGame();
  };

  // useEffect(() => {
  //   console.log("::: currentGame :::", { currentGame, currRound, noteProps });
  // }, [currentGame, currRound, noteProps]);

  useEffect(() => {
    const gameInfo: Partial<CurrentGame<GameType.Melody>> = {
      levelId: id,
      timestamp: Date.now(),
      type: GameType.Melody,
      rounds: [decideNextRound<Round<GameType.Melody>>(level, keySignature, possibleNotes)],
      state: GameState.Idle,
    };
    // console.log("START NEW MELODY GAME", { level, keySignature, possibleNotes });
    startNewGame({ ...level, ...gameInfo } as CurrentGame<GameType.Melody>);
  }, [id]);

  return (
    <SafeAreaView style={[s.container, { backgroundColor: Colors[theme].background }]}>
      <BackLink to={previousPage} style={s.backLink} onPress={onBackLinkClick} />

      <TimerAndStatsDisplay onCountdownFinish={onCountdownFinish} levelId={id} />

      {currRound?.values ? (
        <AppView>
          <SheetMusic.Melody {...noteProps} />
        </AppView>
      ) : null}

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
