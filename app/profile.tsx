import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { GameRecord } from "@/components/atoms/GameRecord";
import { Colors } from "@/utils/Colors";
import { useAppStore } from "@/hooks/useAppStore";
import { Dimensions, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { username, games } = useAppStore();
  const theme = useColorScheme() ?? "light";
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, "background");
  return (
    <SafeAreaView style={{ minHeight: "100%", backgroundColor }}>
      {/* <ScrollView style={s.container}> */}
      {/* <AppView style={s.top}>
          <BackLink style={s.backLink} />
          <AppText type="title" style={{ textAlign: "center", width: "100%" }}>
            Profile
          </AppText>
        </AppView> */}

      <AppView style={s.top}>
        <AppView style={{ position: "absolute", left: 0, top: 4 }}>
          <BackLink />
        </AppView>
        <AppText type="title">{t("profile.title")}</AppText>
      </AppView>

      <AppView>
        <AppText>{username}</AppText>
      </AppView>

      <FlatList
        data={games}
        keyExtractor={(game) => game.id}
        renderItem={({ item: game }) => <GameRecord game={game} />}
      />
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 36,
    paddingVertical: 64,
    width: "100%",
  },
  top: {
    position: "relative",
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
