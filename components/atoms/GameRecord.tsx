import { useAllLevels } from "@/hooks/useAllLevels";
import { useIntl } from "@/hooks/useIntl";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import { getGameStats, getIsGameWin } from "@/utils/helperFns";
import { Game } from "@/utils/types";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { AppView } from "./AppView";
import { GameStars } from "./GameStars";
import { useTranslation } from "@/hooks/useTranslation";

export function GameRecord({ game }: { game: Game }) {
    const theme = useTheme();
    const { t } = useTranslation();
    const { getLevel } = useAllLevels();

    const level = getLevel(game.levelId);
    const { intl, intlDate } = useIntl();

    const { isGameWin, stars } = getIsGameWin(game, level.winConditions);
    const { accuracy, attempts, successes, mistakes, hitsPerMinute, totalScore } = game.score;

    if (!level) return null;

    return (
        <AppView style={s.container}>
            <AppView>
                <AppText>{level.name}</AppText>
            </AppView>

            <AppView>
                <AppText style={{ color: Colors.dark.textMute, fontSize: 13 }}>
                    {intlDate.format(game.timestamp)}
                </AppText>
            </AppView>

            <AppView style={s.notesContainer}>
                {/* <AppText>{t(isGameWin ? "game.state.win" : "game.state.lose")}</AppText> */}

                <AppText>{intl.format(parseInt(String(totalScore)))} pts.</AppText>

                {isGameWin ? (
                    <GameStars stars={stars} color="gold" />
                ) : (
                    <AppText>
                        <Ionicons name="close-circle" color={Colors.dark.red} />
                    </AppText>
                )}
            </AppView>

            <AppView style={s.notesContainer}>
                <AppText>
                    <Ionicons name="checkmark" color={Colors[theme].green} />
                </AppText>
                <AppText>{successes}</AppText>

                <AppText>
                    <Ionicons name="close" color={Colors[theme].red} />
                </AppText>
                <AppText>{mistakes}</AppText>

                <AppText>
                    <Ionicons name="eye-outline" />
                </AppText>
                <AppText>{intl.format(accuracy * 100)}%</AppText>
            </AppView>
        </AppView>
    );
}

const s = StyleSheet.create({
    container: {
        padding: 12,
    },
    notesContainer: {
        flexDirection: "row",
        gap: 6,
    },
    gameNote: {
        flexDirection: "row",
        gap: 6,
        margin: 6,
    },
});
