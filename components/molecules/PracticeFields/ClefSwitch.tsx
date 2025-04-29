import { AppSwitch } from "@/components/atoms/AppSwitch";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { glyphs } from "@/utils/constants";
import { Clef } from "@/utils/enums";

import { Dimensions, StyleSheet } from "react-native";

export function ClefSwitch() {
    const { t } = useTranslation();
    const updatePracticeSettings = useAppStore((state) => state.updatePracticeSettings);

    const practiceSettings = useAppStore((state) => state.practiceSettings);
    const { clef } = practiceSettings;

    return (
        <AppView style={s.clefSwitch}>
            <AppText>{t("music.clef")}</AppText>
            <AppText style={{ fontSize: 34, lineHeight: 80 }}>{glyphs.trebleClef}</AppText>
            <AppSwitch
                value={clef == Clef.Bass}
                setValue={(val) => {
                    updatePracticeSettings("clef", val ? Clef.Bass : Clef.Treble);
                }}
            />
            <AppText style={{ fontSize: 48, marginTop: 6, marginLeft: -8, lineHeight: 80 }}>{glyphs.bassClef}</AppText>
        </AppView>
    );
}

const s = StyleSheet.create({
    box: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        minHeight: 42,
        // ...testBorder("blue"),
    },
    clefSwitch: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
        height: 72,
    },
    separator: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: Dimensions.get("window").width - 96,
        height: 20,
        marginVertical: 10,
        // marginBottom: 20,
        // ...testBorder(),
    },
});
