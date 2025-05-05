import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { FadeIn } from "@/components/atoms/FadeIn";
import { useAllLevels } from "@/hooks/useAllLevels";
import { useAppStore } from "@/hooks/useAppStore";
import { useIntl } from "@/hooks/useIntl";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { ScoreManager, BEST_STREAK_BONUS, ACCURACY_BONUS, SPEED_BONUS } from "@/utils/ScoreManager";
import { testBorder } from "@/utils/styles";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";

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
        <AppView transparentBG style={s.scoreView}>
            <FadeIn delay={800} x={-100}>
                <View style={s.bonusView}>
                    <AppText style={s.bonusTitle}>Played Notes</AppText>
                    <AppText style={s.bonusTotal}>{intl.format(score.totalNoteScore)} pts</AppText>
                </View>
            </FadeIn>

            <FadeIn delay={1000} x={-100}>
                <View style={s.bonusView}>
                    <AppText style={s.bonusTitle}>Best Streak</AppText>
                    <AppText>
                        <AppText style={s.bonusDetail}>
                            {bestStreak} notes X {intl.format(BEST_STREAK_BONUS)} ={" "}
                        </AppText>
                        <AppText style={s.bonusTotal}>{intl.format(bestStreakBonus)} pts</AppText>
                    </AppText>
                </View>
            </FadeIn>

            <FadeIn delay={1200} x={-100}>
                <View style={s.bonusView}>
                    <AppText style={s.bonusTitle}>Speed Bonus</AppText>
                    <AppText>
                        <AppText style={s.bonusDetail}>
                            {intl.format(hitsPerMinute)} NpM X {SPEED_BONUS} ={" "}
                        </AppText>
                        <AppText style={s.bonusTotal}>{intl.format(speedBonus)} pts</AppText>
                    </AppText>
                </View>
            </FadeIn>

            <FadeIn delay={1400} x={-100}>
                <View style={s.bonusView}>
                    <AppText style={s.bonusTitle}>Accuracy Bonus</AppText>
                    <AppText>
                        <AppText style={s.bonusDetail}>
                            {intl.format(accuracy * 100)}% X {intl.format(ACCURACY_BONUS)} ={" "}
                        </AppText>
                        <AppText style={s.bonusTotal}>{intl.format(accuracyBonus)} pts</AppText>
                    </AppText>
                </View>
            </FadeIn>

            {perfectAccuracyBonus ? (
                <FadeIn delay={1500} x={-100}>
                    <View style={s.bonusView}>
                        <AppText style={s.bonusTitle}>Perfect Accuracy Bonus</AppText>
                        <AppText style={s.bonusTotal}>{intl.format(perfectAccuracyBonus)} pts</AppText>
                    </View>
                </FadeIn>
            ) : null}

            <FadeIn delay={1600} x={50} duration={250} y={0}>
                <AppView transparentBG style={{ ...s.line, backgroundColor: Colors.dark.text }} />
            </FadeIn>

            <AppView transparentBG style={{ alignItems: "center" }}>
                <FadeIn delay={1600} x={-50} y={0}>
                    <AppText type="default">{t("game.TOTAL_SCORE")}</AppText>
                </FadeIn>
                <FadeIn delay={1800} x={-50} y={0}>
                    <AppText style={{ fontFamily: "Grotesque", fontSize: 24, lineHeight: 36 }}>
                        {intl.format(totalScore)} pts
                    </AppText>
                </FadeIn>
            </AppView>
        </AppView>
    );
}

const s = StyleSheet.create({
    separator: {
        height: 12,
    },

    // line: { height: 1, width: 326, marginVertical: 12 },
    line: { height: StyleSheet.hairlineWidth, width: 326, margin: 20 },
    scoreView: {
        width: 326,
        // paddingVertical: 16,
        justifyContent: "center",
        alignItems: "center",
        // ...testBorder(),
    },
    bonusView: {
        width: 326,
        flexDirection: "row",
        justifyContent: "space-between",
        // ...testBorder("green"),
    },
    bonusTitle: {
        color: Colors.dark.text,
    },
    bonusDetail: {
        color: Colors.dark.textMute,
    },
    bonusTotal: {
        fontFamily: "Grotesque",
    },
});

{
    /* <AppView transparentBG style={{ alignItems: "flex-end", width: 120 }}>
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
                </AppView> */
}
