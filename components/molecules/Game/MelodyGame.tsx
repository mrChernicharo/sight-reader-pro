import { AppView } from "@/components/atoms/AppView";
import { AttemptedNote } from "@/components/atoms/AttemptedNote";
import { useAllLevels } from "@/hooks/useAllLevels";
import { useAppStore } from "@/hooks/useAppStore";
import { useSoundContext } from "@/hooks/useSoundsContext";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import { GameState, GameType, KeySignature, NoteName, SoundEffect } from "@/utils/enums";
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
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Piano } from "../Piano/Piano";
import { SheetMusic } from "../SheetMusic";
import { TimerAndStatsDisplay } from "../TimeAndStatsDisplay";

const s = STYLES.game;

export function MelodyGameComponent() {
    const theme = useTheme();
    const { id, keySignature: ksig, previousPage: prevPage } = useLocalSearchParams() as unknown as GameScreenParams;

    const { playPianoNote, playSoundEfx } = useSoundContext();
    const { getLevel } = useAllLevels();
    const { currentGame, saveGameRecord, startNewGame, updateRound, addNewRound, updatePlayedNotes } = useAppStore();

    const rounds = currentGame?.rounds || [];
    const currRound = rounds.at(-1) as MelodyRound;
    const keySignature = decodeURIComponent(ksig) as KeySignature;

    const level = getLevel(id)!;
    const possibleNotes = getPossibleNotesInLevel(level);
    const hintCount = getLevelHintCount(level.skillLevel);
    // const isPracticeLevel = getIsPracticeLevel(level.id);

    const [melodyIdx, setMelodyIdx] = useState(0);
    const [attemptedNotes, setAttemptedNotes] = useState<AttemptedNoteType[]>([]);

    // const currNote = currRound?.values?.[melodyIdx] || null;

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

    async function onPianoKeyPress(attempt: NoteName) {
        // if (!currRound) return;
        const currNote = currRound.values[melodyIdx];
        const { noteName, octave } = explodeNote(currNote);
        const success = isNoteMatch(attempt, noteName);
        const playedNote = `${attempt}/${+octave}` as Note;

        const isLastNote = melodyIdx === currRound.values.length - 1;
        const attempts = [...currRound.attempts, playedNote];

        updateRound({ attempts });
        setAttemptedNotes((prev) => {
            prev.push({ id: randomUID(), you: playedNote, correct: currNote });
            return prev;
        });

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
            setMelodyIdx(0);
            addNewRound(decideNextRound<Round<GameType.Melody>>(level, keySignature, possibleNotes));
        } else {
            setMelodyIdx((prev) => prev + 1);
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
                    <SheetMusic.Melody {...noteProps} />
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
