import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { GameRecord } from "@/components/atoms/GameRecord";
import { useAppStore } from "@/hooks/useAppStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { Dimensions, StyleSheet, useColorScheme } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
    const { t } = useTranslation();
    const { username, games } = useAppStore();
    const theme = useColorScheme() ?? "light";
    const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");
    // console.log("games ::: ", games);
    if (!games) return null;

    return (
        <SafeAreaView style={[s.container, { backgroundColor }]}>
            <AppView style={s.top}>
                <AppView style={{ position: "absolute", left: 0, top: 1 }}>
                    <BackLink />
                </AppView>
                <AppText type="defaultSemiBold">{t("profile.title")}</AppText>

                <AppView>
                    <AppText>{username}</AppText>
                </AppView>
            </AppView>

            {/* <AppView> */}

            <FlatList
                data={games}
                keyExtractor={(game) => game.id}
                renderItem={({ item: game }) => <GameRecord game={game} />}
                style={{ borderWidth: 2, borderColor: "#818181", height: Dimensions.get("screen").height - 124 }}
            />
            {/* </AppView> */}
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        // paddingVertical: 64,
        paddingHorizontal: 24,
        width: "100%",
        // minHeight: Dimensions.get("window").height,
        // minHeight: Dimensions.get("screen").height,
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
    input: {
        borderWidth: 1,
        borderColor: "#999",
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
});
