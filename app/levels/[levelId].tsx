import { MarkdownTest } from "@/components/MarkdownTest";
import ReactNativeVexFlow from "@/components/ReactNativeVexFlow";
import { Timer } from "@/components/Timer";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

function noteGenerator() {}

export default function Level() {
  const { levelId } = useLocalSearchParams();

  return (
    <View>
      <Text>Level {levelId}</Text>

      <Timer />

      <ReactNativeVexFlow />
      {/* <MarkdownTest /> */}
    </View>
  );
}
