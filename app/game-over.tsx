import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { FadeIn } from "@/components/atoms/FadeIn";
import { Confetti } from "@/components/molecules/Game/Confetti";
import { GameStatsDisplay } from "@/components/molecules/GameStatsDisplay/GameStatsDisplay";
import { ScoreDisplay } from "@/components/molecules/GameStatsDisplay/ScoreDisplay";
import { useAllLevels } from "@/hooks/useAllLevels";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { getIsGameWinAndStars, getIsPracticeLevel } from "@/utils/helperFns";
import { Link, router } from "expo-router";
import { useCallback } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GameOverScreen() {
    // const { intl } = useIntl();
    const { t } = useTranslation();
    const { allLevels, getLevel, unloadPracticeLevel } = useAllLevels();
    const theme = useTheme();
    const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");
    const { games } = useAppStore();
    // const { previousPage } = useLocalSearchParams() as unknown as GameScreenParams;

    const lastGame = games.at(-1);

    const level = getLevel(lastGame?.levelId || "");
    const isPracticeLevel = getIsPracticeLevel(lastGame?.levelId);
    const { isGameWin, stars } = getIsGameWinAndStars(lastGame, level.winConditions);

    const headingText = t(
        isPracticeLevel ? "game.state.practiceEnd" : isGameWin ? "game.state.win" : "game.state.lose"
    );

    const btnTextStyle = { color: Colors[theme].text };

    const goToNextLevel = useCallback(() => {
        const nextLevel = allLevels.find((lvl) => lvl.clef === level.clef && lvl.index === level.index + 1);
        if (nextLevel) {
            router.replace({ pathname: "/level-details/[id]", params: { id: nextLevel.id, clef: nextLevel.clef } });
        } else {
            console.log("NO MORE LEVELS. ZEROU O GAME!");
        }
    }, [level.clef, level.index]);

    const playAgain = useCallback(() => {
        router.replace({
            pathname: "/game-level/[id]",
            params: { id: level.id, keySignature: level.keySignature, previousPage: "/level-details" },
        });
    }, [level.keySignature]);

    const goToLevelSelection = useCallback(() => {
        router.back();
    }, []);

    const goToMainMenu = useCallback(() => {
        router.dismissTo({ pathname: "/" });
    }, []);

    // useEffect(() => {
    //     return () => {
    //         // console.log("GAME OVER UNMOUNT!!!!");
    //         if (previousPage == "/practice") {
    //             // console.log("leaving practice game");
    //             unloadPracticeLevel();
    //         }
    //         endGame();
    //     };
    // }, []);

    return (
        <SafeAreaView style={{ ...s.container, backgroundColor }}>
            <ScrollView
                style={{ width: "100%" }}
                ref={(ref) => {
                    if (ref) setTimeout(ref.scrollToEnd, 2400);
                }}
            >
                <AppView style={{ minHeight: Dimensions.get("window").height - (isPracticeLevel ? 60 : 0) }}>
                    {isGameWin ? (
                        <>
                            <Confetti x={-120} duration={2000} />
                            <Confetti x={0} y={-50} duration={2000} delay={500} />
                            <Confetti x={120} duration={2000} delay={1000} />
                        </>
                    ) : null}

                    <AppView transparentBG style={s.messageContainer}>
                        <AppText style={{ fontFamily: "Grotesque", fontSize: 28, lineHeight: 40 }}>
                            {headingText}
                        </AppText>

                        <GameStatsDisplay level={level} />

                        <FadeIn delay={1000} x={50} y={0} duration={250}>
                            <AppView transparentBG style={{ ...s.line, backgroundColor: Colors.dark.text }} />
                        </FadeIn>

                        <ScoreDisplay stars={isPracticeLevel ? 0 : stars} />

                        {isGameWin ? (
                            <>
                                <Confetti x={0} y={-169} duration={2000} delay={2200} height={250} />
                            </>
                        ) : null}
                    </AppView>

                    <AppView style={s.btnsContainer}>
                        {isPracticeLevel ? (
                            <>
                                <FadeIn y={50} x={0} delay={2200} style={{ paddingTop: 12 }}>
                                    <AppButton text={t("game.goTo.again")} onPress={playAgain} />
                                </FadeIn>

                                <FadeIn y={50} x={0} delay={2400}>
                                    <Link asChild dismissTo href={"/practice"}>
                                        <AppButton
                                            text={t("game.goTo.practice")}
                                            style={{ ...s.btn, borderColor: Colors[theme].text }}
                                            textStyle={btnTextStyle}
                                        />
                                    </Link>
                                </FadeIn>
                            </>
                        ) : (
                            <>
                                {isGameWin ? (
                                    <>
                                        <FadeIn y={50} x={0} delay={2200} style={{ paddingTop: 12 }}>
                                            <AppButton text={t("game.goTo.next")} onPress={goToNextLevel} />
                                        </FadeIn>
                                    </>
                                ) : null}

                                <FadeIn y={50} x={0} delay={2400}>
                                    <AppButton
                                        text={t("game.goTo.again")}
                                        style={{ backgroundColor: Colors[theme].accent }}
                                        onPress={playAgain}
                                    />
                                </FadeIn>

                                <FadeIn y={50} x={0} delay={2600}>
                                    <AppButton
                                        text={t("game.goTo.levelSelection")}
                                        style={{ ...s.btn, borderColor: Colors[theme].text }}
                                        textStyle={btnTextStyle}
                                        onPress={goToLevelSelection}
                                    />
                                </FadeIn>
                            </>
                        )}
                        <FadeIn y={50} x={0} delay={2800}>
                            <AppButton
                                text={t("game.goTo.mainMenu")}
                                style={{ ...s.btn, borderColor: "transparent", marginBottom: 36 }}
                                textStyle={{ color: "gray" }}
                                onPress={goToMainMenu}
                            />
                        </FadeIn>
                    </AppView>
                </AppView>
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
    },
    messageContainer: {
        paddingVertical: 64,
        gap: 16,
        justifyContent: "center",
        alignItems: "center",
        // borderWidth: 1,
    },
    btnsContainer: {
        // flexDirection: "row",
        paddingHorizontal: 36,
        gap: 12,
    },
    bigEmoji: {
        fontSize: 64,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        lineHeight: 90,
    },
    btn: {
        backgroundColor: "transparent",
        borderWidth: StyleSheet.hairlineWidth,
    },
    line: { height: StyleSheet.hairlineWidth, width: 326, margin: 0 },
});
