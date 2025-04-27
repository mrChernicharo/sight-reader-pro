import { AppView } from "@/components/atoms/AppView";
import { AttemptedNote } from "@/components/atoms/AttemptedNote";
import { useAllLevels } from "@/hooks/useAllLevels";
import { useAppStore } from "@/hooks/useAppStore";
import { useSoundContext } from "@/hooks/useSoundsContext";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import { GameState, GameType, KeySignature, NoteName, SoundEffect, TimeSignature } from "@/utils/enums";
import {
    explodeNote,
    getAttemptedNoteDuration,
    getLevelHintCount,
    getPossibleNotesInLevel,
    isNoteMatch,
    randomUID,
    wait,
} from "@/utils/helperFns";
import { decideNextRound } from "@/utils/noteFns";
import { STYLES } from "@/utils/styles";
import {
    AttemptedNote as AttemptedNoteType,
    CurrentGame,
    GameScreenParams,
    Level,
    MelodyRound,
    Note,
    Round,
} from "@/utils/types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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

    const [attemptedNotes, setAttemptedNotes] = useState<AttemptedNoteType[]>([]);
    const [roundResults, setRoundResults] = useState<(0 | 1)[]>([]);

    const melodyIdx = roundResults.length;
    const isLastNote = currRound?.values ? melodyIdx >= currRound.values.length - 1 : false;
    const currNote = currRound?.values?.[melodyIdx] || "c/4";

    const onPianoKeyPress = useCallback(
        async (attempt: NoteName) => {
            const { noteName, octave } = explodeNote(currNote);
            const success = isNoteMatch(attempt, noteName);
            const playedNote = `${attempt}/${+octave}` as Note;

            setRoundResults((prev) => (success ? [...prev, 1] : [...prev, 0]));
            setAttemptedNotes((prev) => [...prev, { id: randomUID(), you: playedNote, correct: currNote }]);

            if (success) {
                playPianoNote(playedNote);
            } else {
                playPianoNote(playedNote);
                playPianoNote(currNote);
                playSoundEfx(SoundEffect.WrongAnswer2);
            }

            if (isLastNote) {
                await wait(0);
                setRoundResults([]);
                addNewRound(decideNextRound<Round<GameType.Melody>>(level, keySignature, possibleNotes));
            } else {
            }
            updateRound({ attempts: [...currRound.attempts, playedNote] });
        },
        [level, isLastNote, currRound?.values, currRound?.attempts]
    );

    const onCountdownFinish = useCallback(async () => {
        await saveGameRecord({
            id: randomUID(),
            levelId: id,
            rounds,
            timestamp: Date.now(),
            type: GameType.Melody,
            durationInSeconds: level.durationInSeconds,
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

    useEffect(() => {
        (async () => {
            const duration = getAttemptedNoteDuration(true);
            await wait(duration);

            setAttemptedNotes((prev) => {
                prev.shift();
                return prev;
            });
        })();
    }, [rounds.length]);

    return {
        currRound,
        rounds,
        currNote,
        melodyIdx,
        hintCount,
        attemptedNotes,
        roundResults,
        level,
        onPianoKeyPress,
        onCountdownFinish,
    };
}

export function MelodyGameComponent() {
    const theme = useTheme();
    const { level, currRound, melodyIdx, hintCount, attemptedNotes, roundResults, onPianoKeyPress, onCountdownFinish } =
        useMelody();

    useEffect(() => {
        return () => {
            console.log("MELODY GAME UNMOUNT!!!");
        };
    }, []);

    return (
        <SafeAreaView style={[s.container, { backgroundColor: Colors[theme].bg }]}>
            <AppView style={s.top}>
                <TimerAndStatsDisplay onCountdownFinish={onCountdownFinish} levelId={level.id} />
            </AppView>

            {currRound?.values ? (
                <AppView>
                    <SheetMusic.Melody
                        clef={level.clef}
                        durations={currRound.durations}
                        keySignature={level.keySignature}
                        timeSignature={level.timeSignature}
                        keys={currRound.values}
                        roundResults={roundResults}
                    />
                </AppView>
            ) : null}

            <AppView style={s.attemptedNotes}>
                {attemptedNotes.map((attempt) => (
                    <AttemptedNote key={attempt.id} attempt={attempt} />
                ))}
            </AppView>

            <Piano
                gameType={GameType.Melody}
                hintCount={hintCount}
                currNote={currRound?.values?.[melodyIdx] || null}
                keySignature={level.keySignature}
                onKeyPressed={onPianoKeyPress}
                onKeyReleased={() => {}}
                // onKeyReleased={() => releasePianoNote(currRound?.values?.[melodyIdx] || null)}
            />
        </SafeAreaView>
    );
}
