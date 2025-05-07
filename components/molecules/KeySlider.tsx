import { glyphs } from "@/utils/constants";
import { KeySignature } from "@/utils/enums";
import Slider from "@react-native-community/slider";
import { Platform, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import { useTranslation } from "@/hooks/useTranslation";
import { STYLES, testBorder } from "@/utils/styles";

const s = STYLES.practice;

export function KeySignatureSlider({
    keySignatures,
    keySigIndex,
    setKeySigIndex,
}: {
    keySignatures: KeySignature[];
    keySigIndex: number;
    setKeySigIndex: (n: number) => void;
}) {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <AppView transparentBG style={s.menuItem}>
            <AppText>{t("music.armature")}</AppText>

            <AppView style={{ ...s.menuTrigger, gap: 0 }}>
                <AppText style={ss.flatGlyph}> {glyphs.flat}</AppText>
                <Slider
                    style={{ width: 200, height: 40 }}
                    step={1}
                    minimumValue={0}
                    maximumValue={keySignatures.length - 1}
                    value={keySigIndex}
                    onValueChange={setKeySigIndex}
                    minimumTrackTintColor="#5b99d4"
                    thumbTintColor="#5b99d4"
                    maximumTrackTintColor={"white"}
                    hitSlop={32}
                />
                <AppText style={ss.sharpGlyph}> {glyphs.sharp}</AppText>
            </AppView>
        </AppView>
    );
}

const ss = StyleSheet.create({
    flatGlyph: { fontSize: 36, lineHeight: 42 },
    sharpGlyph: Platform.OS === "ios" ? { fontSize: 36, lineHeight: 40 } : { fontSize: 28, lineHeight: 28 },
});
