import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { Colors } from "@/constants/Colors";
import { useAppStore } from "@/hooks/useAppStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, TextInput } from "react-native";

export default function SettingsScreen() {
  const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, "text");
  const { username, setUsername, _resetStore } = useAppStore();
  const [localUsername, setLocalUsername] = useState<string | undefined>(undefined);

  const title = "Are you sure?";
  const description = "All your data will be erased. This action cannot be reverted";

  const createTwoButtonAlert = (title: string, description: string) => {
    const onConfirm = () => {
      console.log("OK Pressed");
      setLocalUsername("");
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

  useEffect(() => {
    // console.log({ username, localUsername });
    if (username && localUsername === undefined) {
      setLocalUsername(username);
    }
  }, [username, localUsername]);

  return (
    <AppView style={s.container}>
      <AppView style={s.top}>
        <AppView
          onPointerDown={() => {
            console.log("cleanup");
            setLocalUsername(undefined);
          }}
        >
          <BackLink />
        </AppView>
        <AppText type="title" style={{ textAlign: "center" }}>
          Settings
        </AppText>
      </AppView>

      <AppView style={s.inputContainer}>
        <AppText>username</AppText>
        <TextInput
          style={[s.input, { color: textColor }]}
          onChangeText={setLocalUsername}
          value={localUsername}
          onSubmitEditing={() => localUsername && setUsername(localUsername)}
        />
      </AppView>

      <AppButton
        text="reset my data"
        textStyle={{ color: "white" }}
        style={{ backgroundColor: "red" }}
        activeOpacity={0.7}
        onPress={() => createTwoButtonAlert(title, description)}
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
