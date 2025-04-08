import { router } from "expo-router";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/hooks/useAppStore";
import { Colors } from "@/utils/Colors";
import { StyleSheet, TextInput, useColorScheme, useWindowDimensions } from "react-native";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "@/components/atoms/AppButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link } from "expo-router";
import { Knowledge } from "@/utils/enums";

const knowledgeOptions = [
    {
        key: "novice",
        title: "music.knowledge.novice.title",
        value: "music.knowledge.novice.description",
        emoji: "👶",
    },
    {
        key: "beginner",
        title: "music.knowledge.beginner.title",
        value: "music.knowledge.beginner.description",
        emoji: "🌱",
    },
    {
        key: "intermediary",
        title: "music.knowledge.intermediary.title",
        value: "music.knowledge.intermediary.description",
        emoji: "🧑‍🏫",
    },
    {
        key: "advanced",
        title: "music.knowledge.advanced.title",
        value: "music.knowledge.advanced.description",
        emoji: "🧑‍🎓",
    },
    {
        key: "pro",
        title: "music.knowledge.pro.title",
        value: "music.knowledge.pro.description",
        emoji: "🧑‍🎤",
    },
];

export default function KnowledgeScreen() {
    const theme = useColorScheme() ?? "light";
    const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, "text");
    const { width, height } = useWindowDimensions();
    const { t } = useTranslation();
    const { knowledge, setKnowledge } = useAppStore();

    return (
        <SafeAreaView style={[s.container, { backgroundColor: Colors[theme].bg }]}>
            <AppView style={s.top}>
                <AppView style={{ position: "absolute", left: 0, top: 1 }}>
                    <BackLink to="/init/01.lang.screen" />
                </AppView>
                <AppText type="defaultSemiBold">{t("routes.init.knowledge.title")}</AppText>
            </AppView>

            <AppView style={s.listContainer}>
                <AppView>
                    {knowledgeOptions.map((opt) => (
                        <Pressable
                            key={opt.key}
                            android_ripple={{ radius: 240 }}
                            onPress={() => setKnowledge(opt.key as Knowledge)}
                            style={{ padding: 8 }}
                        >
                            <AppText>
                                {opt.emoji} {t(opt.value)}
                            </AppText>
                        </Pressable>
                    ))}
                </AppView>

                {knowledge && (
                    <AppView
                        style={{
                            // borderWidth: 2,
                            // borderColor: "red",
                            alignItems: "center",
                        }}
                    >
                        <AppText type="mdSemiBold">{t("routes.init.knowledge.you")}</AppText>
                        <AppText type="title">{t(`music.knowledge.${knowledge}.title`)}</AppText>
                    </AppView>
                )}
            </AppView>

            <AppView style={s.btnContainer}>
                <AppButton
                    disabled={!knowledge}
                    text={t("routes.next")}
                    style={[s.btn, { borderColor: Colors[theme].text }]}
                    textStyle={{ color: "white" }}
                    onPress={() => router.push({ pathname: "/init/03.name.screen" })}
                />
            </AppView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 36,
        paddingVertical: 24,
        position: "relative",
        // borderWidth: 2,
        // borderColor: "red",
    },
    top: {
        width: "100%",
        top: 24,
        position: "absolute",
        alignItems: "center",
    },
    listContainer: {
        width: "100%",
        display: "flex",
        gap: 40,
        // borderWidth: 2,
        // borderColor: "red",
    },
    input: {
        borderWidth: 1,
        borderColor: "#999",
        width: "100%",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    btnContainer: {
        position: "absolute",
        width: "100%",
        bottom: 50,
        // borderWidth: 2,
        // borderColor: "red",
    },
    btn: { width: "100%" },
});
