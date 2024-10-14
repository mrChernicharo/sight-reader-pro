import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { GameRecord } from "@/components/atoms/GameRecord";
import { Colors } from "@/constants/Colors";
import { isNoteMatch } from "@/constants/helperFns";
import { Game } from "@/constants/types";
import { useAppStore } from "@/hooks/useStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { ComponentType, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View, useColorScheme } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function SettingsScreen() {
  const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, "text");
  const { username, games } = useAppStore();

  return (
    <AppView style={s.container}>
      <AppView style={s.top}>
        <BackLink />
        <AppText type="title" style={{ textAlign: "center" }}>
          Profile
        </AppText>

        <AppView>
          <AppText>{username}</AppText>
        </AppView>

        <FlatList data={games} renderItem={({ item: game }) => <GameRecord game={game} />} />
      </AppView>
    </AppView>
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
    // borderWidth: 1,
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
