import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { Colors } from "@/utils/Colors";
import { getGameStats, getIsPracticeLevel } from "@/utils/helperFns";
import { GameStatsDisplayProps, LevelScore } from "@/utils/types";
import { useAppStore } from "@/hooks/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTransition } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useIntl } from "@/hooks/useIntl";
import { BackLink } from "@/components/atoms/BackLink";
import { testBorder } from "@/utils/styles";

export function GameStatsDisplaySimple({ level, hitsPerMinute }: GameStatsDisplayProps) {
    const theme = useTheme();
    const { t } = useTranslation();
    const { intl } = useIntl();

    const { currentGame } = useAppStore();

    const isPracticeLevel = getIsPracticeLevel(currentGame?.levelId);
    const backLinkTo = isPracticeLevel ? "/practice" : "/level-selection";

    if (!currentGame?.rounds || currentGame.rounds.length === 0) return <></>;

    const { accuracy, attempts, successes, mistakes, score: gs } = getGameStats(level, currentGame?.rounds, intl);
    const score = gs as LevelScore;

    // useEffect(() => {
    //   console.log({ attempts, hitsPerMinute, elapsed, theme });
    // }, [attempts, hitsPerMinute, elapsed, theme]);

    return (
        <AppView style={{ ...s.container, backgroundColor: "rgba(0, 0, 0, 0)" }}>
            <BackLink to={backLinkTo} wrapperStyle={{ top: -2, left: -24 }} />

            <AppView style={{ ...s.row, ...s.score, backgroundColor: "rgba(0, 0, 0, 0)" }}>
                <AppText style={{ fontFamily: "Grotesque", fontSize: 20, lineHeight: 28 }}>
                    {t("game.score")} {intl.format(score.value)}
                </AppText>
            </AppView>

            <AppView style={{ width: 220, marginHorizontal: "auto" }}>
                <AppView style={{ ...s.row, backgroundColor: "rgba(0, 0, 0, 0)" }}>
                    <AppView style={s.rowItem}>
                        <AppText>
                            <Ionicons name="musical-notes-outline" />
                        </AppText>
                        <AppText>{attempts}</AppText>
                    </AppView>

                    <AppView style={s.rowItem}>
                        <AppText>
                            <Ionicons name="checkmark" color={Colors[theme].green} />
                        </AppText>
                        <AppText>{successes}</AppText>
                    </AppView>

                    <AppView style={s.rowItem}>
                        <AppText>
                            <Ionicons name="close-outline" color={Colors[theme].red} />
                        </AppText>
                        <AppText>{mistakes}</AppText>
                    </AppView>
                </AppView>

                <AppView style={{ ...s.row, backgroundColor: "rgba(0, 0, 0, 0)" }}>
                    <AppView style={s.rowItem}>
                        <AppText style={{ width: 20 }}>
                            <Ionicons name="eye-outline" />
                        </AppText>
                        <AppText>{accuracy}</AppText>
                    </AppView>

                    <AppView style={{ ...s.rowItem, width: 150, justifyContent: "flex-end" }}>
                        <AppText>
                            <Ionicons name="time-outline" />
                        </AppText>
                        <AppText> {t("game.NpM")} </AppText>
                        <AppText numberOfLines={1} style={{ textAlign: "right" }}>
                            {!hitsPerMinute ? "--" : hitsPerMinute.toFixed(2)}
                        </AppText>
                    </AppView>
                </AppView>
            </AppView>
        </AppView>
    );
}

const s = StyleSheet.create({
    container: {},
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rowItem: {
        minWidth: 42,
        justifyContent: "space-between",
        alignItems: "baseline",
        flexDirection: "row",
    },
    score: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
});
