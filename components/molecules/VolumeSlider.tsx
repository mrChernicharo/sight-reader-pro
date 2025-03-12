import { Ionicons } from "@expo/vector-icons";
import { glyphs } from "@/utils/constants";
import { KeySignature } from "@/utils/enums";
import Slider from "@react-native-community/slider";
import { StyleSheet, useColorScheme } from "react-native";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import { Colors } from "@/utils/Colors";

export function VolumeSlider() {
  const theme = useColorScheme() ?? "light";

  return (
    <AppView style={s.keySlider}>
      <Ionicons name="volume-high" size={24} color={Colors[theme].text} />
      {/* <AppText style={{ fontSize: 32 }}> {glyphs.flat}</AppText> */}
      <Slider
        style={{ width: 200, height: 40 }}
        step={0.01}
        minimumValue={0}
        maximumValue={1}
        // value={keySigIndex}
        // onValueChange={setKeySigIndex}
        // minimumTrackTintColor={theme === "light" ? "black" : "white"}
        maximumTrackTintColor={theme === "light" ? "black" : "white"}
      />
    </AppView>
  );
}

const s = StyleSheet.create({
  keySlider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    // borderWidth: 1,
    // width: "100%",
  },
});
