import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Level() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Level {id}</Text>
    </View>
  );
}
