import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { Colors } from "@/constants/Colors";
import { useAppStore } from "@/hooks/useStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { ComponentType, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

export default function SettingsScreen() {
  const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, "text");
  const { username, setUsername, _resetStore } = useAppStore();
  const [localUsername, setLocalUsername] = useState(username);

  const createTwoButtonAlert = () =>
    Alert.alert("Are you sure?", "All your data will be erased. This action cannot be reverted", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          console.log("OK Pressed");
          _resetStore();
        },
      },
    ]);

  return (
    <AppView style={s.container}>
      <AppView style={s.top}>
        <BackLink />
        <AppText type="title" style={{ textAlign: "center" }}>
          Settings
        </AppText>
      </AppView>

      <AppView style={s.inputContainer}>
        <AppText>username</AppText>
        <TextInput
          style={[s.input, { color: textColor }]}
          onChangeText={setLocalUsername}
          defaultValue={username}
          onSubmitEditing={() => localUsername && setUsername(localUsername)}
        />
      </AppView>

      <AppButton
        text="reset my data"
        textStyle={{ color: "white" }}
        style={{ backgroundColor: "red" }}
        activeOpacity={0.7}
        onPress={createTwoButtonAlert}
      />
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
