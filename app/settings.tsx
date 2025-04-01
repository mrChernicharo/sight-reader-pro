import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { Colors } from "@/utils/Colors";
import { useAppStore } from "@/hooks/useAppStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useState } from "react";
import { Alert, Platform, SafeAreaView, StyleSheet, TextInput, useColorScheme } from "react-native";
import { VolumeSlider } from "@/components/molecules/VolumeSlider";
import { useTranslation } from "@/hooks/useTranslation";
import { SelectList } from "react-native-dropdown-select-list";
import { TRANSLATIONS } from "@/utils/translations";

const SUPPORTED_LANGUAGES = Object.keys(TRANSLATIONS);
const LANGS = SUPPORTED_LANGUAGES.map((lang) => ({ key: lang, value: (TRANSLATIONS as any)[lang].lang }));

export default function SettingsScreen() {
  const theme = useColorScheme() ?? "light";
  const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, "text");
  const { username, language, setUsername, setLanguage, _resetStore } = useAppStore();
  const { t } = useTranslation();

  const title = "Are you sure?";
  const description = "All your data will be erased. This action cannot be reverted";

  const createTwoButtonAlert = (title: string, description: string) => {
    const onConfirm = () => {
      console.log("OK Pressed");
      _resetStore();
    };
    const onCancel = () => {
      console.log("Cancel Pressed");
    };

    if (Platform.OS === "web") {
      if (confirm(`${title} \n${description}`)) {
        onConfirm();
      } else {
        onCancel();
      }
    } else {
      Alert.alert(title, description, [
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
  };

  return (
    <SafeAreaView style={{ minHeight: "100%" }}>
      <AppView style={s.container}>
        <AppView style={s.top}>
          <AppView style={{ position: "absolute", left: 0, top: 4 }}>
            <BackLink />
          </AppView>
          <AppText type="title">{t("settings.title")}</AppText>
        </AppView>

        <AppView style={s.inputContainer}>
          <AppText>{t("settings.username")}</AppText>
          <TextInput
            style={[s.input, { color: textColor }]}
            // onChangeText={setLocalUsername}
            defaultValue={username}
            onSubmitEditing={(ev) => {
              setUsername(ev.nativeEvent.text);
            }}
          />
        </AppView>

        <AppView style={{ display: "flex", alignItems: "center" }}>
          <AppText>Volume</AppText>
          <VolumeSlider />
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

        <AppButton
          text={t("settings.resetMyData")}
          textStyle={{ color: "white" }}
          style={{ backgroundColor: "red" }}
          activeOpacity={0.7}
          onPress={() => createTwoButtonAlert(title, description)}
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
