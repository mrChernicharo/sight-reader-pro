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
    MelodyRound,
    Note,
    Round,
} from "@/utils/types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Piano } from "../Piano/Piano";
import { SheetMusic } from "../SheetMusic";
import { TimerAndStatsDisplay } from "../TimeAndStatsDisplay";

const s = STYLES.game;

export function MelodyGameComponent() {
    const theme = useTheme();
    const { id, keySignature: kSign, previousPage: prevPage } = useLocalSearchParams() as unknown as GameScreenParams;

    const { playPianoNote, playSoundEfx } = useSoundContext();
    const { getLevel } = useAllLevels();
    const { currentGame, saveGameRecord, startNewGame, updateRound, addNewRound, updatePlayedNotes } = useAppStore();

    const locked = useRef(false);

    const rounds = currentGame?.rounds || [];
    const currRound = rounds.at(-1) as MelodyRound;
    const keySignature = decodeURIComponent(kSign) as KeySignature;

    const level = getLevel(id)!;
    const possibleNotes = getPossibleNotesInLevel(level);
    const hintCount = getLevelHintCount(level.skillLevel);
    // const isPracticeLevel = getIsPracticeLevel(level.id);

    const [melodyIdx, setMelodyIdx] = useState(0);
    const [attemptedNotes, setAttemptedNotes] = useState<AttemptedNoteType[]>([]);
    const [roundResults, setRoundResults] = useState<(0 | 1)[]>([]);
    // const currNote = currRound?.values?.[melodyIdx] || null;
    const isLastNote = melodyIdx === currRound.values.length - 1;
    const currNote = currRound.values[melodyIdx];

    const onPianoKeyPress = useCallback(
        async (attempt: NoteName) => {
            if (locked.current) return;
            locked.current = true;

            const { noteName, octave } = explodeNote(currNote);
            const success = isNoteMatch(attempt, noteName);
            const playedNote = `${attempt}/${+octave}` as Note;

            updateRound({ attempts: [...currRound.attempts, playedNote] });
            setRoundResults((prev) => (success ? [...prev, 1] : [...prev, 0]));
            setAttemptedNotes((prev) => [...prev, { id: randomUID(), you: playedNote, correct: currNote }]);

            if (success) {
                updatePlayedNotes(playedNote);
                playPianoNote(playedNote);
            } else {
                playPianoNote(playedNote);
                playPianoNote(currNote);
                playSoundEfx(SoundEffect.WrongAnswer2);
            }

            if (isLastNote) {
                await wait(0);
                setRoundResults([]);
                setMelodyIdx(0);
                addNewRound(decideNextRound<Round<GameType.Melody>>(level, keySignature, possibleNotes));
            } else {
                setMelodyIdx((prev) => prev + 1);
            }
            locked.current = false;
        },
        [level, isLastNote, currRound.values, melodyIdx, currRound.attempts]
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

    // useEffect(() => {
    //     console.log({ roundResults });
    // }, [roundResults]);

    // useEffect(() => {
    //     console.log({ attempts: currRound.attempts });
    // }, [currRound.attempts]);

    // useEffect(() => {
    //     console.log(":::", { values: currRound.values });
    // }, [currRound.values]);

    useEffect(() => {
        return () => {
            console.log("MELODY GAME UNMOUNT!!!");
        };
    }, []);

    return (
        <SafeAreaView style={{ ...s.container, backgroundColor: Colors[theme].bg }}>
            <AppView style={s.top}>
                <TimerAndStatsDisplay onCountdownFinish={onCountdownFinish} levelId={id} />
            </AppView>

            {currRound?.values ? (
                <AppView>
                    <SheetMusic.Melody
                        clef={level.clef}
                        durations={currRound.durations}
                        keySignature={keySignature}
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
                keySignature={keySignature}
                onKeyPressed={onPianoKeyPress}
                onKeyReleased={() => {}}
                // onKeyReleased={() => releasePianoNote(currRound?.values?.[melodyIdx] || null)}
            />
        </SafeAreaView>
    );
}
