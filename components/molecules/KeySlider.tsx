import { glyphs } from "@/constants/constants";
import { KeySignature } from "@/constants/enums";
import Slider from "@react-native-community/slider";
import { StyleSheet } from "react-native";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";

export function KeySignatureSlider({
  keySignatures,
  keySigIndex,
  setKeySigIndex,
}: {
  keySignatures: KeySignature[];
  keySigIndex: number;
  setKeySigIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <AppView style={s.keySlider}>
      <AppText style={{ fontSize: 32 }}> {glyphs.flat}</AppText>
      <Slider
        style={{ width: 200, height: 40 }}
        step={1}
        minimumValue={0}
        maximumValue={keySignatures.length - 1}
        value={keySigIndex}
        onValueChange={setKeySigIndex}
        // minimumTrackTintColor="white"
        // maximumTrackTintColor="black"
      />
      <AppText style={{ fontSize: 32 }}> {glyphs.sharp}</AppText>
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
