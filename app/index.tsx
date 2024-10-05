import { Link } from "expo-router";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

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

      <TouchableOpacity>
        <Link href="/settings">Settings</Link>
      </TouchableOpacity>

      <TouchableOpacity>
        <Link href="/levels">Levels</Link>
      </TouchableOpacity>
    </View>
  );
}
