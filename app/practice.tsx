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
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import RangeSlider from "../components/atoms/RangeSlider";
import { useAllLevels } from "@/hooks/useAllLevels";
import { FadeIn } from "@/components/atoms/FadeIn";
import { testBorder } from "@/utils/styles";

const durationInSeconds = 60;
// const durationInSeconds = 60;

export default function PracticeScreen() {
    const theme = useTheme();
    const { t } = useTranslation();
    const { loadPracticeLevel } = useAllLevels();

    const { knowledge, practiceSettings, updatePracticeSettings } = useAppStore();
    const { clef, isMinorKey, scale, keySignature = KeySignature.C, noteRangeIndices, gameType } = practiceSettings;

    const SCALES = useMemo(() => Object.values(Scale).map((v) => ({ key: v, value: t(`music.scaleType.${v}`) })), [t]);
    const DEFAULT_SCALE = useMemo(() => SCALES.find((acc) => acc.key === scale), [scale]);

    const keySigArray = useMemo(() => (isMinorKey ? MINOR_KEY_SIGNATURES : MAJOR_KEY_SIGNATURES), [isMinorKey]);
    const altKeySigArray = useMemo(() => (isMinorKey ? MAJOR_KEY_SIGNATURES : MINOR_KEY_SIGNATURES), [isMinorKey]);
    const keySigIndex = useMemo(
        () => keySigArray.findIndex((key) => key === keySignature),
        [keySigArray, keySignature]
    );
    const CURR_KEY_SIGNATURES = useMemo(
        () => keySigArray.map((v) => ({ label: v, value: v.toLowerCase() })),
        [keySigArray]
    );

    const allNotes = useMemo(() => {
        const notes = isFlatKeySignature(keySignature) ? NOTES_FLAT_ALL_OCTAVES : NOTES_SHARP_ALL_OCTAVES;

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
    }, [clef, keySignature]);

    const rangeLow = allNotes?.[noteRangeIndices.low] || "c/4";
    const rangeHigh = allNotes?.[noteRangeIndices.high] || "c/5";

    const onKeySignatureChange = useCallback(
        (n: number) => {
            const keySig = keySigArray.find((_, i) => i == n);
            updatePracticeSettings("keySignature", keySig);
        },
        [updatePracticeSettings]
    );

    const onNoteRangeSliderChange = useCallback(
        (low: number, high: number) => {
            updatePracticeSettings("noteRangeIndices", { low, high });
        },
        [updatePracticeSettings, keySigArray]
    );

    const setGameType = useCallback(
        (isOn: boolean) => {
            const type = isOn ? GameType.Melody : GameType.Single;
            updatePracticeSettings("gameType", type);
        },
        [updatePracticeSettings]
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

    const [selectedScale, setScale] = useState(scale);
    useEffect(() => {
        updatePracticeSettings("scale", selectedScale);
    }, [updatePracticeSettings, selectedScale]);

    return (
        <SafeAreaView style={{ minHeight: "100%", backgroundColor: Colors[theme].bg }}>
            <ScrollView contentContainerStyle={s.container}>
                <AppView style={s.top}>
                    <AppView style={{ position: "absolute", left: 0, top: 6 }}>
                        <BackLink />
                    </AppView>
                    <AppText type="subtitle">{t("practice.title")}</AppText>
                </AppView>

                <AppView style={s.controlsContainer}>
                    <AppView style={s.sheetMusicContainer}>
                        <SheetMusic.RangeDisplay
                            clef={clef}
                            keySignature={keySignature}
                            keys={[[rangeLow, rangeHigh]]}
                        />
                    </AppView>

                    {/* Separator */}
                    <AppView
                        transparentBG
                        style={{ ...s.separator, borderColor: Colors[theme].textMute, marginTop: -16 }}
                    />

                    <AppView transparentBG>
                        <AppView style={s.keySignatureContainer}>
                            <AppView transparentBG>
                                <AppView transparentBG style={s.box}>
                                    <AppText style={{ backgroundColor: "transparent" }}>
                                        {t("music.keySignature")}
                                    </AppText>
                                    <AppText style={{ backgroundColor: "transparent" }} type="mdSemiBold">
                                        {keySignature}
                                    </AppText>
                                </AppView>
                            </AppView>

                            <AppView transparentBG style={s.box}>
                                <KeySignatureSlider
                                    keySignatures={CURR_KEY_SIGNATURES.map((item) => item.label)}
                                    keySigIndex={keySigIndex}
                                    setKeySigIndex={onKeySignatureChange}
                                />
                            </AppView>

                            <AppView transparentBG style={s.box}>
                                <AppText>{t("music.scaleType.major")}</AppText>
                                <AppSwitch
                                    value={isMinorKey}
                                    setValue={(val) => {
                                        const relativeKeySig = altKeySigArray[keySigIndex];
                                        updatePracticeSettings("isMinorKey", val);
                                        updatePracticeSettings("keySignature", relativeKeySig);
                                    }}
                                />
                                <AppText>{t("music.scaleType.minor")}</AppText>
                            </AppView>
                        </AppView>
                    </AppView>

                    {/* Separator */}
                    <AppView style={{ ...s.separator, borderColor: Colors[theme].textMute }} />

                    <AppView style={s.rangeSliderContainer}>
                        <AppView style={s.clefSwitch}>
                            <AppText>{t("music.clef")}</AppText>
                            <AppText style={{ fontSize: 34, lineHeight: 80 }}>{glyphs.trebleClef}</AppText>
                            <AppSwitch
                                value={clef == Clef.Bass}
                                setValue={(val) => {
                                    updatePracticeSettings("clef", val ? Clef.Bass : Clef.Treble);
                                }}
                            />
                            <AppText style={{ fontSize: 48, marginTop: 6, marginLeft: -8, lineHeight: 80 }}>
                                {glyphs.bassClef}
                            </AppText>
                        </AppView>

                        <AppView style={s.noteRangeDisplay}>
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

                        <RangeSlider
                            min={0}
                            max={allNotes.length - 1}
                            step={1}
                            handleValueChange={onNoteRangeSliderChange}
                            high={noteRangeIndices.high}
                            low={noteRangeIndices.low}
                        />
                    </AppView>

                    {/* Separator */}
                    <AppView style={{ ...s.separator, borderColor: Colors[theme].textMute }} />

                    <AppView>
                        <AppText>{t("music.scale")}</AppText>
                        <SelectList
                            data={SCALES}
                            save="key"
                            setSelected={setScale} // setScale is dangerous and can cause infinite loops
                            search={false}
                            defaultOption={DEFAULT_SCALE}
                            inputStyles={{ color: Colors[theme].text, backgroundColor: Colors[theme].bg }}
                            dropdownTextStyles={{ color: Colors[theme].text }}
                            disabledTextStyles={{ color: Colors[theme].textMute }}
                            // boxStyles={{}}
                            // dropdownStyles={{}}
                            // disabledItemStyles={{}}
                            // dropdownItemStyles={{}}
                        />
                    </AppView>

                    <AppView style={{ ...s.gameTypeContainer, backgroundColor: Colors[theme].bgSelected }}>
                        <AppView transparentBG style={s.box}>
                            <AppText>{t("game.type.single")}</AppText>
                            <AppSwitch value={gameType == GameType.Melody} setValue={setGameType} />
                            <AppText>{t("game.type.melody")}</AppText>
                        </AppView>
                    </AppView>
                </AppView>

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
    controlsContainer: {
        width: "100%",
        paddingHorizontal: 16,
        // gap: 16,
    },
    clefSwitch: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        height: 72,
        // ...testBorder("green"),
    },
    keySignatureContainer: {
        width: "100%",
        // paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: "transparent",
        // marginVertical: 12,
        // ...testBorder("green"),
    },
    gameTypeContainer: {
        width: "100%",
        paddingVertical: 8,
        borderRadius: 16,
        marginTop: 28,
        marginBottom: 12,
        // ...testBorder("green"),
    },
    rangeSliderContainer: {
        width: "100%",
        alignItems: "center",
        paddingTop: 16,
        // ...testBorder("green"),
    },
    noteRangeDisplay: {
        marginBottom: 8,
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
        marginTop: 16,
    },
    separator: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: Dimensions.get("window").width - 96,
        height: 20,
        // marginBottom: 20,
        marginVertical: 10,
        // ...testBorder(),
    },
});
