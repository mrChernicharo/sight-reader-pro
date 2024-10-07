import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Home() {
  return (
    <View style={s.container}>
      <Text>Home</Text>

      <TouchableOpacity>
        <Link href="/settings">Settings</Link>
      </TouchableOpacity>

      <TouchableOpacity>
        <Link href="/practice-settings">Practice</Link>
      </TouchableOpacity>

      <TouchableOpacity>
        <Link href="/level-selection">Play</Link>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
