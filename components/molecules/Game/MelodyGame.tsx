import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useAppStore } from "@/hooks/useAppStore";
import { useSoundContext } from "@/hooks/useSoundsContext";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import { GameState, GameType, KeySignature, NoteName, SoundEffect } from "@/utils/enums";
import {
    explodeNote,
    getAttemptedNoteDuration,
    getIsPracticeLevel,
    getLevelHintCount,
    getPossibleNotesInLevel,
    getPreviousPage,
    isNoteMatch,
    randomUID,
    wait,
} from "@/utils/helperFns";
import { ALL_LEVELS, getLevel } from "@/utils/levels";
import { decideNextRound } from "@/utils/noteFns";
import { STYLES } from "@/utils/styles";
import {
    CurrentGame,
    GameScreenParams,
    MelodyRound,
    Note,
    Round,
    AttemptedNote as AttemptedNoteType,
} from "@/utils/types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Piano } from "../Piano/Piano";
import { SheetMusic } from "../SheetMusic";
import { TimerAndStatsDisplay } from "../TimeAndStatsDisplay";
import { AttemptedNote } from "@/components/atoms/AttemptedNote";

const s = STYLES.game;

export function MelodyGameComponent() {
    const theme = useTheme();

    const { id, keySignature: ksig, previousPage: prevPage } = useLocalSearchParams() as unknown as GameScreenParams;
    const { currentGame, saveGameRecord, startNewGame, endGame, games, updateRound, addNewRound, updatePlayedNotes } =
        useAppStore();
    const { playPianoNote, releasePianoNote, playSoundEfx } = useSoundContext();

    const rounds = currentGame?.rounds || [];
    const currRound = rounds.at(-1) as MelodyRound;
    const keySignature = decodeURIComponent(ksig) as KeySignature;

    const level = getLevel(id);
    const possibleNotes = getPossibleNotesInLevel(level);
    const hintCount = getLevelHintCount(level.skillLevel);
    const isPracticeLevel = getIsPracticeLevel(level?.id);
    const backLinkTo = isPracticeLevel ? "/practice" : "/level-selection";

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

        if (success) {
            updatePlayedNotes(playedNote);
            playPianoNote(playedNote);
        } else {
            playSoundEfx(SoundEffect.WrongAnswer);
            playPianoNote(playedNote);
            playPianoNote(currNote);
        }
        setAttemptedNotes((prev) => {
            prev.push({ id: randomUID(), you: playedNote, correct: currNote });
            return prev;
        });

        if (isLastNote) {
            await wait(60);
            setMelodyIdx(0);
            addNewRound(decideNextRound<Round<GameType.Melody>>(level, keySignature, possibleNotes));
        } else {
            setMelodyIdx((prev) => prev + 1);
        }
    }

    const onBackLinkPress = () => {
        if (prevPage == "/practice") {
            console.log("leaving practice game");
            // practice screen pushes the practice level onto ALL_LEVELS...we'd better clean it up here
            ALL_LEVELS.pop();
        }
    };

    const onCountdownFinish = useCallback(async () => {
        await saveGameRecord({
            id: randomUID(),
            levelId: id,
            rounds,
            timestamp: Date.now(),
            type: GameType.Melody,
            durationInSeconds: level.durationInSeconds,
        });
        return router.replace({ pathname: "/game-over" });
    }, [level, id, rounds, games, currentGame]);

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
    }, [rounds]);

    useEffect(() => {
        return () => {
            console.log("MELODY GAME UNMOUNT!!!");
            // setTimeout(() => endGame(), 1000);
        };
    }, []);

    return (
        <SafeAreaView style={[s.container, { backgroundColor: Colors[theme].bg }]}>
            <AppView style={s.top}>
                <TimerAndStatsDisplay onCountdownFinish={onCountdownFinish} levelId={id} />
                <BackLink to={backLinkTo} style={s.backLink} onPress={onBackLinkPress} />
            </AppView>

            {currRound?.values ? (
                <AppView>
                    <SheetMusic.Melody {...noteProps} />
                </AppView>
            ) : null}

            <AppView style={[s.attemptedNotes, {}]}>
                {attemptedNotes.map((attempt) => (
                    <AttemptedNote key={attempt.id} attempt={attempt} />
                ))}
            </AppView>

            <Piano
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
