import { glyphs } from "@/utils/constants";
import { KeySignature } from "@/utils/enums";
import Slider from "@react-native-community/slider";
import { StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";

export function KeySignatureSlider({
    keySignatures,
    keySigIndex,
    setKeySigIndex,
}: {
    keySignatures: KeySignature[];
    keySigIndex: number;
    setKeySigIndex: (n: number) => void;
}) {
    const theme = useTheme();

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
                minimumTrackTintColor="#5b99d4"
                thumbTintColor="#5b99d4"
                maximumTrackTintColor={theme === "light" ? "black" : "white"}
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
