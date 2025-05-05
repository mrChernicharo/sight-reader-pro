import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { FadeIn } from "@/components/atoms/FadeIn";
import { useAllLevels } from "@/hooks/useAllLevels";
import { useAppStore } from "@/hooks/useAppStore";
import { useIntl } from "@/hooks/useIntl";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { ScoreManager, BEST_STREAK_BONUS, ACCURACY_BONUS, SPEED_BONUS } from "@/utils/ScoreManager";
import { useTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export function ScoreDisplay() {
    const { intl } = useIntl();
    const { t } = useTranslation();
    const { getLevel } = useAllLevels();
    const theme = useTheme();
    // const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");
    const { games } = useAppStore();

    const lastGame = games.at(-1);
    const level = getLevel(lastGame?.levelId!);

    // const isPracticeLevel = getIsPracticeLevel(lastGame?.levelId);

    const score = ScoreManager.getScore();
    const finalScore = ScoreManager.getFinalScore(level.durationInSeconds);
    const { accuracy, attempts, bestStreak, currNoteValue, successes, mistakes, currStreak, totalNoteScore } = score;
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

            <AppText>Notes Score {intl.format(score.totalNoteScore)}</AppText>

            <AppText>
                Best Streak Bonus: {bestStreak} X {intl.format(BEST_STREAK_BONUS)} = {intl.format(bestStreakBonus)}
            </AppText>

            <AppText>
                Accuracy Bonus {intl.format(ACCURACY_BONUS)} X {intl.format(accuracy)} = {intl.format(accuracyBonus)}
            </AppText>

            {perfectAccuracyBonus ? (
                <AppText>Perfect Accuracy Bonus {intl.format(perfectAccuracyBonus)}</AppText>
            ) : null}

            <AppText>
                Speed Bonus {hitsPerMinute} X {SPEED_BONUS} = {intl.format(speedBonus)}
            </AppText>

            <FadeIn delay={1000} x={50} duration={250} y={0}>
                <AppView transparentBG style={{ ...s.line, backgroundColor: Colors.dark.text }} />
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
