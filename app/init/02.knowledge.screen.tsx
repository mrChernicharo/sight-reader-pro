import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppTextLogo } from "@/components/atoms/AppTextLogo";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { Knowledge } from "@/utils/enums";
import { STYLES } from "@/utils/styles";
import { router } from "expo-router";
import { useCallback, useRef } from "react";
import { StyleSheet, Pressable, TouchableOpacity, View } from "react-native";
// import { type TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const s = {
    ...STYLES.init,
    ...StyleSheet.create({
        listContainer: {
            width: "100%",
            display: "flex",
            gap: 40,
            // borderWidth: 2,
            // borderColor: "red",
        },
        listItem: {
            padding: 12,
            borderWidth: 1,
        },
    }),
};

interface KnowledgeOption {
    key: Knowledge;
    title: string;
    value: string;
    emoji: string;
}

const knowledgeOptions: KnowledgeOption[] = [
    {
        key: Knowledge.novice,
        title: "music.knowledge.novice.title",
        value: "music.knowledge.novice.description",
        emoji: "👶",
    },
    {
        key: Knowledge.beginner,
        title: "music.knowledge.beginner.title",
        value: "music.knowledge.beginner.description",
        emoji: "🌱",
    },
    {
        key: Knowledge.intermediary,
        title: "music.knowledge.intermediary.title",
        value: "music.knowledge.intermediary.description",
        emoji: "🧑‍🏫",
    },
    {
        key: Knowledge.advanced,
        title: "music.knowledge.advanced.title",
        value: "music.knowledge.advanced.description",
        emoji: "🧑‍🎓",
    },
    {
        key: Knowledge.pro,
        title: "music.knowledge.pro.title",
        value: "music.knowledge.pro.description",
        emoji: "🧑‍🎤",
    },
];

export default function KnowledgeScreen() {
    const theme = useTheme();
    // const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, "text");
    // const { width, height } = useWindowDimensions();
    const { t } = useTranslation();
    const { knowledge, setKnowledge } = useAppStore();

    const onSelect = useCallback((opt: KnowledgeOption) => {
        setKnowledge(opt.key as Knowledge);
    }, []);

    return (
        <SafeAreaView style={{ ...s.container, backgroundColor: Colors[theme].bg }}>
            <AppView style={s.top}>
                <AppView style={s.backLink}>
                    <BackLink to="/init/01.lang.screen" />
                </AppView>
                <AppTextLogo />
            </AppView>

            <AppView style={{ marginBottom: 24 }}>
                {knowledge ? (
                    <AppView style={{ alignItems: "center" }}>
                        <AppText type="subtitle" style={{ textAlign: "center" }}>
                            {t("routes.init.knowledge.you")}
                        </AppText>
                        <AppText type="title">{t(`music.knowledge.${knowledge}.title`)}</AppText>
                    </AppView>
                ) : (
                    <AppText type="subtitle">{t("routes.init.knowledge.title")}</AppText>
                )}
            </AppView>

            <AppView style={s.listContainer}>
                {/* {knowledge && (
               
                )} */}

                <AppView>
                    {knowledgeOptions.map((opt, idx) => {
                        const first = idx == 0;
                        const last = idx == knowledgeOptions.length - 1;
                        const selected = opt.key === knowledge;

                        return (
                            <Pressable
                                key={opt.key}
                                onPress={() => onSelect(opt)}
                                android_ripple={{ radius: 200, color: Colors[theme].ripple }}
                                style={{
                                    ...s.listItem,
                                    borderColor: Colors[theme].ripple,
                                    ...(first && { borderTopLeftRadius: 20, borderTopRightRadius: 20 }),
                                    ...(last && { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }),
                                    ...(selected && {
                                        backgroundColor: Colors[theme].bgSelected,
                                        // backgroundOpacity: 0.5,
                                    }),
                                }}
                            >
                                <AppText>
                                    {opt.emoji} {t(opt.value)}
                                </AppText>
                            </Pressable>
                        );
                    })}
                </AppView>
            </AppView>

            <AppView style={s.btnContainer}>
                <AppButton
                    disabled={!knowledge}
                    text={t("routes.next")}
                    style={{ ...s.btn, borderColor: Colors[theme].text }}
                    textStyle={{ color: "white" }}
                    onPress={() => router.push({ pathname: "/init/03.name.screen" })}
                />
            </AppView>
        </SafeAreaView>
    );
}
