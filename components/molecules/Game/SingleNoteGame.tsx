import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { AttemptedNote } from "@/components/atoms/AttemptedNote";
import { TooltipTextLines } from "@/components/atoms/TooltipTextLines";
import { useAllLevels } from "@/hooks/useAllLevels";
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
    Note,
    SingleNoteRound,
} from "@/utils/types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleProp, TextStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Tooltip from "react-native-walkthrough-tooltip";
import { Piano } from "../Piano/Piano";
import { SheetMusic } from "../SheetMusic";
import { TimerAndStatsDisplay } from "../TimeAndStatsDisplay";
import { useGameTour } from "@/hooks/tours/useGameTour";

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

    const { playPianoNote, playSoundEfx } = useSoundContext();
    const { getLevel } = useAllLevels();
    const { currentGame, saveGameRecord, startNewGame, addNewRound, updatePlayedNotes } = useAppStore();

    const { tourStep, goToStepOne, goToStepTwo, goToStepThree, goToStepFour, doFinalStep } = useGameTour();

    const hasCompletedTour = useAppStore((state) => state.completedTours.game);

    const keySignature = decodeURIComponent(keySig) as KeySignature;
    const level = getLevel(id)!;
    const possibleNotes = getPossibleNotesInLevel(level);
    const hintCount = getLevelHintCount(level.skillLevel);
    // const isPracticeLevel = getIsPracticeLevel(currentGame?.levelId);

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
        setAttemptedNotes((prev) => {
            prev.push({ id: randomUID(), you: playedNote, correct: currNote });
            return prev;
        });

        if (success) {
            setGameState(GameState.Success);
            updatePlayedNotes(playedNote);
            playPianoNote(playedNote);
        } else {
            setGameState(GameState.Mistake);
            playPianoNote(playedNote);
            playPianoNote(currNote);
            playSoundEfx(SoundEffect.WrongAnswer2);
        }

        await wait(0);

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
            console.log("SINGLE NOTE GAME UNMOUNT!!!");
        };
    }, []);

    if (!level || !currentGame || !currNote || currentGame?.type !== GameType.Single) return null;

    const noteColor = getNoteColor(gameState, theme);
    const noteProps = { keys: [currNote], clef: level.clef, keySignature, noteColor };
    const currNoteText = t(`music.notes.${explodeNote(currNote).noteName}`).toUpperCase();

    return (
        <SafeAreaView style={{ ...s.container, backgroundColor }}>
            <AppView style={s.top}>
                <Tooltip
                    isVisible={!hasCompletedTour && tourStep == 3}
                    placement="bottom"
                    topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                    contentStyle={{ transform: [{ translateY: 32 }] }}
                    arrowStyle={{ transform: [{ translateY: -32 }] }}
                    onClose={goToStepFour}
                    // contentStyle={{ borderRadius: 16 }}
                    // childrenWrapperStyle={{ borderRadius: 16 }}
                    // parentWrapperStyle={{ borderRadius: 16 }}
                    content={
                        <AppView transparentBG style={{ alignItems: "center" }}>
                            <TooltipTextLines keypath="tour.game.3" />
                            <AppButton
                                style={{ marginVertical: 8 }}
                                text={t("tour.game.3_ok")}
                                onPress={goToStepFour}
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
                onClose={goToStepOne}
                content={
                    <AppView transparentBG style={{ alignItems: "center" }}>
                        <TooltipTextLines keypath="tour.game.0" />
                        <AppButton style={{ marginVertical: 8 }} text="OK" onPress={goToStepOne} />
                    </AppView>
                }
            />
            <Tooltip
                isVisible={!hasCompletedTour && tourStep == 4}
                placement="center"
                topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                onClose={doFinalStep}
                content={
                    <AppView transparentBG style={{ alignItems: "center" }}>
                        <TooltipTextLines keypath="tour.game.4" />
                        <AppText {...tourTextProps} type="mdSemiBold">
                            {t("tour.game.4_ready")}
                        </AppText>

                        <AppButton style={{ marginVertical: 8 }} text={t("tour.game.4_ok")} onPress={doFinalStep} />
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
                    onClose={goToStepTwo}
                    // contentStyle={{}}
                    // parentWrapperStyle={{}}
                    content={
                        <AppView transparentBG style={{ alignItems: "center" }}>
                            <TooltipTextLines keypath="tour.game.1" />
                            <AppText {...tourTextProps} type="mdSemiBold">
                                {currNoteText}
                            </AppText>
                            <AppButton style={{ marginVertical: 8 }} text="OK" onPress={goToStepTwo} />
                        </AppView>
                    }
                >
                    {/* GAME STAGE */}
                    <SingleNoteGameStage noteProps={noteProps} />
                </Tooltip>
            )}

            <AppView style={{ ...s.attemptedNotes, transform: [{ translateY: 20 }] }}>
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
                onClose={goToStepThree}
                content={
                    <AppView transparentBG style={{ alignItems: "center" }}>
                        <TooltipTextLines keypath="tour.game.2" />
                        <AppButton style={{ marginVertical: 8 }} text="OK" onPress={goToStepThree} />
                    </AppView>
                }
            >
                <Piano
                    gameType={GameType.Single}
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
