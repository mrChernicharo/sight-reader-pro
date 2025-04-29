import { glyphs } from "@/utils/constants";
import { KeySignature } from "@/utils/enums";
import Slider from "@react-native-community/slider";
import { StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import { useTranslation } from "@/hooks/useTranslation";
import { STYLES } from "@/utils/styles";

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

            <AppView style={s.menuTrigger}>
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
                    hitSlop={32}
                />
                <AppText style={{ fontSize: 32 }}> {glyphs.sharp}</AppText>
            </AppView>
        </AppView>
    );
}
