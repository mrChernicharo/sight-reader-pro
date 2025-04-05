import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/hooks/useAppStore";
import { Colors } from "@/utils/Colors";
import { StyleSheet, useColorScheme, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KnowledgeScreen() {
    const theme = useColorScheme() ?? "light";
    const { width, height } = useWindowDimensions();
    const { t } = useTranslation();
    const {} = useAppStore();

    return (
        <SafeAreaView style={{ minHeight: "100%", backgroundColor: Colors[theme].background }}>
            <ScrollView contentContainerStyle={s.container}>
                <AppView style={s.top}>
                    <AppView style={{ position: "absolute", left: 0, top: 4 }}>
                        <BackLink />
                    </AppView>
                    <AppText type="defaultSemiBold">{t("knowledge.title")}</AppText>
                </AppView>
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingHorizontal: 36,
        paddingVertical: 24,
    },
    top: {
        width: "100%",
        position: "relative",
        alignItems: "center",
    },
});
