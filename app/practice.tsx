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
import RangeSlider from "../components/atoms/RangeSlider";
import { useAllLevels } from "@/hooks/useAllLevels";
import { FadeIn } from "@/components/atoms/FadeIn";
import { testBorder } from "@/utils/styles";
import { GameTypeSwitch } from "@/components/molecules/PracticeFields/GameTypeSwitch";
import { ClefSwitch } from "@/components/molecules/PracticeFields/ClefSwitch";
import { ScaleSelect } from "@/components/molecules/PracticeFields/ScaleSelect";
import { IsMinorSwitch } from "@/components/molecules/PracticeFields/IsMinorSwitch";

const durationInSeconds = 60;
// const durationInSeconds = 60;

export default function PracticeScreen() {
    const theme = useTheme();
    const { t } = useTranslation();
    const { loadPracticeLevel } = useAllLevels();

    const { knowledge, practiceSettings, updatePracticeSettings } = useAppStore();
    const { clef, isMinorKey, scale, keySignature = KeySignature.C, noteRangeIndices, gameType } = practiceSettings;

    const keySigArray = useMemo(() => (isMinorKey ? MINOR_KEY_SIGNATURES : MAJOR_KEY_SIGNATURES), [isMinorKey]);
    const keySigIndex = useMemo(
        () => keySigArray.findIndex((key) => key === keySignature),
        [keySigArray, keySignature]
    );
    const CURR_KEY_SIGNATURES = useMemo(
        () => keySigArray.map((v) => ({ label: v, value: v.toLowerCase() })),
        [keySigArray]
    );

    const notes = useMemo(
        () => (isFlatKeySignature(keySignature) ? NOTES_FLAT_ALL_OCTAVES : NOTES_SHARP_ALL_OCTAVES),
        [keySignature]
    );

    const allNotes = useMemo(() => {
        return notes.filter((note) => {
            const { index } = explodeNote(note);
            // console.log({ note, index });
            switch (clef) {
                case Clef.Bass:
                    return index < 50;
                case Clef.Treble:
                    return index >= 24 && index < 78;
                default:
                    return [];
            }
        });
    }, [clef, notes, keySignature]);

    const rangeLow = allNotes?.[noteRangeIndices.low] || "c/4";
    const rangeHigh = allNotes?.[noteRangeIndices.high] || "c/5";

    const onKeySignatureChange = useCallback(
        (n: number) => {
            const keySig = keySigArray.find((_, i) => i == n);
            // console.log({ keySig, isMinorKey, keySigIndex });
            updatePracticeSettings("keySignature", keySig);
        },
        [updatePracticeSettings, isMinorKey, keySigIndex]
    );

    const onNoteRangeSliderChange = useCallback(
        (low: number, high: number) => {
            updatePracticeSettings("noteRangeIndices", { low, high });
        },
        [updatePracticeSettings, keySigArray]
    );

    // CREATE A LEVEL IN MEMORY, THEN REFERENCE IT WITHIN GAME COMPONENT
    const startPracticeGame = useCallback(async () => {
        const levelId: LevelId = `${clef}-practice`;
        const noteRanges = [`${rangeLow}:::${rangeHigh}` as NoteRange];
        // const durationInSeconds = 6;
        // console.log({ clef, accident, keySignature });
        // console.log("allNotes::::", allNotes, rangeLow, rangeLHigh);

        const practiceLevelSingle: Level = {
            id: levelId,
            name: "single note practice",
            skillLevel: knowledge || Knowledge.intermediary,
            clef,
            type: GameType.Single,
            durationInSeconds,
            noteRanges,
            winConditions: { [WinRank.Gold]: 30, [WinRank.Silver]: 25, [WinRank.Bronze]: 20 },
            keySignature,
            timeSignature: TimeSignature["4/4"],
            index: -1,
            scale,
        };

        const practiceLevelMelody: Level = {
            id: levelId,
            name: "melody practice",
            skillLevel: knowledge || Knowledge.intermediary,
            clef,
            type: GameType.Melody,
            timeSignature: TimeSignature["4/4"],
            noteRanges,
            durationInSeconds,
            winConditions: { [WinRank.Gold]: 30, [WinRank.Silver]: 25, [WinRank.Bronze]: 20 },
            keySignature,
            index: -1,
            scale,
        };

        const practiceGame = gameType == GameType.Single ? practiceLevelSingle : practiceLevelMelody;
        await loadPracticeLevel(practiceGame);

        router.push({
            pathname: "/game-level/[id]",
            params: { id: levelId, clef, keySignature, previousPage: "/practice" },
        });
    }, [clef, rangeLow, rangeHigh, CURR_KEY_SIGNATURES, keySignature, allNotes, gameType]);

    return (
        <SafeAreaView style={{ minHeight: "100%", backgroundColor: Colors[theme].bg }}>
            <ScrollView contentContainerStyle={s.container}>
                <AppView style={s.top}>
                    <AppView style={{ position: "absolute", left: 0, top: 6 }}>
                        <BackLink />
                    </AppView>
                    <AppText type="subtitle">{t("practice.title")}</AppText>
                </AppView>

                <AppView style={s.box}>
                    <AppText style={{ backgroundColor: "transparent" }}>{t("music.keySignature")}:</AppText>
                    <AppText style={{ backgroundColor: "transparent" }} type="mdSemiBold">
                        {t(`music.keys.${keySignature}`)}
                    </AppText>
                </AppView>

                <AppView style={s.noteRangeTextDisplay}>
                    <AppText>{t("music.noteRange")}</AppText>
                    <AppText type="mdSemiBold">
                        {t(`music.notes.${rangeLow.split("/")[0]}`) + "/" + rangeLow.split("/")[1]}
                    </AppText>
                    <AppText type="mdSemiBold">
                        <FontAwesome5 name="arrows-alt-h" />
                    </AppText>
                    <AppText type="mdSemiBold">
                        {t(`music.notes.${rangeHigh.split("/")[0]}`) + "/" + rangeHigh.split("/")[1]}
                    </AppText>
                </AppView>

                <AppView style={s.sheetMusicContainer}>
                    <SheetMusic.RangeDisplay clef={clef} keySignature={keySignature} keys={[[rangeLow, rangeHigh]]} />
                </AppView>

                <AppView style={{ ...s.separator, borderColor: Colors[theme].textMute }} />

                <ClefSwitch />

                <AppView style={{ ...s.separator, borderColor: Colors[theme].textMute }} />

                <KeySignatureSlider
                    keySignatures={CURR_KEY_SIGNATURES.map((item) => item.label)}
                    keySigIndex={keySigIndex}
                    setKeySigIndex={onKeySignatureChange}
                />

                <AppView style={{ ...s.separator, borderColor: Colors[theme].textMute }} />

                <IsMinorSwitch />

                <AppView style={{ ...s.separator, borderColor: Colors[theme].textMute }} />

                <RangeSlider
                    min={0}
                    max={allNotes.length - 1}
                    step={1}
                    handleValueChange={onNoteRangeSliderChange}
                    high={noteRangeIndices.high}
                    low={noteRangeIndices.low}
                    allNotes={allNotes}
                />

                <AppView style={{ ...s.separator, borderColor: Colors[theme].textMute }} />

                <ScaleSelect />

                <AppView style={{ ...s.separator, borderColor: Colors[theme].textMute }} />

                <GameTypeSwitch />

                {/* Spacer */}
                <AppView style={{ paddingBottom: 32 }} />

                <AppButton
                    text={t("practice.start")}
                    onPress={startPracticeGame}
                    style={s.cta}
                    textStyle={{ color: "white", fontSize: 24 }}
                    activeOpacity={0.7}
                />
            </ScrollView>
        </SafeAreaView>
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
    noteRangeTextDisplay: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        width: 160,
        // ...testBorder(),
    },
    sheetMusicContainer: {
        marginTop: 12,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        width: 160,
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
        width: Dimensions.get("window").width,
        // height: 20,
        // marginVertical: 10,
    },
});

// export default function PracticeScreen() {
//     const theme = useTheme();
//     const { t } = useTranslation();

//     const MENU_ITEMS = [
//         { title: "clef", component: <ClefSwitch /> },
//         { title: "armature", component: null },
//         { title: "isMinor", component: null },
//         { title: "noteRange", component: null },
//         { title: "scale", component: null },
//         { title: "gameType", component: null },
//     ];

//     return (
//         <SafeAreaView style={{ minHeight: "100%", backgroundColor: Colors[theme].bg }}>
//             {/* <ScrollView contentContainerStyle={s.container}> */}
//             <AppView style={s.top}>
//                 <AppView style={{ position: "absolute", left: 0, top: 6 }}>
//                     <BackLink />
//                 </AppView>
//                 <AppText type="subtitle">{t("practice.title")}</AppText>
//             </AppView>

//             <FlatList
//                 data={MENU_ITEMS}
//                 keyExtractor={({ title }) => title}
//                 renderItem={({ item, index, separators }) => <>{item.component}</>}
//             />
//             {/* </ScrollView> */}
//         </SafeAreaView>
//     );
// }

// const s = StyleSheet.create({
//     container: {
//         alignItems: "center",
//         paddingHorizontal: 24,
//         paddingVertical: 24,
//     },
//     top: {
//         width: "100%",
//         position: "relative",
//         alignItems: "center",
//     },
//     clefSwitch: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         gap: 8,
//         height: 72,
//     },
// });
