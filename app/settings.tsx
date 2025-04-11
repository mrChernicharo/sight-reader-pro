import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { Colors } from "@/utils/Colors";
import { useAppStore } from "@/hooks/useAppStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform, StyleSheet, TextInput, useColorScheme } from "react-native";
import { VolumeSlider } from "@/components/molecules/VolumeSlider";
import { useTranslation } from "@/hooks/useTranslation";
import { SelectList } from "react-native-dropdown-select-list";
import { LANGS } from "@/utils/constants";
import { AppSwitch } from "@/components/atoms/AppSwitch";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
    const { t } = useTranslation();
    const theme = useColorScheme() ?? "light";
    const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, "text");
    const { username, language, showPianoNoteNames, setUsername, setLanguage, toggleShowPianoNoteNames, _resetStore } =
        useAppStore();

    const inputRef = useRef<any>(null);

    const [_showPianoNoteNames, setShowPianoNoteNames] = useState(showPianoNoteNames);

    useEffect(() => {
        toggleShowPianoNoteNames(_showPianoNoteNames);
    }, [_showPianoNoteNames]);

    const createTwoButtonAlert = () => {
        return new Promise((resolve) => {
            const onConfirm = async () => {
                console.log("OK Pressed");
                await _resetStore();
                resolve(true);
            };
            const onCancel = () => {
                console.log("Cancel Pressed");
                resolve(false);
            };

            if (Platform.OS === "web") {
                if (confirm(`${t(`settings.resetMyData.title`)} \n${t(`settings.resetMyData.description`)}`)) {
                    onConfirm();
                } else {
                    onCancel();
                }
            } else {
                Alert.alert(t(`settings.resetMyData.title`), t(`settings.resetMyData.description`), [
                    {
                        text: "Cancel",
                        onPress: onCancel,
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        onPress: onConfirm,
                    },
                ]);
            }
        });
    };

    return (
        <SafeAreaView style={{ minHeight: "100%", backgroundColor: Colors[theme].bg }}>
            <AppView style={s.container}>
                <AppView style={s.top}>
                    <AppView style={{ position: "absolute", left: 0, top: 1 }}>
                        <BackLink />
                    </AppView>
                    <AppText type="title">{t("settings.title")}</AppText>
                </AppView>

                <AppView style={s.inputContainer}>
                    <AppText>{t("settings.username")}</AppText>
                    <TextInput
                        style={[s.input, { color: textColor }]}
                        ref={inputRef}
                        // onChangeText={setLocalUsername}
                        defaultValue={username}
                        onSubmitEditing={(ev) => {
                            setUsername(ev.nativeEvent.text);
                        }}
                    />
                </AppView>

                <AppView style={{ paddingHorizontal: 12 }}>
                    <AppText
                        style={{
                            marginBottom: 12,
                            textAlign: "center",
                        }}
                    >
                        {t("settings.language")}
                    </AppText>
                    <SelectList
                        data={LANGS}
                        save="key"
                        setSelected={setLanguage}
                        search={false}
                        placeholder={t("settings.lang.placeholder")}
                        // defaultOption={language}
                        inputStyles={{
                            color: textColor,
                            backgroundColor: Colors[theme].bg,
                            width: "100%",
                            // lineHeight: 28,
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

                {showPianoNoteNames}
                <AppView>
                    <AppText style={{ textAlign: "center" }}>{t("settings.showPianoNotes.title")}</AppText>
                    <AppView
                        style={{
                            height: 40,
                            width: 200,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <AppText>{t("settings.showPianoNotes.off")}</AppText>
                        <AppSwitch value={showPianoNoteNames} setValue={setShowPianoNoteNames} />
                        <AppText>{t("settings.showPianoNotes.on")}</AppText>
                    </AppView>
                </AppView>

                <AppView style={{ display: "flex", alignItems: "center" }}>
                    <AppText>Volume</AppText>
                    <VolumeSlider />
                </AppView>

                <AppButton
                    text={t("settings.resetMyData.title")}
                    textStyle={{ color: "white" }}
                    style={{ backgroundColor: "red" }}
                    activeOpacity={0.7}
                    onPress={async () => {
                        await createTwoButtonAlert();
                        // inputRef.current.focus();
                    }}
                />
            </AppView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 36,
        paddingVertical: 64,
    },
    top: {
        width: "100%",
        position: "relative",
        alignItems: "center",
        // borderWidth: 1,
    },
    inputContainer: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#999",
        width: "100%",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
});
