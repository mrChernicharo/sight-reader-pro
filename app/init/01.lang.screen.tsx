import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/hooks/useAppStore";
import { Colors } from "@/utils/Colors";
import { StyleSheet, useColorScheme, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SelectList } from "react-native-dropdown-select-list";
import { LANGS } from "@/utils/constants";
import { Link } from "expo-router";
import AppButton from "@/components/atoms/AppButton";

export default function LangScreen() {
    const theme = useColorScheme() ?? "light";
    const { width, height } = useWindowDimensions();
    const { t } = useTranslation();
    const {} = useAppStore();
    const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, "text");
    const setLanguage = useAppStore((state) => state.setLanguage);

    return (
        <SafeAreaView style={[s.container, { backgroundColor: Colors[theme].background }]}>
            <AppView style={s.top}>
                <AppView style={{ position: "absolute", left: 0, top: 4 }}>
                    <BackLink />
                </AppView>
                <AppText type="defaultSemiBold">{t("routes.init.lang.title")}</AppText>
            </AppView>

            <AppView style={{ paddingHorizontal: 12, paddingBottom: 120 }}>
                <AppText style={{ marginBottom: 12, textAlign: "center" }}>{t("settings.language")}</AppText>
                <SelectList
                    data={LANGS}
                    save="key"
                    setSelected={setLanguage}
                    search={false}
                    placeholder={t("settings.lang.placeholder")}
                    // defaultOption={language}
                    inputStyles={{
                        color: textColor,
                        backgroundColor: Colors[theme].background,
                        width: "100%",
                    }}
                    dropdownTextStyles={{
                        color: textColor,
                    }}
                    disabledTextStyles={{
                        color: Colors[theme].textMute,
                    }}
                    boxStyles={{}}
                />
            </AppView>

            <AppView>
                <Link style={s.link} href="/init/02.name.screen">
                    <AppButton
                        text={t("routes.next")}
                        style={[s.btn, { borderColor: Colors[theme].text }]}
                        textStyle={{ color: Colors[theme].text }}
                    />
                </Link>
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
        height: "100%",
        borderWidth: 2,
        borderColor: "red",
        position: "relative",
    },
    top: {
        width: "100%",
        top: 24,
        position: "absolute",
        alignItems: "center",
    },
    link: { width: 200 },
    btn: { backgroundColor: "rgba(0, 0, 0, 0)", borderWidth: 1, width: 200 },
});
