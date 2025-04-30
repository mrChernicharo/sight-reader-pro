import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/hooks/useAppStore";
import { Colors } from "@/utils/Colors";
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputChangeEventData } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { type TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "@/components/atoms/AppButton";
import { router } from "expo-router";
import { STYLES } from "@/utils/styles";
import { useCallback, useRef } from "react";
import { AppTextLogo } from "@/components/atoms/AppTextLogo";

const s = {
    ...STYLES.init,
    ...StyleSheet.create({
        inputContainer: {
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingHorizontal: 12,
            paddingBottom: 120,
            // borderWidth: 2,
            // borderColor: "red",
        },
    }),
};

export default function NameScreen() {
    const theme = useTheme();
    const textColor = Colors[theme].text;
    // const { width, height } = useWindowDimensions();
    const { t } = useTranslation();
    const { username, setUsername, setTourCompleted } = useAppStore();

    const onInputChange = useCallback((ev: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setUsername(ev.nativeEvent.text);
    }, []);

    return (
        <SafeAreaView style={{ ...s.container, backgroundColor: Colors[theme].bg }}>
            <AppView style={s.top}>
                <AppView style={s.backLink}>
                    <BackLink to="/init/02.knowledge.screen" />
                </AppView>

                <AppTextLogo />
            </AppView>

            <AppView style={s.inputContainer}>
                <AppText type="subtitle">{t("routes.init.name.title")}</AppText>
                {/* <AppText>{t("settings.username")}</AppText> */}
                <TextInput
                    style={{ ...s.input, color: textColor }}
                    placeholderTextColor={textColor}
                    // onChangeText={setLocalUsername}
                    defaultValue={username}
                    placeholder={t("settings.username")}
                    onChange={onInputChange}
                />
            </AppView>

            <AppView style={s.btnContainer}>
                <AppButton
                    disabled={!username}
                    text={t("routes.next")}
                    style={{ ...s.btn, borderColor: Colors[theme].text }}
                    textStyle={{ color: "white" }}
                    onPress={() => {
                        setTourCompleted("init", true);
                        router.replace({ pathname: "/" });
                    }}
                />
            </AppView>
        </SafeAreaView>
    );
}
