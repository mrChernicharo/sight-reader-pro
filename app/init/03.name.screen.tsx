import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/hooks/useAppStore";
import { Colors } from "@/utils/Colors";
import { StyleSheet, TextInput, useWindowDimensions } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import AppButton from "@/components/atoms/AppButton";
import { Link, router } from "expo-router";
import { STYLES } from "@/utils/styles";

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
    const { width, height } = useWindowDimensions();
    const { t } = useTranslation();
    const { username, setUsername, setTourCompleted } = useAppStore();

    return (
        <SafeAreaView style={[s.container, { backgroundColor: Colors[theme].bg }]}>
            <AppView style={s.top}>
                <AppView style={{ position: "absolute", left: 0, top: 6 }}>
                    <BackLink to="/init/02.knowledge.screen" />
                </AppView>
                <AppText type="subtitle">{t("routes.init.name.title")}</AppText>
            </AppView>

            <AppView style={s.inputContainer}>
                <AppText>{t("settings.username")}</AppText>
                <TextInput
                    style={[s.input, { color: textColor }]}
                    placeholderTextColor={textColor}
                    // onChangeText={setLocalUsername}
                    defaultValue={username}
                    placeholder={t("settings.username")}
                    onChange={(ev) => {
                        setUsername(ev.nativeEvent.text);
                    }}
                />
            </AppView>

            <AppView style={s.btnContainer}>
                {/* <Link asChild href="/init/03.knowledge.screen">
                    <AppButton
                        text={t("routes.next")}
                        style={[s.btn, { borderColor: Colors[theme].text }]}
                        textStyle={{ color: "white" }}
                    />
                </Link> */}
                <AppButton
                    disabled={!username}
                    text={t("routes.next")}
                    style={[s.btn, { borderColor: Colors[theme].text }]}
                    textStyle={{ color: "white" }}
                    onPress={async () => {
                        // await setInitTourCompleted(true);
                        console.log("hhhhoy");
                        await setTourCompleted("init", true);
                        router.replace({ pathname: "/" });
                    }}
                />
            </AppView>
        </SafeAreaView>
    );
}
