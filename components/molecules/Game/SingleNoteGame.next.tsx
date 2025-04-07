import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useAppStore } from "@/hooks/useAppStore";
import { useSoundContext } from "@/hooks/useSoundsContext";
import { Colors } from "@/utils/Colors";
import { Clef, GameState, GameType, KeySignature, NoteName, SoundEffect } from "@/utils/enums";
import { explodeNote, getPreviousPage, isNoteMatch, randomUID, wait } from "@/utils/helperFns";
import { getLevel } from "@/utils/levels";
import { decideNextRound, getPossibleNotesInLevel } from "@/utils/noteFns";
import { CurrentGame, GameScreenParams, Note, Round } from "@/utils/types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, useColorScheme } from "react-native";
import { Piano } from "../Piano/Piano";
import { SheetMusic } from "../SheetMusic";
import { TimerAndStatsDisplay } from "../TimeAndStatsDisplay";
import Tooltip from "react-native-walkthrough-tooltip";
import { AppText } from "@/components/atoms/AppText";
import AppButton from "@/components/atoms/AppButton";

const DELAY = 60;

export function SingleNoteGameComponent() {
    const theme = useColorScheme() ?? "light";
    const backgroundColor = Colors[theme].background;
    const { id, keySignature: keySig, previousPage: prevPage } = useLocalSearchParams() as unknown as GameScreenParams;

    const { currentGame, saveGameRecord, startNewGame, endGame, addNewRound } = useAppStore();
    const { playPianoNote, playSoundEfx } = useSoundContext();

    const rounds = currentGame?.rounds || [];
    const keySignature = decodeURIComponent(keySig) as KeySignature;
    const level = getLevel(id);
    const possibleNotes = getPossibleNotesInLevel(level, keySignature);
    const previousPage = getPreviousPage(String(prevPage), id);

    const [gameState, setGameState] = useState<GameState>(GameState.Idle);
    const [currNote, setCurrNote] = useState<Note>(
        decideNextRound<Round<GameType.Single>>(level, keySignature, possibleNotes)?.value ?? "c/3"
    );

    async function onPianoKeyPress(notename: NoteName) {
        if (gameState !== GameState.Idle) return;
        const { noteName, octave } = explodeNote(currNote);
        const attemptedNote = `${notename}/${+octave}` as Note;
        const success = isNoteMatch(notename, noteName);

        // console.log({ notename, currNote, attemptedNote, success });

        if (success) {
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

        const { value: nextNote } = decideNextRound<Round<GameType.Single>>(level, keySignature, possibleNotes, {
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

    const hasCompletedTour = useAppStore((state) => state.completedTours.game);
    const setTourCompleted = useAppStore((state) => state.setTourCompleted);

    const [tourStep, setTourStep] = useState(0);

    useEffect(() => {}, []);

    // start game
    useEffect(() => {
        const firstRound = decideNextRound<Round<GameType.Single>>(level, keySignature, possibleNotes)?.value ?? "c/3";
        const gameInfo: Partial<CurrentGame<GameType.Single>> = {
            levelId: id,
            timestamp: Date.now(),
            type: GameType.Single,
            rounds: [{ value: firstRound, attempt: null }],
            state: GameState.Idle,
        };
        startNewGame({ ...level, ...gameInfo } as CurrentGame<GameType.Single>);

        return () => {
            console.log("SINGLE NOTE GAME UNMOUNT!!!");
        };
    }, []);

    if (!level || !currentGame || !currNote || currentGame?.type !== GameType.Single) return null;

    const noteProps = { keys: [currNote], clef: level.clef, keySignature };

    return (
        <SafeAreaView style={[s.container, { backgroundColor }]}>
            <AppView style={s.top}>
                <TimerAndStatsDisplay onCountdownFinish={onCountdownFinish} levelId={id} />
                <BackLink to={previousPage} style={s.backLink} onPress={onBackLinkPress} />
            </AppView>

            <Tooltip
                isVisible={tourStep == 0}
                placement="center"
                content={
                    <AppView transparentBG style={{ alignItems: "center" }}>
                        <AppText>Essa é a tela principal</AppText>
                        <AppText>É aqui que o jogo acontece</AppText>
                        <AppButton
                            text="OK"
                            onPress={() => {
                                setTourStep(1);
                            }}
                        />
                    </AppView>
                }
            />
            <Tooltip
                isVisible={tourStep == 3}
                placement="center"
                content={
                    <AppView transparentBG style={{ alignItems: "center" }}>
                        <AppText>Toque o máximo de notas que puder</AppText>
                        <AppText>Antes que o tempo acabe!</AppText>
                        <AppText>Acumule pontos e avance pelas fases</AppText>
                        <AppText type="mdSemiBold">Bora começar?</AppText>
                        <AppButton
                            text="Vamos nessa!"
                            onPress={() => {
                                setTourStep(-1);
                                // setTourCompleted("game", true)
                            }}
                        />
                    </AppView>
                }
            />

            {currNote && (
                <Tooltip
                    isVisible={tourStep == 1}
                    placement="bottom"
                    tooltipStyle={{ zIndex: 2000, transform: [{ translateY: 0 }] }}
                    contentStyle={{ height: 132 }}
                    content={
                        <AppView transparentBG style={{ alignItems: "center" }}>
                            <AppText>
                                Essa é a Pauta musical. Notas musicais vão aparecer aqui. Por exemplo, temos uma nota{" "}
                                <AppText type="mdSemiBold">{explodeNote(currNote).noteName.toUpperCase()}</AppText>
                            </AppText>
                            <AppButton text="OK" onPress={() => setTourStep(2)} />
                        </AppView>
                    }
                >
                    <SingleNoteGameStage gameState={gameState} noteProps={noteProps} />
                </Tooltip>
            )}

            <Tooltip
                isVisible={tourStep == 2}
                placement="top"
                tooltipStyle={{ transform: [{ translateY: -220 }] }}
                contentStyle={{ height: 112 }}
                content={
                    <AppView transparentBG style={{ alignItems: "center" }}>
                        <AppText>O seu trabalho é tocar no Piano as notas que forem aparecerendo na Pauta</AppText>
                        <AppButton text="OK" onPress={() => setTourStep(3)} />
                    </AppView>
                }
            >
                <Piano keySignature={keySignature} onKeyPressed={onPianoKeyPress} onKeyReleased={onPianoKeyReleased} />
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
    const theme = useColorScheme() ?? "light";
    //   const backgroundColor = Colors[theme].background;
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

const s = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        position: "relative",
        paddingTop: 8,
        // borderWidth: 1,
        // borderColor: "blue",
    },
    top: {
        position: "relative",
        height: 130,
        // borderWidth: 1,
        // borderColor: "green",
    },
    backLink: {
        position: "absolute",
        top: -120,
        left: 0,
        zIndex: 20,
        // borderWidth: 1,
        // borderColor: "red",
    },
});
