import { eventEmitter } from "@/app/_layout";
import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { TooltipTextLines } from "@/components/atoms/TooltipTextLines";
import { useGameTour } from "@/hooks/tours/useGameTour";
import { useAllLevels } from "@/hooks/useAllLevels";
import { useAppStore } from "@/hooks/useAppStore";
import { useSoundContext } from "@/hooks/useSoundsContext";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { WALKTHROUGH_TOP_ADJUSTMENT } from "@/utils/constants";
import { AppEvents, Clef, GameState, GameType, KeySignature, NoteName, SoundEffect } from "@/utils/enums";
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
import { CurrentGame, Game, GameScreenParams, Note, SingleNoteRound } from "@/utils/types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleProp, TextStyle, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Tooltip, { Placement } from "react-native-tooltip-2";
import { AttemptedNotes } from "../AttemptedNotes";
import { Piano } from "../Piano/Piano";
import { SheetMusic } from "../SheetMusic";
import { TimerAndStatsDisplay } from "../TimeAndStatsDisplay";

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

    const { id, keySignature: keySig } = useLocalSearchParams() as unknown as GameScreenParams;

    const { playPianoNote, playSoundEfx } = useSoundContext();
    const { getLevel } = useAllLevels();
    const { tourStep, goToStepOne, goToStepTwo, goToStepThree, goToStepFour, doFinalStep } = useGameTour();
    const { currentGame, saveGameRecord, startNewGame, addNewRound } = useAppStore();
    const hasCompletedTour = useAppStore((state) => state.completedTours.game);

    const keySignature = decodeURIComponent(keySig) as KeySignature;
    const level = getLevel(id)!;
    const possibleNotes = getPossibleNotesInLevel(level);
    const hintCount = getLevelHintCount(level.skillLevel);
    // const isPracticeLevel = getIsPracticeLevel(currentGame?.levelId);

    const rounds = useMemo(() => currentGame?.rounds || [], [currentGame?.rounds]);

    const [gameState, setGameState] = useState<GameState>(GameState.Idle);
    const [currNote, setCurrNote] = useState<Note>(
        () => decideNextRound<SingleNoteRound>(level, keySignature, possibleNotes)?.value ?? "c/3"
    );

    async function onPianoKeyPress(notename: NoteName) {
        if (gameState !== GameState.Idle) return;
        const { noteName, octave } = explodeNote(currNote);
        const playedNote = `${notename}/${+octave}` as Note;
        const isSuccess = isNoteMatch(notename, noteName);

        // console.log({ currNote, attemptedNote: playedNote, success });
        const { currNoteValue } = ScoreManager.push(isSuccess ? "success" : "mistake");
        eventEmitter.emit(AppEvents.NotePlayed, { data: { playedNote, currNote, isSuccess, currNoteValue } });

        if (isSuccess) {
            setGameState(GameState.Success);
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

        const prevRound = { value: currNote, attempt: playedNote };
        const { value: nextNote } = decideNextRound<SingleNoteRound>(level, keySignature, possibleNotes, prevRound);
        if (nextNote) setCurrNote(nextNote);
        setGameState(GameState.Idle);
    }

    function onPianoKeyReleased(notename: NoteName) {}

    const onCountdownFinish = useCallback(async () => {
        setGameState(GameState.Idle);
        const gameScoreInfo = ScoreManager.getScore();
        const finalScore = ScoreManager.getFinalScore(level.durationInSeconds);

        const gameRecord: Game = {
            id: randomUID(),
            levelId: id,
            rounds,
            timestamp: Date.now(),
            type: GameType.Single,
            durationInSeconds: level.durationInSeconds,
            score: {
                ...gameScoreInfo,
                ...finalScore,
            },
        };

        // console.log("<onCountdownFinish> ", { finalScore, gameScoreInfo, gameRecord });
        // console.log("OK", { gameRecord });
        await saveGameRecord(gameRecord);
        router.replace({ pathname: "/game-over" });
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
        return () => {
            // console.log("SINGLE NOTE GAME UNMOUNT!!!");
            ScoreManager.reset();
        };
    }, []);

    if (!level || !currentGame || !currNote || currentGame?.type !== GameType.Single) return null;

    const noteColor = getNoteColor(gameState, theme);
    const noteProps = { keys: [currNote], clef: level.clef, keySignature, noteColor };
    const currNoteText = t(`music.notes.${explodeNote(currNote).noteName}`).toUpperCase();

    return (
        <SafeAreaView style={{ ...s.container, backgroundColor }}>
            <View style={s.top}>
                <Tooltip
                    isVisible={!hasCompletedTour && tourStep == 3}
                    placement={Placement.BOTTOM}
                    topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                    contentStyle={{ transform: [{ translateY: 32 }] }}
                    // @ts-ignore
                    arrowStyle={{ transform: [{ translateY: -32 }] }}
                    onClose={goToStepFour}
                    // contentStyle={{ borderRadius: 16 }}
                    // childrenWrapperStyle={{ borderRadius: 16 }}
                    // parentWrapperStyle={{ borderRadius: 16 }}
                    content={
                        <View style={{ alignItems: "center" }}>
                            <TooltipTextLines keypath="tour.game.3" />
                            <AppButton
                                style={{ marginVertical: 8 }}
                                text={t("tour.game.3_ok")}
                                onPress={goToStepFour}
                            />
                        </View>
                    }
                >
                    <TimerAndStatsDisplay
                        stopped={!hasCompletedTour}
                        onCountdownFinish={onCountdownFinish}
                        levelId={id}
                    />
                </Tooltip>
            </View>

            <Tooltip
                isVisible={!hasCompletedTour && tourStep == 0}
                placement={Placement.CENTER}
                topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                onClose={goToStepOne}
                content={
                    <View style={{ alignItems: "center" }}>
                        <TooltipTextLines keypath="tour.game.0" />
                        <AppButton style={{ marginVertical: 8 }} text="OK" onPress={goToStepOne} />
                    </View>
                }
            />
            <Tooltip
                isVisible={!hasCompletedTour && tourStep == 4}
                placement={Placement.CENTER}
                topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                onClose={doFinalStep}
                content={
                    <View style={{ alignItems: "center" }}>
                        <TooltipTextLines keypath="tour.game.4" />
                        <AppText {...tourTextProps} type="mdSemiBold">
                            {t("tour.game.4_ready")}
                        </AppText>

                        <AppButton style={{ marginVertical: 8 }} text={t("tour.game.4_ok")} onPress={doFinalStep} />
                    </View>
                }
            />

            {/* GAME STAGE TOUR */}
            {currNote && (
                <Tooltip
                    isVisible={!hasCompletedTour && tourStep == 1}
                    placement={Placement.BOTTOM}
                    topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                    onClose={goToStepTwo}
                    // @ts-ignore
                    arrowStyle={{ transform: [{ translateY: 60 }] }}
                    contentStyle={{ minHeight: 128, transform: [{ translateY: -60 }] }}
                    content={
                        <View style={{ alignItems: "center" }}>
                            <TooltipTextLines keypath="tour.game.1" />
                            <AppText {...tourTextProps} type="mdSemiBold">
                                {currNoteText}
                            </AppText>
                            <AppButton style={{ marginVertical: 8 }} text="OK" onPress={goToStepTwo} />
                        </View>
                    }
                >
                    <SingleNoteGameStage noteProps={noteProps} />
                </Tooltip>
            )}

            <AttemptedNotes />

            <Tooltip
                isVisible={!hasCompletedTour && tourStep == 2}
                placement={Placement.TOP}
                topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                // @ts-ignore
                arrowStyle={{ transform: [{ translateY: -36 }] }}
                contentStyle={{ minHeight: 128, transform: [{ translateY: -36 }] }}
                onClose={goToStepThree}
                content={
                    <View style={{ alignItems: "center" }}>
                        <TooltipTextLines keypath="tour.game.2" />
                        <AppButton style={{ marginVertical: 8 }} text="OK" onPress={goToStepThree} />
                    </View>
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

export interface NotePlayedEventData {
    playedNote: Note;
    currNote: Note;
    isSuccess: boolean;
    currNoteValue: number;
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
