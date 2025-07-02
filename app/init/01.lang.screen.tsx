import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppTextLogo } from "@/components/atoms/AppTextLogo";
import { AppView } from "@/components/atoms/AppView";
import { FadeIn } from "@/components/atoms/FadeIn";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { LANGS } from "@/utils/constants";
import { STYLES } from "@/utils/styles";
import { router } from "expo-router";
import { useCallback, useRef } from "react";
import { Image } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { type TouchableOpacity } from "react-native-gesture-handler";
import Animated, { FadeInLeft, FadeInRight, LinearTransition } from "react-native-reanimated";
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
        <>
            <SafeAreaView style={{ ...s.container, position: "relative", backgroundColor: Colors[theme].bg }}>
                <AppView style={s.top}>
                    <AppTextLogo />

                    <AppView style={{ marginTop: 56 }}>
                        <FadeIn y={-50} delay={1000}>
                            <AppView
                                style={{
                                    marginTop: 56,
                                    width: 140,
                                    backgroundColor: Colors[theme].text,
                                    alignItems: "center",
                                    padding: 16,
                                    borderRadius: 24,
                                }}
                            >
                                <AppText style={{ textAlign: "center", color: Colors[theme].bg }}>
                                    {t("routes.init.greeting")}
                                </AppText>
                            </AppView>
                        </FadeIn>

                        <FadeIn x={50} delay={0}>
                            <Image
                                style={{
                                    position: "absolute",
                                    left: 132,
                                    // right: -180,
                                    top: -120,
                                    width: 180,
                                    height: 400,
                                    zIndex: 1,
                                }}
                                source={require("../../assets/images/girl.02.png")}
                            />
                        </FadeIn>
                    </AppView>
                </AppView>

                {/* <AppView style={{ position: "absolute", width: 100, top: 100 }}></AppView> */}

                <FadeIn y={50} delay={2000}>
                    <AppView
                        style={{ zIndex: 30, backgroundColor: "transparent", paddingHorizontal: 12, paddingBottom: 0 }}
                    >
                        <AppText type="subtitle" style={{ marginBottom: 8 }}>
                            {t("routes.init.lang.title")}
                        </AppText>

                        {/* <AppText style={{ marginBottom: 12, textAlign: "center" }}>{t("settings.language")}</AppText> */}

                        <SelectList
                            data={LANGS}
                            save="key"
                            setSelected={onSelect}
                            search={false}
                            placeholder={t("settings.lang.placeholder")}
                            // defaultOption={language}
                            inputStyles={{ color: textColor, backgroundColor: Colors[theme].bg, width: "100%" }}
                            dropdownTextStyles={{ color: textColor }}
                            dropdownStyles={{ backgroundColor: Colors[theme].bg }}
                            disabledTextStyles={{ color: Colors[theme].textMute }}
                            boxStyles={{ backgroundColor: Colors[theme].bg }}
                        />
                    </AppView>
                </FadeIn>

                <AppView style={s.btnContainer}>
                    <FadeIn y={50} delay={2200}>
                        <AppButton
                            disabled={!language}
                            text={t("routes.next")}
                            style={{ ...s.btn, position: "relative", zIndex: 10, borderColor: Colors[theme].text }}
                            textStyle={{ color: "white" }}
                            onPress={() => router.push({ pathname: "/init/02.knowledge.screen" })}
                        />
                    </FadeIn>
                </AppView>
            </SafeAreaView>
        </>
    );
}
