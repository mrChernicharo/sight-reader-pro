import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useAppStore } from "@/hooks/useStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { ComponentType, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function SettingsScreen() {
  const { username, setUsername } = useAppStore();
  const [localUsername, setLocalUsername] = useState(username);

  return (
    <AppView style={s.container}>
      <BackLink />

      <AppText type="title">Settings</AppText>

      <AppText>username</AppText>
      <AppView style={s.inputContainer}>
        <TextInput style={s.input} onChangeText={setLocalUsername} defaultValue={username} />
        <AppButton
          text="submit"
          textStyle={{ color: "white" }}
          activeOpacity={0.7}
          disabled={!localUsername}
          onPress={() => localUsername && setUsername(localUsername)}
        />
      </AppView>
    </AppView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
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
