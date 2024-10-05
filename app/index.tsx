import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Home</Text>

      <Link href="/settings">Settings</Link>
      <Link href="/levels">Levels</Link>
    </View>
  );
}
