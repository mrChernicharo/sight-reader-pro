import { eventEmitter } from "@/app/_layout";
import { AppView } from "@/components/atoms/AppView";
import { useAllLevels } from "@/hooks/useAllLevels";
import { useAppStore } from "@/hooks/useAppStore";
import { useSoundContext } from "@/hooks/useSoundsContext";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import { AppEvents, GameState, GameType, KeySignature, NoteName, SoundEffect } from "@/utils/enums";
import {
    explodeNote,
    getLevelHintCount,
    getPossibleNotesInLevel,
    isNoteMatch,
    randomUID,
    wait,
} from "@/utils/helperFns";
import { decideNextRound } from "@/utils/noteFns";
import { ScoreManager } from "@/utils/ScoreManager";
import { STYLES } from "@/utils/styles";
import { CurrentGame, GameScreenParams, MelodyRound, Note, Round } from "@/utils/types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AttemptedNotes } from "../AttemptedNotes";
import { Piano } from "../Piano/Piano";
import { SheetMusic } from "../SheetMusic";
import { TimerAndStatsDisplay } from "../TimeAndStatsDisplay";

const s = STYLES.game;

export function useMelody() {
    const { id, keySignature: kSign } = useLocalSearchParams() as unknown as GameScreenParams;

    const { getLevel } = useAllLevels();
    const { playPianoNote, playSoundEfx } = useSoundContext();
    const { currentGame, saveGameRecord, startNewGame, updateRound, addNewRound } = useAppStore();

    const rounds = currentGame?.rounds || [];
    const currRound = rounds.at(-1) as MelodyRound;
    const keySignature = decodeURIComponent(kSign) as KeySignature;

    const level = getLevel(id)!;
    const possibleNotes = getPossibleNotesInLevel(level);
    const hintCount = getLevelHintCount(level.skillLevel);
    // const isPracticeLevel = getIsPracticeLevel(level.id);

    const [roundResults, setRoundResults] = useState<(0 | 1)[]>([]);
    const [gameFinished, setGameFinished] = useState(false);

    const melodyIdx = roundResults.length;
    const isLastNote = currRound?.values ? melodyIdx >= currRound.values.length - 1 : false;
    const currNote = currRound?.values?.[melodyIdx] || "c/4";

    const onPianoKeyPress = useCallback(
        async (attempt: NoteName) => {
            const { noteName, octave } = explodeNote(currNote);
            const isSuccess = isNoteMatch(attempt, noteName);
            const playedNote = `${attempt}/${+octave}` as Note;
            const { currNoteValue } = ScoreManager.push(isSuccess ? "success" : "mistake");

            eventEmitter.emit(AppEvents.NotePlayed, { data: { playedNote, currNote, isSuccess, currNoteValue } });

            setRoundResults((prev) => [...prev, isSuccess ? 1 : 0]);
            updateRound({ attempts: [...currRound.attempts, playedNote] });

            if (isSuccess) {
                playPianoNote(playedNote);
            } else {
                playPianoNote(playedNote);
                playPianoNote(currNote);
                playSoundEfx(SoundEffect.WrongAnswer2);
            }

            if (isLastNote) {
                await wait(0);
                setRoundResults([]);
                const newRound = decideNextRound<Round<GameType.Melody>>(level, keySignature, possibleNotes);
                addNewRound(newRound);
            }
        },
        [level, isLastNote, currNote, currRound?.values, currRound?.attempts]
    );

    const onCountdownFinish = useCallback(async () => {
        setGameFinished(true);

        const gameScoreInfo = ScoreManager.getScore();
        const finalScore = ScoreManager.getFinalScore(level.durationInSeconds);

        await saveGameRecord({
            id: randomUID(),
            levelId: id,
            rounds,
            timestamp: Date.now(),
            type: GameType.Melody,
            durationInSeconds: level.durationInSeconds,
            score: {
                ...gameScoreInfo,
                ...finalScore,
            },
        });
        router.replace({ pathname: "/game-over" });
        // router.replace({ pathname: isPracticeLevel ? "/practice" : "/game-over" });
    }, [level, id, rounds]);

    // start new game
    useEffect(() => {
        const gameInfo: Partial<CurrentGame> = {
            levelId: id,
            timestamp: Date.now(),
            type: GameType.Melody,
            rounds: [decideNextRound<MelodyRound>(level, keySignature, possibleNotes)],
            state: GameState.Idle,
        };
        // console.log("START NEW MELODY GAME", { level, keySignature, possibleNotes });
        startNewGame({ ...level, ...gameInfo } as CurrentGame);
    }, [id, level]);

    return {
        currNote,
        currRound,
        rounds,
        melodyIdx,
        hintCount,
        roundResults,
        level,
        gameFinished,
        onPianoKeyPress,
        onCountdownFinish,
    };
}

export function MelodyGameComponent() {
    const theme = useTheme();
    const { level, currRound, currNote, hintCount, roundResults, gameFinished, onPianoKeyPress, onCountdownFinish } =
        useMelody();

    useEffect(() => {
        return () => {
            // console.log("MELODY GAME UNMOUNT!!!");
            ScoreManager.reset();
        };
    }, []);

    return (
        <SafeAreaView style={[s.outerContainer, { backgroundColor: Colors[theme].bg }]}>
            <View style={[s.container, { opacity: gameFinished ? 0 : 1 }]}>
                <AppView style={s.top}>
                    <TimerAndStatsDisplay onCountdownFinish={onCountdownFinish} levelId={level.id} />
                </AppView>

                <View style={s.mainContainer}>
                    {currRound?.values ? (
                        <SheetMusic.Melody
                            clef={level.clef}
                            durations={currRound.durations}
                            keySignature={level.keySignature}
                            timeSignature={level.timeSignature}
                            keys={currRound.values}
                            roundResults={roundResults}
                        />
                    ) : null}

                    <AttemptedNotes />

                    <Piano
                        gameType={GameType.Melody}
                        hintCount={hintCount}
                        currNote={currNote}
                        keySignature={level.keySignature}
                        onKeyPressed={onPianoKeyPress}
                        onKeyReleased={() => {}}
                        // onKeyReleased={() => releasePianoNote(currRound?.values?.[melodyIdx] || null)}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
