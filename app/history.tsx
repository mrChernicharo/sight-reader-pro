import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { GameRecord } from "@/components/atoms/GameRecord";
import { useAppStore } from "@/hooks/useAppStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
    const { t } = useTranslation();
    const { username = "user", games } = useAppStore();
    const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");
    // console.log("games ::: ", games);
    if (!games) return null;

    return (
        <SafeAreaView style={{ ...s.container, backgroundColor }}>
            <AppView style={s.top}>
                <AppView style={{ position: "absolute", left: 10, top: 6 }}>
                    <BackLink />
                </AppView>
                <AppText type="subtitle">{t("history.title")}</AppText>

                <AppView>
                    <AppText type="md">{username}</AppText>
                </AppView>
            </AppView>

            {/* <AppView> */}

            <FlatList
                data={games}
                keyExtractor={(game) => game.id}
                renderItem={({ item: game }) => <GameRecord game={game} />}
                style={s.flatlist}
            />
            {/* </AppView> */}
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        width: "100%",
        minHeight: "100%",
    },
    top: {
        position: "relative",
        width: "100%",
        alignItems: "center",
    },
    inputContainer: {
        width: "100%",
        gap: 12,
    },
    flatlist: {
        flex: 1,
        // borderWidth: 2,
        // borderColor: "#818181",
        // borderStyle: "dashed",
    },
});
