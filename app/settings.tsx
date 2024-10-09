import { AppView } from "@/components/atoms/AppView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function SettingsScreen() {
  return (
    <AppView style={s.container}>
      <TouchableOpacity>
        <Link href="/">
          <Ionicons name="arrow-back" size={24} />
        </Link>
      </TouchableOpacity>
      <Text>Settings</Text>
    </AppView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
