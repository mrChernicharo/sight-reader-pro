import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useAppStore } from "@/hooks/useAppStore";
import { useSoundContext } from "@/hooks/useSoundsContext";
import { Colors } from "@/utils/Colors";
import { Clef, GameState, GameType, KeySignature, NoteName, SoundEffect } from "@/utils/enums";
import { explodeNote, getLevelHintCount, getPreviousPage, isNoteMatch, randomUID, wait } from "@/utils/helperFns";
import { getLevel } from "@/utils/levels";
import { decideNextRound, getPossibleNotesInLevel } from "@/utils/noteFns";
import { CurrentGame, GameScreenParams, Note, Round, SingleNoteRound } from "@/utils/types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Piano } from "../Piano/Piano";
import { SheetMusic } from "../SheetMusic";
import { TimerAndStatsDisplay } from "../TimeAndStatsDisplay";
import Tooltip from "react-native-walkthrough-tooltip";
import { AppText } from "@/components/atoms/AppText";
import AppButton from "@/components/atoms/AppButton";
import { useTranslation } from "@/hooks/useTranslation";
import { TooltipTextLines } from "@/components/atoms/TooltipTextLines";
import { WALKTHROUGH_TOP_ADJUSTMENT } from "@/utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { STYLES } from "@/utils/styles";

const DELAY = 60;

const s = STYLES.game;

export function SingleNoteGameComponent() {
    const { t } = useTranslation();
    const theme = useTheme();
    const backgroundColor = Colors[theme].bg;

    const { id, keySignature: keySig, previousPage: prevPage } = useLocalSearchParams() as unknown as GameScreenParams;
    const previousPage = getPreviousPage(String(prevPage), id);

    const { currentGame, saveGameRecord, startNewGame, endGame, addNewRound, updatePlayedNotes } = useAppStore();
    const { playPianoNote, playSoundEfx } = useSoundContext();

    const hasCompletedTour = useAppStore((state) => state.completedTours.game);
    const setTourCompleted = useAppStore((state) => state.setTourCompleted);

    const [tourStep, setTourStep] = useState(-1);

    const rounds = currentGame?.rounds || [];
    const keySignature = decodeURIComponent(keySig) as KeySignature;
    const level = getLevel(id);
    const possibleNotes = getPossibleNotesInLevel(level);
    const hintCount = getLevelHintCount(level.skillLevel);

    const [gameState, setGameState] = useState<GameState>(GameState.Idle);
    const [currNote, setCurrNote] = useState<Note>(
        decideNextRound<SingleNoteRound>(level, keySignature, possibleNotes)?.value ?? "c/3"
    );

    async function onPianoKeyPress(notename: NoteName) {
        if (gameState !== GameState.Idle) return;
        const { noteName, octave } = explodeNote(currNote);
        const attemptedNote = `${notename}/${+octave}` as Note;
        const success = isNoteMatch(notename, noteName);

        // console.log({ notename, currNote, attemptedNote, success });

        if (success) {
            updatePlayedNotes(attemptedNote);
            playPianoNote(attemptedNote);
            setGameState(GameState.Success);
        } else {
            playSoundEfx(SoundEffect.WrongAnswer);
            playPianoNote(attemptedNote);
            playPianoNote(currNote);
            setGameState(GameState.Mistake);
        }

        await wait(DELAY);

        if (!currentGame || currentGame.type !== GameType.Single) return;

        addNewRound({ value: currNote, attempt: attemptedNote });

        const { value: nextNote } = decideNextRound<SingleNoteRound>(level, keySignature, possibleNotes, {
            value: currNote,
            attempt: attemptedNote,
        })!;

        if (nextNote) setCurrNote(nextNote);

        setGameState(GameState.Idle);
    }

    function onPianoKeyReleased(notename: NoteName) {}

    const onCountdownFinish = useCallback(async () => {
        setGameState(GameState.Idle);
        saveGameRecord({
            id: randomUID(),
            levelId: id,
            rounds,
            timestamp: Date.now(),
            type: GameType.Single,
            durationInSeconds: level.durationInSeconds,
        });
        router.replace({ pathname: "/game-over" });
    }, [level, id, rounds]);

    const onBackLinkPress = () => {
        endGame(String(prevPage));
    };

    // start game
    useEffect(() => {
        // if (!level || !currNote || currentGame?.type !== GameType.Single) return;
        const firstRound = decideNextRound<SingleNoteRound>(level, keySignature, possibleNotes)?.value ?? "c/3";
        const gameInfo: Partial<CurrentGame> = {
            levelId: id,
            timestamp: Date.now(),
            type: GameType.Single,
            rounds: [{ value: firstRound, attempt: null }],
            state: GameState.Idle,
        };
        startNewGame({ ...level, ...gameInfo } as CurrentGame);

        return () => {
            console.log("SINGLE NOTE GAME UNMOUNT!!!");
        };
    }, []);

    useEffect(() => {
        setTimeout(() => setTourStep(0), 200);
    }, []);

    useEffect(() => {
        console.log("<SingleNoteGame>", { hasCompletedTour, tourStep });
    }, [hasCompletedTour, tourStep]);

    if (!level || !currentGame || !currNote || currentGame?.type !== GameType.Single) return null;

    const noteProps = { keys: [currNote], clef: level.clef, keySignature };
    const tourTextProps = { forceBlackText: true, style: { textAlign: "center" } as StyleProp<TextStyle> };

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
                <BackLink to={previousPage} style={s.backLink} onPress={onBackLinkPress} />
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
                    <SingleNoteGameStage gameState={gameState} noteProps={noteProps} />
                </Tooltip>
            )}

            <Tooltip
                isVisible={!hasCompletedTour && tourStep == 2}
                placement="top"
                topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                tooltipStyle={{ transform: [{ translateY: -60 }] }}
                contentStyle={{}}
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
    gameState,
    noteProps,
}: {
    gameState: GameState;
    noteProps: {
        keys: Note[];
        clef: Clef;
        keySignature: KeySignature;
    };
}) {
    const theme = useTheme();
    //   const backgroundColor = Colors[theme].bg;
    return (
        <>
            {gameState === GameState.Idle ? <SheetMusic.SingleNote {...noteProps} /> : null}

            {gameState === GameState.Success ? (
                <SheetMusic.SingleNote {...noteProps} noteColor={Colors[theme].green} />
            ) : null}
            {gameState === GameState.Mistake ? (
                <SheetMusic.SingleNote {...noteProps} noteColor={Colors[theme].red} />
            ) : null}
        </>
    );
}
