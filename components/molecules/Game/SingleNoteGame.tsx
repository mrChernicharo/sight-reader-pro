import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { TooltipTextLines } from "@/components/atoms/TooltipTextLines";
import { useAppStore } from "@/hooks/useAppStore";
import { useSoundContext } from "@/hooks/useSoundsContext";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { WALKTHROUGH_TOP_ADJUSTMENT } from "@/utils/constants";
import { Clef, GameState, GameType, KeySignature, NoteName, SoundEffect } from "@/utils/enums";
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
import { STYLES, testBorder } from "@/utils/styles";
import {
    AttemptedNote as AttemptedNoteType,
    CurrentGame,
    GameScreenParams,
    Note,
    SingleNoteRound,
} from "@/utils/types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleProp, TextStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Tooltip from "react-native-walkthrough-tooltip";
import { Piano } from "../Piano/Piano";
import { SheetMusic } from "../SheetMusic";
import { TimerAndStatsDisplay } from "../TimeAndStatsDisplay";
import { FadeOut } from "@/components/atoms/FadeOut";
import { AttemptedNote } from "@/components/atoms/AttemptedNote";

const DELAY = 60;

const s = STYLES.game;

const tourTextProps = { forceBlackText: true, style: { textAlign: "center" } as StyleProp<TextStyle> };

const getNoteColor = (gameState: GameState, theme: "light" | "dark") => {
    switch (gameState) {
        case GameState.Idle:
            return undefined;
        case GameState.Success:
            return Colors[theme].green;
        case GameState.Mistake:
            return Colors[theme].red;
    }
};

export function SingleNoteGameComponent() {
    const { t } = useTranslation();
    const theme = useTheme();
    const backgroundColor = Colors[theme].bg;

    const { id, keySignature: keySig, previousPage: prevPage } = useLocalSearchParams() as unknown as GameScreenParams;

    const { currentGame, saveGameRecord, startNewGame, addNewRound, updatePlayedNotes, setTourCompleted } =
        useAppStore();

    const { playPianoNote, playSoundEfx } = useSoundContext();
    const hasCompletedTour = useAppStore((state) => state.completedTours.game);
    // const setTourCompleted = useAppStore((state) => state.setTourCompleted);

    const [tourStep, setTourStep] = useState(-1);

    const keySignature = decodeURIComponent(keySig) as KeySignature;
    const level = getLevel(id);
    const possibleNotes = getPossibleNotesInLevel(level);
    const hintCount = getLevelHintCount(level.skillLevel);
    const isPracticeLevel = getIsPracticeLevel(currentGame?.levelId);

    const rounds = currentGame?.rounds || [];

    const [gameState, setGameState] = useState<GameState>(GameState.Idle);
    const [currNote, setCurrNote] = useState<Note>(
        decideNextRound<SingleNoteRound>(level, keySignature, possibleNotes)?.value ?? "c/3"
    );
    const [attemptedNotes, setAttemptedNotes] = useState<AttemptedNoteType[]>([]);

    async function onPianoKeyPress(notename: NoteName) {
        if (gameState !== GameState.Idle) return;
        const { noteName, octave } = explodeNote(currNote);
        const playedNote = `${notename}/${+octave}` as Note;
        const success = isNoteMatch(notename, noteName);

        // console.log({ currNote, attemptedNote: playedNote, success });

        if (success) {
            updatePlayedNotes(playedNote);
            playPianoNote(playedNote);
            setGameState(GameState.Success);
        } else {
            playSoundEfx(SoundEffect.WrongAnswer);
            playPianoNote(playedNote);
            playPianoNote(currNote);
            setGameState(GameState.Mistake);
        }
        setAttemptedNotes((prev) => {
            prev.push({ id: randomUID(), you: playedNote, correct: currNote });
            return prev;
        });

        await wait(DELAY);

        if (!currentGame || currentGame.type !== GameType.Single) return;

        addNewRound({ value: currNote, attempt: playedNote });

        const { value: nextNote } = decideNextRound<SingleNoteRound>(level, keySignature, possibleNotes, {
            value: currNote,
            attempt: playedNote,
        })!;

        if (nextNote) setCurrNote(nextNote);

        setGameState(GameState.Idle);
    }

    function onPianoKeyReleased(notename: NoteName) {}

    const onCountdownFinish = useCallback(async () => {
        setGameState(GameState.Idle);
        const gameRecord = {
            id: randomUID(),
            levelId: id,
            rounds,
            timestamp: Date.now(),
            type: GameType.Single,
            durationInSeconds: level.durationInSeconds,
        };
        // console.log("OK", { gameRecord });
        await saveGameRecord(gameRecord);
        router.replace({ pathname: "/game-over" });
        // router.replace({ pathname: isPracticeLevel ? "/practice" : "/game-over" });
    }, [level, id, rounds]);

    // start game
    useEffect(() => {
        const firstRound = decideNextRound<SingleNoteRound>(level, keySignature, possibleNotes)?.value ?? "c/3";
        const gameInfo: Partial<CurrentGame> = {
            levelId: id,
            timestamp: Date.now(),
            type: GameType.Single,
            rounds: [{ value: firstRound, attempt: null }],
            state: GameState.Idle,
        };
        startNewGame({ ...level, ...gameInfo } as CurrentGame);
    }, [id, level]);

    useEffect(() => {
        // console.log("SINGLE NOTE GAME MOUNTED!!!");
        setTimeout(() => setTourStep(0), 200);
    }, []);

    useEffect(() => {
        return () => {
            console.log("SINGLE NOTE GAME UNMOUNT!!!");
            if (prevPage == "/practice") {
                console.log("leaving practice game");
                // practice screen pushes the practice level onto ALL_LEVELS...we'd better clean it up here
                ALL_LEVELS.pop();
            }
        };
    }, []);

    useEffect(() => {
        console.log("<SingleNoteGame>", { hasCompletedTour, tourStep });
    }, [hasCompletedTour, tourStep]);

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

    if (!level || !currentGame || !currNote || currentGame?.type !== GameType.Single) return null;

    const noteColor = getNoteColor(gameState, theme);
    const noteProps = { keys: [currNote], clef: level.clef, keySignature, noteColor };

    return (
        <SafeAreaView style={[s.container, { backgroundColor }]}>
            <AppView style={s.top}>
                <Tooltip
                    isVisible={!hasCompletedTour && tourStep == 3}
                    placement="bottom"
                    topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                    contentStyle={{}}
                    content={
                        <AppView transparentBG style={{ alignItems: "center" }}>
                            <TooltipTextLines keypath="tour.game.3" />
                            <AppButton
                                style={{ marginVertical: 8 }}
                                text={t("tour.game.3_ok")}
                                onPress={() => {
                                    setTourStep(4);
                                }}
                            />
                        </AppView>
                    }
                >
                    <TimerAndStatsDisplay
                        stopped={!hasCompletedTour}
                        onCountdownFinish={onCountdownFinish}
                        levelId={id}
                    />
                </Tooltip>
            </AppView>

            <Tooltip
                isVisible={!hasCompletedTour && tourStep == 0}
                placement="center"
                topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                content={
                    <AppView transparentBG style={{ alignItems: "center" }}>
                        <TooltipTextLines keypath="tour.game.0" />
                        <AppButton
                            style={{ marginVertical: 8 }}
                            text="OK"
                            onPress={() => {
                                setTourStep(1);
                            }}
                        />
                    </AppView>
                }
            />
            <Tooltip
                isVisible={!hasCompletedTour && tourStep == 4}
                placement="center"
                topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                content={
                    <AppView transparentBG style={{ alignItems: "center" }}>
                        <TooltipTextLines keypath="tour.game.4" />
                        <AppText {...tourTextProps} type="mdSemiBold">
                            {t("tour.game.4_ready")}
                        </AppText>

                        <AppButton
                            style={{ marginVertical: 8 }}
                            text={t("tour.game.4_ok")}
                            onPress={async () => {
                                await setTourCompleted("game", true);
                                setTourStep(0);
                            }}
                        />
                    </AppView>
                }
            />

            {/* GAME STAGE TOUR */}
            {currNote && (
                <Tooltip
                    isVisible={!hasCompletedTour && tourStep == 1}
                    placement="bottom"
                    tooltipStyle={{ transform: [{ translateY: 0 }] }}
                    topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                    contentStyle={{}}
                    parentWrapperStyle={{}}
                    content={
                        <AppView transparentBG style={{ alignItems: "center" }}>
                            <TooltipTextLines keypath="tour.game.1" />
                            <AppText {...tourTextProps} type="mdSemiBold">
                                {t(`music.notes.${explodeNote(currNote).noteName}`).toUpperCase()}
                            </AppText>
                            <AppButton style={{ marginVertical: 8 }} text="OK" onPress={() => setTourStep(2)} />
                        </AppView>
                    }
                >
                    {/* GAME STAGE */}
                    <SingleNoteGameStage noteProps={noteProps} />
                </Tooltip>
            )}

            <AppView style={[s.attemptedNotes, { transform: [{ translateY: 20 }] }]}>
                {attemptedNotes.map((attempt) => (
                    <AttemptedNote key={attempt.id} attempt={attempt} />
                ))}
            </AppView>

            <Tooltip
                isVisible={!hasCompletedTour && tourStep == 2}
                placement="top"
                topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                tooltipStyle={{ transform: [{ translateY: -60 }] }}
                contentStyle={{ minHeight: 128 }}
                content={
                    <AppView transparentBG style={{ alignItems: "center" }}>
                        <TooltipTextLines keypath="tour.game.2" />
                        <AppButton style={{ marginVertical: 8 }} text="OK" onPress={() => setTourStep(3)} />
                    </AppView>
                }
            >
                <Piano
                    hintCount={hintCount}
                    currNote={currNote}
                    keySignature={keySignature}
                    onKeyPressed={onPianoKeyPress}
                    onKeyReleased={onPianoKeyReleased}
                />
            </Tooltip>
        </SafeAreaView>
    );
}

function SingleNoteGameStage({
    noteProps,
}: {
    noteProps: {
        keys: Note[];
        clef: Clef;
        keySignature: KeySignature;
    };
}) {
    return <SheetMusic.SingleNote {...noteProps} />;
}
