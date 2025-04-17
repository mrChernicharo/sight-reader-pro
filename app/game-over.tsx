import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { FadeIn } from "@/components/atoms/FadeIn";
import { Confetti } from "@/components/molecules/Game/Confetti";
import { GameStatsDisplay } from "@/components/molecules/GameStatsDisplay/GameStatsDisplay";
import { useAppStore } from "@/hooks/useAppStore";
import { useIntl } from "@/hooks/useIntl";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { getGameStats, pickKeySignature } from "@/utils/helperFns";
import { ALL_LEVELS, getLevel } from "@/utils/levels";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GameOverScreen() {
    const { intl } = useIntl();
    const { t } = useTranslation();
    const theme = useTheme();
    const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");
    const { games, currentGame, endGame } = useAppStore();

    const level = getLevel(currentGame?.levelId ?? "basics 01");
    const isPracticeLevel = level?.id && ["treble-practice", "bass-practice"].includes(level.id);
    const lastGame = games.at(-1);

    const { attempts, successes, mistakes, accuracy, score, hasWon, hitsPerMinute } = getGameStats(
        level,
        currentGame?.rounds ?? [],
        intl
    );
    const emoji = hasWon ? " 🎉 " : " 😩 ";
    const msg = t(hasWon ? "game.state.win" : "game.state.lose");

    const [btnsEnabled, setBtnsEnabled] = useState(false);

    function goToNextLevel() {
        endGame();
        const nextLevel = ALL_LEVELS.find((lvl) => lvl.clef === level.clef && lvl.index === level.index + 1);
        if (nextLevel) {
            router.push({
                pathname: "/level-details/[id]",
                params: { id: nextLevel.id, clef: nextLevel.clef },
            });
        } else {
            console.log("NO MORE LEVELS. ZEROU O GAME!");
        }
    }
    function playAgain() {
        endGame();
        router.push({
            pathname: "/game-level/[id]",
            params: {
                id: level.id,
                keySignature: pickKeySignature(level),
                previousPage: "/level-details",
            },
        });
    }
    function goToLevelSelection() {
        endGame();
        router.push({
            pathname: "/level-selection",
        });
    }

    // useEffect(() => {
    //   console.log("<<< Game Over >>>", { attempts, successes, mistakes, accuracy, score, hasWon, hitsPerMinute });
    // }, [attempts, successes, mistakes, accuracy, score, hasWon, hitsPerMinute]);

    useEffect(() => {
        setTimeout(() => {
            setBtnsEnabled(true);
            console.log("setBtnsEnabled:::::");
        }, 3800);
    }, []);

    if (!level || !lastGame) return null;
    if (!currentGame || !currentGame?.rounds?.length) return null;

    return (
        <SafeAreaView style={[s.container, { backgroundColor }]}>
            <ScrollView
                style={{ width: "100%" }}
                ref={(ref) => {
                    if (ref) setTimeout(ref.scrollToEnd, 2200);
                }}
            >
                <AppView style={{ minHeight: Dimensions.get("screen").height - 60 }}>
                    {hasWon ? (
                        <>
                            <Confetti x={-120} duration={2000} />
                            <Confetti x={0} y={-50} duration={2000} delay={500} />
                            <Confetti x={120} duration={2000} delay={1000} />
                        </>
                    ) : null}

                    <AppView transparentBG style={[s.messageContainer]}>
                        <AppText type="title">{msg + emoji}</AppText>

                        <GameStatsDisplay level={level} hitsPerMinute={hitsPerMinute} />

                        {hasWon ? <Confetti x={0} y={-169} duration={2000} delay={2200} height={250} /> : null}
                    </AppView>

                    <AppView style={[s.btnsContainer, { pointerEvents: btnsEnabled ? "auto" : "none" }]}>
                        {isPracticeLevel ? (
                            <>
                                <FadeIn y={50} x={0} delay={2200}>
                                    <Link asChild href={"/practice"}>
                                        <AppButton text={"OK!"} />
                                    </Link>
                                </FadeIn>
                            </>
                        ) : (
                            <>
                                {hasWon ? (
                                    <FadeIn y={50} x={0} delay={2200} style={{ paddingVertical: 24 }}>
                                        <AppButton text={t("game.goTo.next")} onPress={goToNextLevel} />
                                    </FadeIn>
                                ) : null}

                                <FadeIn y={50} x={0} delay={2400}>
                                    <AppButton
                                        text={t("game.goTo.again")}
                                        style={{ ...(hasWon && { backgroundColor: "transparent" }) }}
                                        textStyle={{ ...(hasWon && { color: Colors[theme].text }) }}
                                        onPress={playAgain}
                                    />
                                </FadeIn>

                                <FadeIn y={50} x={0} delay={2600}>
                                    <AppButton
                                        text={t("game.goTo.levelSelection")}
                                        style={{ backgroundColor: "transparent", marginBottom: 36 }}
                                        textStyle={{ color: "gray" }}
                                        onPress={goToLevelSelection}
                                    />
                                </FadeIn>
                            </>
                        )}
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
        // paddingBottom: 64,
        // paddingTop: 12,
        minHeight: Dimensions.get("screen").height,
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
});
