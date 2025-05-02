import { AppSwitch } from "@/components/atoms/AppSwitch";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { KeySignature } from "@/utils/enums";
import { MAJOR_KEY_SIGNATURES, MINOR_KEY_SIGNATURES } from "@/utils/keySignature";

import { STYLES } from "@/utils/styles";
import { useMemo } from "react";

const s = STYLES.practice;

export function IsMinorSwitch() {
    const theme = useTheme();
    const { t } = useTranslation();

    const { practiceSettings, updatePracticeSettings } = useAppStore();
    const { isMinorKey, keySignature = KeySignature.C } = practiceSettings;

    const keySigArray = useMemo(() => (isMinorKey ? MINOR_KEY_SIGNATURES : MAJOR_KEY_SIGNATURES), [isMinorKey]);
    const altKeySigArray = useMemo(() => (isMinorKey ? MAJOR_KEY_SIGNATURES : MINOR_KEY_SIGNATURES), [isMinorKey]);
    const keySigIndex = useMemo(
        () => keySigArray.findIndex((key) => key === keySignature),
        [keySigArray, keySignature]
    );

    return (
        <AppView style={s.menuItem}>
            <AppText>{t("music.mode")}</AppText>
            <AppView transparentBG style={s.menuTrigger}>
                <AppText>{t("music.scaleType.major")}</AppText>
                <AppSwitch
                    value={isMinorKey}
                    setValue={(isMinor) => {
                        const relativeKeySig = altKeySigArray[keySigIndex];
                        // console.log({ relativeKeySig, isMinor, keySigIndex });
                        updatePracticeSettings("isMinorKey", isMinor);
                        updatePracticeSettings("keySignature", relativeKeySig);
                    }}
                />
                <AppText>{t("music.scaleType.minor")}</AppText>
            </AppView>
        </AppView>
    );
}

// const s = StyleSheet.create({
//     container: {
//         alignItems: "center",
//         paddingHorizontal: 24,
//         paddingVertical: 24,
//     },
//     box: {
//         width: "100%",
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         gap: 8,
//         minHeight: 42,
//         ...testBorder("blue"),
//     },
//     innerBox: {
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//         gap: 8,
//         minHeight: 42,
//         ...testBorder(),
//     },
// });
