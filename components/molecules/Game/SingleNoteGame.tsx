import { eventEmitter } from "@/app/_layout";
import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { TooltipTextLines } from "@/components/atoms/TooltipTextLines";
import { WalkthroughTooltip } from "@/components/atoms/WalkthroughTooltip";
import { useGameTour } from "@/hooks/tours/useGameTour";
import { useAllLevels } from "@/hooks/useAllLevels";
import { useAppStore } from "@/hooks/useAppStore";
import { useSoundContext } from "@/hooks/useSoundsContext";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
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
import { Placement } from "react-native-tooltip-2";
import { AttemptedNotes } from "../AttemptedNotes";
import { Piano } from "../Piano/Piano";
import { SheetMusic } from "../SheetMusic";
import { TimerAndStatsDisplay } from "../TimeAndStatsDisplay";
import { LoadingScreen } from "../LoadingScreen";

const s = STYLES.game;

const tourTextProps = { forceBlackText: true, style: { textAlign: "center" } as StyleProp<TextStyle> };

export function SingleNoteGameComponent() {
    const { t } = useTranslation();

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

    const rounds = useMemo(() => currentGame?.rounds || [], [currentGame?.rounds]);

    const [gameFinished, setGameFinished] = useState(false);
    const [currNote, setCurrNote] = useState<Note>(
        () => decideNextRound<SingleNoteRound>(level, keySignature, possibleNotes)?.value ?? "c/3"
    );

    async function onPianoKeyPress(notename: NoteName) {
        const { noteName, octave } = explodeNote(currNote);
        const playedNote = `${notename}/${+octave}` as Note;
        const isSuccess = isNoteMatch(notename, noteName);

        // console.log({ currNote, attemptedNote: playedNote, success });
        const { currNoteValue } = ScoreManager.push(isSuccess ? "success" : "mistake");
        eventEmitter.emit(AppEvents.NotePlayed, { data: { playedNote, currNote, isSuccess, currNoteValue } });

        if (isSuccess) {
            playPianoNote(playedNote);
        } else {
            playPianoNote(playedNote);
            playPianoNote(currNote);
            playSoundEfx(SoundEffect.WrongAnswer2);
        }

        if (!currentGame || currentGame.type !== GameType.Single) return;

        addNewRound({ value: currNote, attempt: playedNote });

        const prevRound = { value: currNote, attempt: playedNote };
        const { value: nextNote } = decideNextRound<SingleNoteRound>(level, keySignature, possibleNotes, prevRound);
        if (nextNote) setCurrNote(nextNote);
    }

    function onPianoKeyReleased(notename: NoteName) {}

    const onCountdownFinish = useCallback(async () => {
        setGameFinished(true);

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

    const currNoteText = t(`music.notes.${explodeNote(currNote).noteName}`).toUpperCase();
    const backgroundColor = Colors.dark.bg;

    return (
        <SafeAreaView style={{ ...s.container, backgroundColor }}>
            <View style={{ opacity: gameFinished ? 0 : 1 }}>
                <View style={s.top}>
                    <WalkthroughTooltip
                        isVisible={!hasCompletedTour && tourStep == 3}
                        placement={Placement.BOTTOM}
                        contentStyle={{ transform: [{ translateY: 32 }] }}
                        // @ts-ignore
                        arrowStyle={{ transform: [{ translateY: -32 }] }}
                        content={
                            <View style={{ alignItems: "center" }}>
                                <TooltipTextLines keypath="tour.game.3" />
                                <AppButton style={s.tooltipBtn} text={t("tour.game.3_ok")} onPress={goToStepFour} />
                            </View>
                        }
                    >
                        <TimerAndStatsDisplay
                            stopped={!hasCompletedTour}
                            onCountdownFinish={onCountdownFinish}
                            levelId={id}
                        />
                    </WalkthroughTooltip>
                </View>

                <WalkthroughTooltip
                    isVisible={!hasCompletedTour && tourStep == 0}
                    placement={Placement.CENTER}
                    content={
                        <View style={{ alignItems: "center" }}>
                            <TooltipTextLines keypath="tour.game.0" />
                            <AppButton style={s.tooltipBtn} text="OK" onPress={goToStepOne} />
                        </View>
                    }
                />
                <WalkthroughTooltip
                    isVisible={!hasCompletedTour && tourStep == 4}
                    placement={Placement.CENTER}
                    content={
                        <View style={{ alignItems: "center" }}>
                            <TooltipTextLines keypath="tour.game.4" />
                            <AppText {...tourTextProps} type="mdSemiBold">
                                {t("tour.game.4_ready")}
                            </AppText>

                            <AppButton style={s.tooltipBtn} text={t("tour.game.4_ok")} onPress={doFinalStep} />
                        </View>
                    }
                />

                {/* GAME STAGE TOUR */}
                {currNote && (
                    <WalkthroughTooltip
                        isVisible={!hasCompletedTour && tourStep == 1}
                        placement={Placement.BOTTOM}
                        // @ts-ignore
                        arrowStyle={{ transform: [{ translateY: 60 }] }}
                        contentStyle={{ minHeight: 128, transform: [{ translateY: -60 }] }}
                        content={
                            <View style={{ alignItems: "center" }}>
                                <TooltipTextLines keypath="tour.game.1" />
                                <AppText {...tourTextProps} type="mdSemiBold">
                                    {currNoteText}
                                </AppText>
                                <AppButton style={s.tooltipBtn} text="OK" onPress={goToStepTwo} />
                            </View>
                        }
                    >
                        <SheetMusic.SingleNote keySignature={keySignature} clef={level.clef} targetNote={currNote} />
                    </WalkthroughTooltip>
                )}

                <AttemptedNotes />

                <WalkthroughTooltip
                    isVisible={!hasCompletedTour && tourStep == 2}
                    placement={Placement.TOP}
                    // @ts-ignore
                    arrowStyle={{ transform: [{ translateY: -36 }] }}
                    contentStyle={{ minHeight: 128, transform: [{ translateY: -36 }] }}
                    content={
                        <View style={{ alignItems: "center" }}>
                            <TooltipTextLines keypath="tour.game.2" />
                            <AppButton style={s.tooltipBtn} text="OK" onPress={goToStepThree} />
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
                </WalkthroughTooltip>
            </View>
        </SafeAreaView>
    );
}
