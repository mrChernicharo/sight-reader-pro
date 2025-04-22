import AppButton from "@/components/atoms/AppButton";
import { AppSwitch } from "@/components/atoms/AppSwitch";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { KeySignatureSlider } from "@/components/molecules/KeySlider";
import { SheetMusic } from "@/components/molecules/SheetMusic";
import { defaultNoteRangeIndices, useAppStore } from "@/hooks/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { glyphs } from "@/utils/constants";
import {
    Clef,
    GameType,
    KeySignature,
    Knowledge,
    LevelAccidentType,
    ScaleType,
    TimeSignature,
    WinRank,
} from "@/utils/enums";
import { explodeNote, isFlatKeySignature, wait } from "@/utils/helperFns";
import { MAJOR_KEY_SIGNATURES, MINOR_KEY_SIGNATURES } from "@/utils/keySignature";
import { ALL_LEVELS } from "@/utils/levels";
import { NOTES_FLAT_ALL_OCTAVES, NOTES_SHARP_ALL_OCTAVES } from "@/utils/notes";
import { Level, LevelId, NoteRange, Scale } from "@/utils/types";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SelectList } from "react-native-dropdown-select-list";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import RangeSlider from "../components/atoms/RangeSlider";
import { testBorder } from "@/utils/styles";
import { FontAwesome5 } from "@expo/vector-icons";

// const KEY_SIGNATURES = Object.values(KeySignature).map((v) => ({ label: v, value: v.toLowerCase() }));

const ACCIDENTS = Object.values(LevelAccidentType).map((v) => ({
    key: v,
    value: v.toLowerCase(),
}));
export default function PracticeScreen() {
    // const { width } = useWindowDimensions();
    const theme = useTheme();
    const { t } = useTranslation();

    const { practiceSettings, updatePracticeSettings, endGame } = useAppStore();
    const {
        clef,
        isMinorKey,
        accident,
        scale,
        keySignature = KeySignature.C,
        noteRangeIndices,
        gameType,
    } = practiceSettings;

    const SCALES = Object.values(Scale).map((v) => ({ key: v, value: t(`music.scaleType.${v}`) }));
    const DEFAULT_SCALE = SCALES.find((acc) => acc.key === scale);
    // const DEFAULT_ACCIDENT = ACCIDENTS.find((acc) => acc.key === accident);

    const keySigArray = isMinorKey ? MINOR_KEY_SIGNATURES : MAJOR_KEY_SIGNATURES;
    const altKeySigArray = isMinorKey ? MAJOR_KEY_SIGNATURES : MINOR_KEY_SIGNATURES;
    const keySigIndex = keySigArray.findIndex((key) => key === keySignature);

    const CURR_KEY_SIGNATURES = keySigArray.map((v) => ({ label: v, value: v.toLowerCase() }));

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
    }, [clef, keySignature, accident]);

    // const rangeNotes = allNotes.filter((_, idx) => noteRangeIndices.low < idx && idx < noteRangeIndices.high);

    const onNoteRangeSliderChange = useCallback((low: number, high: number) => {
        updatePracticeSettings("noteRangeIndices", { low, high });
    }, []);

    // CREATE A LEVEL IN MEMORY, THEN REFERENCE IT WITHIN GAME COMPONENT
    const startPracticeGame = useCallback(async () => {
        const levelId: LevelId = `${clef}-practice`;
        const noteRanges = [`${allNotes[noteRangeIndices.low]}:::${allNotes[noteRangeIndices.high]}` as NoteRange];
        // console.log({ clef, accident, keySignature });
        // console.log("allNotes::::", allNotes, allNotes[noteRangeIndices.low], allNotes[noteRangeIndices.high]);

        const practiceLevelSingle: Level = {
            id: levelId,
            name: "single note practice",
            skillLevel: Knowledge.intermediary,
            clef,
            type: GameType.Single,
            durationInSeconds: 400,
            // durationInSeconds: 60,
            noteRanges,
            winConditions: { [WinRank.Gold]: 30, [WinRank.Silver]: 25, [WinRank.Bronze]: 20 },
            keySignature,
            timeSignature: TimeSignature["4/4"],
            index: ALL_LEVELS.length - 1,
            scale,
        };

        const practiceLevelMelody: Level = {
            id: levelId,
            name: "melody practice",
            skillLevel: Knowledge.intermediary,
            clef,
            type: GameType.Melody,
            timeSignature: TimeSignature["4/4"],
            noteRanges,
            durationInSeconds: 400,
            // durationInSeconds: 60,
            winConditions: { [WinRank.Gold]: 30, [WinRank.Silver]: 25, [WinRank.Bronze]: 20 },
            keySignature,
            index: ALL_LEVELS.length - 1,
            scale,
        };

        // console.log({ practiceLevelSingle, practiceLevelMelody, noteRanges });

        // !important! Practice games are pushed into levels before game begins, then they are popped out from levels
        console.log("gameType: ", gameType);
        const practiceGame = gameType == GameType.Single ? practiceLevelSingle : practiceLevelMelody;
        ALL_LEVELS.push(practiceGame);

        await wait(200);

        router.push({
            pathname: "/game-level/[id]",
            params: { id: levelId, clef, keySignature, previousPage: "/practice" },
        });
    }, [
        clef,
        accident,
        noteRangeIndices.low,
        noteRangeIndices.high,
        CURR_KEY_SIGNATURES,
        keySignature,
        allNotes,
        ALL_LEVELS,
    ]);

    const loNote = allNotes?.[noteRangeIndices.low] || "c/4";
    const hiNote = allNotes?.[noteRangeIndices.high] || "c/5";

    // useEffect(() => {
    //     console.log({
    //         noteRangeIndices,
    //         // allNotes,
    //         lo: allNotes?.[noteRangeIndices.low],
    //         hi: allNotes?.[noteRangeIndices.high],
    //     });
    // }, [noteRangeIndices, allNotes]);

    return (
        <SafeAreaView style={{ minHeight: "100%", backgroundColor: Colors[theme].bg }}>
            <ScrollView contentContainerStyle={s.container}>
                <AppView style={s.top}>
                    <AppView style={{ position: "absolute", left: 0, top: 6 }}>
                        <BackLink onPress={() => endGame()} />
                    </AppView>
                    <AppText type="subtitle">{t("practice.title")}</AppText>
                </AppView>

                <AppView style={s.controlsContainer}>
                    <AppView style={s.clefSwitch}>
                        <AppText>{t("music.clef")}</AppText>
                        <AppText style={{ fontSize: 34, lineHeight: 80 }}>{glyphs.trebleClef}</AppText>
                        <AppSwitch
                            value={clef == Clef.Bass}
                            setValue={(val) => {
                                updatePracticeSettings("clef", val ? Clef.Bass : Clef.Treble);
                            }}
                        />
                        <AppText
                            style={{
                                fontSize: 48,
                                marginTop: 6,
                                marginLeft: -8,
                                lineHeight: 80,
                            }}
                        >
                            {glyphs.bassClef}
                        </AppText>
                    </AppView>

                    <AppView>
                        <AppView style={[s.keySignatureContainer, { backgroundColor: Colors[theme].bgSelected }]}>
                            <AppView transparentBG>
                                <AppView transparentBG style={s.box}>
                                    <AppText>{t("music.keySignature")}</AppText>
                                    <AppText type="mdSemiBold">{keySignature}</AppText>
                                </AppView>
                            </AppView>

                            <AppView transparentBG style={s.box}>
                                <KeySignatureSlider
                                    keySignatures={CURR_KEY_SIGNATURES.map((item) => item.label)}
                                    keySigIndex={keySigIndex}
                                    setKeySigIndex={(n) => {
                                        const keySig = keySigArray.find((_, i) => i == n);
                                        updatePracticeSettings("keySignature", keySig);
                                    }}
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

                        <AppView>
                            <AppText>{t("music.scale")}</AppText>
                            <SelectList
                                data={SCALES}
                                save="key"
                                setSelected={(val: ScaleType) => updatePracticeSettings("scale", val)}
                                search={false}
                                defaultOption={DEFAULT_SCALE}
                                inputStyles={{
                                    color: Colors[theme].text,
                                    backgroundColor: Colors[theme].bg,
                                }}
                                dropdownTextStyles={{
                                    color: Colors[theme].text,
                                }}
                                disabledTextStyles={{
                                    color: Colors[theme].textMute,
                                }}
                                boxStyles={{}}
                                dropdownStyles={{}}
                                disabledItemStyles={{}}
                                dropdownItemStyles={{}}
                            />
                        </AppView>
                    </AppView>

                    <AppView style={s.sheetMusicContainer}>
                        <SheetMusic.RangeDisplay
                            clef={clef}
                            keySignature={keySignature}
                            keys={[[allNotes[noteRangeIndices.low], allNotes[noteRangeIndices.high]]]}
                        />
                    </AppView>

                    <AppView style={s.rangeSliderContainer}>
                        <AppView style={s.noteRangeDisplay}>
                            <AppText>{t("music.noteRange")}</AppText>
                            <AppText type="mdSemiBold">
                                {t(`music.notes.${loNote.split("/")[0]}`) + "/" + loNote.split("/")[1]}
                            </AppText>
                            <AppText type="mdSemiBold">
                                <FontAwesome5 name="arrows-alt-h" />
                            </AppText>
                            <AppText type="mdSemiBold">
                                {t(`music.notes.${hiNote.split("/")[0]}`) + "/" + hiNote.split("/")[1]}
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

                    <AppView style={[s.keySignatureContainer, { backgroundColor: Colors[theme].bgSelected }]}>
                        <AppView transparentBG style={s.box}>
                            {/* <AppText>{t("music.clef")}</AppText> */}
                            <AppText>{t("game.type.single")}</AppText>
                            <AppSwitch
                                value={gameType == GameType.Melody}
                                setValue={(val) => {
                                    const type = val ? GameType.Melody : GameType.Single;
                                    // console.log({ val, type });
                                    updatePracticeSettings("gameType", type);
                                }}
                            />
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
        paddingHorizontal: 36,
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
        marginVertical: 12,
        paddingVertical: 8,
        borderRadius: 16,
        // ...testBorder("green"),
    },
    rangeSliderContainer: {
        width: "100%",
        alignItems: "center",
        paddingBottom: 16,
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
});
