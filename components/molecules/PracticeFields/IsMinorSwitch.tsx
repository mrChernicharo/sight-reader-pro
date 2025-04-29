import AppButton from "@/components/atoms/AppButton";
import { AppSwitch } from "@/components/atoms/AppSwitch";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { KeySignatureSlider } from "@/components/molecules/KeySlider";
import { SheetMusic } from "@/components/molecules/SheetMusic";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { glyphs } from "@/utils/constants";
import { Clef, GameType, KeySignature, Knowledge, LevelAccidentType, TimeSignature, WinRank } from "@/utils/enums";
import { explodeNote, isFlatKeySignature, wait } from "@/utils/helperFns";
import { MAJOR_KEY_SIGNATURES, MINOR_KEY_SIGNATURES } from "@/utils/keySignature";

import { NOTES_FLAT_ALL_OCTAVES, NOTES_SHARP_ALL_OCTAVES } from "@/utils/notes";
import { Level, LevelId, NoteRange, Scale } from "@/utils/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAllLevels } from "@/hooks/useAllLevels";
import { FadeIn } from "@/components/atoms/FadeIn";
import { testBorder } from "@/utils/styles";
import { GameTypeSwitch } from "@/components/molecules/PracticeFields/GameTypeSwitch";
import { ClefSwitch } from "@/components/molecules/PracticeFields/ClefSwitch";
import { ScaleSelect } from "@/components/molecules/PracticeFields/ScaleSelect";

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
        <AppView transparentBG style={s.box}>
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
    );
}

const s = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 24,
    },
    box: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        minHeight: 42,
        // ...testBorder("blue"),
    },
    top: {
        width: "100%",
        position: "relative",
        alignItems: "center",
    },
    controlsContainer: {
        width: "100%",
        paddingHorizontal: 16,
        // gap: 16,
    },
    clefSwitch: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
        height: 72,
    },
    keySignatureContainer: {
        width: "100%",
        // paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: "transparent",
        // marginVertical: 12,
        // ...testBorder("green"),
    },
    rangeSliderContainer: {
        width: "100%",
        alignItems: "center",
        paddingTop: 16,
        // ...testBorder("green"),
    },
    noteRangeDisplay: {
        marginTop: 12,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        width: 160,
        // ...testBorder(),
    },
    sheetMusicContainer: {
        // ...testBorder(),
    },
    cta: {
        width: 300,
        height: 56,
        marginBottom: 16,
        // ...testBorder(),
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
