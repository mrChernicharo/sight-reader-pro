import { AppSwitch } from "@/components/atoms/AppSwitch";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { glyphs } from "@/utils/constants";
import { Clef } from "@/utils/enums";
import { STYLES } from "@/utils/styles";

import { Dimensions, StyleSheet } from "react-native";

const s = STYLES.practice;

export function ClefSwitch() {
    const { t } = useTranslation();
    const updatePracticeSettings = useAppStore((state) => state.updatePracticeSettings);

    const practiceSettings = useAppStore((state) => state.practiceSettings);
    const { clef } = practiceSettings;

    return (
        <AppView style={s.menuItem}>
            <AppText>{t("music.clef")}</AppText>

            <AppView style={s.menuTrigger}>
                <AppText style={{ fontSize: 24, lineHeight: 80 }}>{glyphs.trebleClef}</AppText>
                <AppSwitch
                    value={clef == Clef.Bass}
                    setValue={(val) => {
                        updatePracticeSettings("clef", val ? Clef.Bass : Clef.Treble);
                    }}
                />
                <AppText style={{ fontSize: 32, marginTop: 6, marginLeft: -8, lineHeight: 80 }}>
                    {glyphs.bassClef}
                </AppText>
            </AppView>
        </AppView>
    );
}
