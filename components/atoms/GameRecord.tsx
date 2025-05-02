import { useAllLevels } from "@/hooks/useAllLevels";
import { useIntl } from "@/hooks/useIntl";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import { getGameStats } from "@/utils/helperFns";
import { Game } from "@/utils/types";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { AppView } from "./AppView";

const intlDate = new Intl.DateTimeFormat("en-us", { dateStyle: "medium", timeStyle: "medium" });

export function GameRecord({ game }: { game: Game }) {
    const theme = useTheme();
    const { getLevel } = useAllLevels();

    const level = getLevel(game.levelId);
    const { intl } = useIntl();
    const { successes, mistakes, accuracy } = getGameStats(level, game.rounds, intl);

    if (!level) return null;

    return (
        <AppView style={s.container}>
            <AppView>
                <AppText>{level.name}</AppText>
            </AppView>

            <AppView>
                <AppText>{intlDate.format(game.timestamp)}</AppText>
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
                <AppText>{accuracy}</AppText>
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
