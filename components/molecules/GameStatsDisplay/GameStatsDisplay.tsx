import { FadeIn } from "@/components/atoms/FadeIn";
import { useAppStore } from "@/hooks/useAppStore";
import { useIntl } from "@/hooks/useIntl";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { getGameStats, getIsPracticeLevel } from "@/utils/helperFns";
import { GameScreenParams, GameStatsDisplayProps, LevelScore } from "@/utils/types";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { StyleSheet } from "react-native";
import { AppText } from "../../atoms/AppText";
import { AppView } from "../../atoms/AppView";
import { ScoreManager } from "@/utils/ScoreManager";
import { useAllLevels } from "@/hooks/useAllLevels";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams } from "expo-router";
import {
    HIT_BASE_SCORE,
    MAX_HIT_SCORE,
    STREAK_SCORE,
    BEST_STREAK_BONUS,
    ACCURACY_BONUS,
    SPEED_BONUS,
    PERFECT_ACCURACY_BONUS,
} from "@/utils/ScoreManager";

export function GameStatsDisplay({ level }: GameStatsDisplayProps) {
    const theme = useTheme();
    const { intl } = useIntl();
    const { t } = useTranslation();

    const { currentGame } = useAppStore();

    if (!currentGame?.rounds || currentGame.rounds.length === 0) return <></>;

    const { accuracy, attempts, successes, mistakes, hitsPerMinute } = getGameStats(level, currentGame?.rounds, intl);
    const notesPerMinute = !hitsPerMinute ? "--" : intl.format(hitsPerMinute ?? 0);

    const score = ScoreManager.getScore();

    // useEffect(() => {
    //   console.log({ attempts, hitsPerMinute, elapsed, theme });
    // }, [attempts, hitsPerMinute, elapsed, theme]);

    return (
        <AppView transparentBG style={s.container}>
            <AppView transparentBG style={s.separator} />

            <AppView transparentBG style={s.row}>
                <FadeIn y={50} x={0}>
                    <AppView transparentBG style={s.rowItem}>
                        <AppText>
                            <Ionicons name="time-outline" />
                            &nbsp;{t("game.NotesPerMin")}
                        </AppText>
                        <AppView>
                            <AppText type="mdSemiBold">{notesPerMinute}</AppText>
                        </AppView>
                    </AppView>
                </FadeIn>

                <FadeIn y={50} x={0}>
                    <AppView transparentBG style={s.rowItem}>
                        <AppText>
                            <Ionicons name="eye-outline" />
                            &nbsp;{t("game.accuracy")}
                        </AppText>
                        <AppView>
                            <AppText type="mdSemiBold">{accuracy}</AppText>
                        </AppView>
                    </AppView>
                </FadeIn>
            </AppView>

            <AppView transparentBG style={s.row}>
                <FadeIn y={50} x={0}>
                    <AppView transparentBG style={s.rowItem}>
                        <AppText style={{ width: "100%" }} numberOfLines={1}>
                            <Ionicons name="musical-notes-outline" />
                            &nbsp;{t("game.attempts")}
                        </AppText>
                        <AppView>
                            <AppText type="mdSemiBold">{attempts}</AppText>
                        </AppView>
                    </AppView>
                </FadeIn>

                <FadeIn y={50} x={0}>
                    <AppView transparentBG style={s.rowItem}>
                        <AppText style={{ width: "100%" }}>
                            <Ionicons name="checkmark" color={Colors[theme].green} />
                            &nbsp;{t("game.successes")}
                        </AppText>

                        <AppView>
                            <AppText type="mdSemiBold">{successes}</AppText>
                        </AppView>
                    </AppView>
                </FadeIn>

                <FadeIn y={50} x={0}>
                    <AppView transparentBG style={s.rowItem}>
                        <AppText style={{ width: "100%" }}>
                            <Ionicons name="close-outline" color={Colors[theme].red} />
                            &nbsp;{t("game.mistakes")}
                        </AppText>

                        <AppView>
                            <AppText type="mdSemiBold">{mistakes}</AppText>
                        </AppView>
                    </AppView>
                </FadeIn>
            </AppView>
        </AppView>
    );
}

export function ScoreDisplay() {
    const { intl } = useIntl();
    const { t } = useTranslation();
    const { getLevel } = useAllLevels();
    const theme = useTheme();
    // const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");
    const { games } = useAppStore();

    const lastGame = games.at(-1);
    const level = getLevel(lastGame?.levelId!);

    // const level = getLevel(lastGame?.levelId || "");
    // const isPracticeLevel = getIsPracticeLevel(lastGame?.levelId);
    // const { hasWon } = getGameStats(level, lastGame?.rounds ?? [], intl);

    const score = ScoreManager.getScore();
    const finalScore = ScoreManager.getFinalScore(level.durationInSeconds);
    const { accuracy, attemptCount, bestStreak, currNoteScore, hitCount, mistakeCount, streak, totalNoteScore } = score;
    const { bestStreakBonus, accuracyBonus, perfectAccuracyBonus, speedBonus, totalScore, hitsPerMinute } = finalScore;

    console.log({ finalScore });

    return (
        <AppView transparentBG style={s.score}>
            {/* <AppView transparentBG style={{ alignItems: "flex-end", width: 120 }}>
                    <FadeIn delay={0} x={50} duration={250} y={0}>
                        <AppText style={{ color: Colors[theme].textMute }}>
                            <AppText style={{ fontWeight: 900 }}>{score.hits} </AppText>
                            <AppText>{t(score.hits == 1 ? "game.hit" : "game.hits")}</AppText>
                        </AppText>
                    </FadeIn>
                    <FadeIn delay={300} x={50} duration={250} y={0}>
                        <AppText style={{ color: Colors[theme].textMute }}>
                            <AppText style={{ fontWeight: 900 }}>{intl.format(score.hitScore)} </AppText>
                            <AppText>pts</AppText>
                        </AppText>
                        <AppText style={{ position: "absolute", left: -20, top: 0, color: Colors[theme].textMute }}>
                            X
                        </AppText>
                    </FadeIn>
                    <FadeIn delay={600} x={50} duration={250} y={0}>
                        <AppText style={{ color: Colors[theme].textMute }}>
                            <AppText style={{ fontWeight: 900 }}>{intl.format(score.multiplier)} </AppText>
                            <AppText>mult</AppText>
                        </AppText>
                        <AppText style={{ position: "absolute", left: -20, top: 0, color: Colors[theme].textMute }}>
                            X
                        </AppText>
                    </FadeIn>
                </AppView> */}

            <AppText>totalNoteScore {intl.format(score.totalNoteScore)}</AppText>
            <AppText>
                bestStreakBonus: {bestStreak} X {intl.format(BEST_STREAK_BONUS)} = {intl.format(bestStreakBonus)}
            </AppText>
            <AppText>
                accuracyBonus {intl.format(ACCURACY_BONUS)} X {intl.format(accuracy)} = {intl.format(accuracyBonus)}
            </AppText>

            <>{perfectAccuracyBonus && <AppText>perfectAccuracyBonus {intl.format(perfectAccuracyBonus)}</AppText>}</>

            <AppText>
                speedBonus {hitsPerMinute} X {SPEED_BONUS} = {intl.format(speedBonus)}
            </AppText>
            {/* <AppText>{bestStreakBonus}</AppText> */}

            <FadeIn delay={1000} x={50} duration={250} y={0}>
                <AppView transparentBG style={{ ...s.line, backgroundColor: Colors[theme].text }} />
            </FadeIn>

            <AppView transparentBG style={{ alignItems: "center" }}>
                <FadeIn delay={1500} x={-50} y={0}>
                    <AppText type="default">{t("game.TOTAL_SCORE")}</AppText>
                </FadeIn>
                <FadeIn delay={1600} x={-50} y={0}>
                    <AppText style={{ fontFamily: "Grotesque", fontSize: 24, lineHeight: 36 }}>
                        {intl.format(totalScore)}
                    </AppText>
                </FadeIn>
            </AppView>
        </AppView>
    );
}

const s = StyleSheet.create({
    container: {
        // borderWidth: 1,
        // borderColor: "#cacacaca",
    },
    row: {
        flexDirection: "row",
        // justifyContent: "space-between",
        justifyContent: "center",
    },
    rowItem: {
        alignItems: "center",
        padding: 8,
        minWidth: 100,
        // borderWidth: 1,
        // borderColor: "#444",
    },
    separator: {
        height: 12,
    },
    line: { height: 1, width: 160, marginVertical: 12 },
    score: {
        paddingTop: 24,
        justifyContent: "center",
        alignItems: "center",
    },
});
