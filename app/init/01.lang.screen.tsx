import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppTextLogo } from "@/components/atoms/AppTextLogo";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { LANGS } from "@/utils/constants";
import { STYLES } from "@/utils/styles";
import { router } from "expo-router";
import { useCallback, useRef } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { type TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const s = STYLES.init;

export default function LangScreen() {
    // const { width, height } = useWindowDimensions();
    const { t } = useTranslation();

    const theme = useTheme();
    const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, "text");

    const language = useAppStore((state) => state.language);
    const setLanguage = useAppStore((state) => state.setLanguage);

    // console.log(language);
    // const langObj = language ? { key: t(`${language}.title`), value: language } : undefined;
    // console.log(langObj);

    const onSelect = useCallback(async (lang: any) => {
        setLanguage(lang);
    }, []);

    return (
        <SafeAreaView style={{ ...s.container, backgroundColor: Colors[theme].bg }}>
            <AppView style={s.top}>
                <AppTextLogo />
            </AppView>

            <AppView style={{ paddingHorizontal: 12, paddingBottom: 120 }}>
                <AppText type="subtitle" style={{ marginBottom: 8 }}>
                    {t("routes.init.lang.title")}
                </AppText>
                {/* <AppText style={{ marginBottom: 12, textAlign: "center" }}>{t("settings.language")}</AppText> */}
                <SelectList
                    data={LANGS}
                    save="key"
                    setSelected={onSelect}
                    search={false}
                    // placeholder={"English"}
                    placeholder={t("lang")}
                    // defaultOption={language}
                    inputStyles={{ color: textColor, backgroundColor: Colors[theme].bg, width: "100%" }}
                    dropdownTextStyles={{ color: textColor }}
                    disabledTextStyles={{ color: Colors[theme].textMute }}
                    boxStyles={{}}
                />
            </AppView>

            <AppView style={s.btnContainer}>
                <AppButton
                    disabled={!language}
                    text={t("routes.next")}
                    style={{ ...s.btn, borderColor: Colors[theme].text }}
                    textStyle={{ color: "white" }}
                    onPress={() => router.push({ pathname: "/init/02.knowledge.screen" })}
                />
            </AppView>
        </SafeAreaView>
    );
}
