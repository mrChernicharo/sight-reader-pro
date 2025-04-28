import { Ionicons } from "@expo/vector-icons";
import { glyphs } from "@/utils/constants";
import { KeySignature } from "@/utils/enums";
import Slider from "@react-native-community/slider";
import { StyleSheet } from "react-native";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import { Colors } from "@/utils/Colors";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";

export function VolumeSlider() {
    const theme = useTheme();
    const { setGlobalVolume, globalVolume } = useAppStore();

    return (
        <AppView style={s.keySlider}>
            <Ionicons name="volume-high" size={24} color={Colors[theme].text} />

            <Slider
                style={{ width: 200, height: 40 }}
                step={0.01}
                minimumValue={0}
                maximumValue={1}
                value={globalVolume}
                onValueChange={setGlobalVolume}
                hitSlop={32}
                minimumTrackTintColor="#5b99d4"
                thumbTintColor="#5b99d4"
                maximumTrackTintColor={theme === "light" ? "black" : "white"}
                // value={keySigIndex}
                // minimumTrackTintColor={theme === "light" ? "black" : "white"}
            />

            <AppView style={{ width: 58 }}>
                <AppText style={{ fontSize: 22, lineHeight: 32, textAlign: "right" }}>
                    {Number(globalVolume * 100).toFixed(0)}%
                </AppText>
            </AppView>
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
