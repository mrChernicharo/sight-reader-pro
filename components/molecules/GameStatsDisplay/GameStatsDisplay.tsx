import { FadeIn } from "@/components/atoms/FadeIn";
import { useAppStore } from "@/hooks/useAppStore";
import { useIntl } from "@/hooks/useIntl";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { getGameStats, getIsPracticeLevel } from "@/utils/helperFns";
import { GameScreenParams, Level, LevelScore } from "@/utils/types";
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
import { testBorder } from "@/utils/styles";

export type GameStatsDisplayProps = {
    level: Level;
};

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

const s = StyleSheet.create({
    container: {
        // borderWidth: 1,
        // borderColor: "#cacacaca",
    },
    row: {
        flexDirection: "row",
        // justifyContent: "space-between",
        justifyContent: "center",
        // ...testBorder("green"),
    },
    rowItem: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingTop: 4,
        // minWidth: 100,
        // borderWidth: 1,
        // borderColor: "#444",
        // ...testBorder("blue"),
    },
    separator: {
        height: 12,
    },
});
