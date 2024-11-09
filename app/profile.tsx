import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { GameRecord } from "@/components/atoms/GameRecord";
import { Colors } from "@/utils/Colors";
import { useAppStore } from "@/hooks/useAppStore";
import { SafeAreaView, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function SettingsScreen() {
  const { username, games } = useAppStore();
  const theme = useColorScheme() ?? "light";

  return (
    <SafeAreaView style={{ minHeight: "100%" }}>
      <ScrollView contentContainerStyle={[s.scrollView, { backgroundColor: Colors[theme].background }]}>
        <AppView style={s.container}>
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
            <AppText type="title">Profile</AppText>
          </AppView>

          <AppView>
            <AppText>{username}</AppText>
          </AppView>

          <FlatList data={games} renderItem={({ item: game }) => <GameRecord game={game} />} />
        </AppView>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  scrollView: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    paddingHorizontal: 36,
    paddingVertical: 64,
    width: "100%",
    // borderWidth: 1,
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
