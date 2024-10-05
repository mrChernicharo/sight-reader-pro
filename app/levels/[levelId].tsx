import { AppView } from "@/components/AppView";
import { MusicNote } from "@/components/MusicNote";
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

      {/* <ReactNativeVexFlow /> */}

      {/* <MusicNote keys={["c/3"]} clef="bass" />*/}
      <MusicNote keys={["f/4", "db/5", "ab/5"]} clef="treble" />
      <MusicNote keys={["c/5"]} clef="treble" />
    </View>
  );
}
