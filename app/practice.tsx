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
import { Clef, GameType, KeySignature, LevelAccidentType, ScaleType, TimeSignature, WinRank } from "@/utils/enums";
import { explodeNote, isFlatKeySignature, wait } from "@/utils/helperFns";
import { MAJOR_KEY_SIGNATURES, MINOR_KEY_SIGNATURES } from "@/utils/keySignature";
import { ALL_LEVELS } from "@/utils/levels";
import { NOTES_FLAT_ALL_OCTAVES, NOTES_SHARP_ALL_OCTAVES } from "@/utils/notes";
import { Level, LevelId } from "@/utils/types";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SelectList } from "react-native-dropdown-select-list";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import RangeSlider from "../components/atoms/RangeSlider";

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
        hasKey,
        isMinorKey,
        accident,
        scaleType,
        keySignature = KeySignature.C,
        noteRangeIndices,
        gameType,
    } = practiceSettings;

    const SCALES = Object.values(ScaleType).map((v) => ({ key: v, value: t(`music.scaleType.${v}`) }));
    const DEFAULT_SCALE = SCALES.find((acc) => acc.key === scaleType);
    const DEFAULT_ACCIDENT = ACCIDENTS.find((acc) => acc.key === accident);

    const keySigArray = isMinorKey ? MINOR_KEY_SIGNATURES : MAJOR_KEY_SIGNATURES;
    const altKeySigArray = isMinorKey ? MAJOR_KEY_SIGNATURES : MINOR_KEY_SIGNATURES;
    const keySigIndex = keySigArray.findIndex((key) => key === keySignature);

    const CURR_KEY_SIGNATURES = keySigArray.map((v) => ({ label: v, value: v.toLowerCase() }));

    const allNotes = useMemo(() => {
        const notes = hasKey
            ? isFlatKeySignature(keySignature)
                ? NOTES_FLAT_ALL_OCTAVES
                : NOTES_SHARP_ALL_OCTAVES
            : accident === LevelAccidentType.b
            ? NOTES_FLAT_ALL_OCTAVES
            : NOTES_SHARP_ALL_OCTAVES;

        return notes.filter((note) => {
            const { index } = explodeNote(note);
            // console.log({ note, index });

            switch (clef) {
                case Clef.Bass:
                    return index < 50;
                case Clef.Treble:
                    return index >= 24 && index < 78;
            }
        });
    }, [clef, hasKey, keySignature, accident]);

    // const rangeNotes = allNotes.filter((_, idx) => noteRangeIndices.low < idx && idx < noteRangeIndices.high);

    // const [gameType, setGameType] = useState(GameType.Single);

    const onNoteRangeSliderChange = useCallback((low: number, high: number) => {
        updatePracticeSettings("noteRangeIndices", { low, high });
    }, []);

    // CREATE A LEVEL IN MEMORY, THEN REFERENCE IT WITHIN GAME COMPONENT
    const startPracticeGame = useCallback(async () => {
        // console.log({ clef, hasKey, accident, keySignature });
        const levelId: LevelId = `${clef}-practice`;
        const noteRanges = [`${allNotes[noteRangeIndices.low]}:::${allNotes[noteRangeIndices.high]}`];
        // console.log("allNotes::::", allNotes, allNotes[noteRangeIndices.low], allNotes[noteRangeIndices.high]);

        const practiceLevelSingle = {
            id: levelId,
            name: "Practice",
            clef,
            gameType: GameType.Single,
            durationInSeconds: 45,
            noteRanges,
            winConditions: { [WinRank.Gold]: 30, [WinRank.Silver]: 25, [WinRank.Bronze]: 20 },
            hasKey,
            ...(hasKey ? { keySignatures: [keySignature], scaleType } : { accident }),
        } as Level<GameType.Single>;

        const practiceLevelMelody = {
            id: levelId,
            name: "Practice",
            clef,
            gameType: GameType.Melody,
            timeSignature: TimeSignature["4/4"],
            noteRanges,
            durationInSeconds: 45,
            winConditions: { [WinRank.Gold]: 30, [WinRank.Silver]: 25, [WinRank.Bronze]: 20 },
            hasKey,
            ...(hasKey ? { keySignatures: [keySignature], scaleType } : { accident }),
        } as Level<GameType.Melody>;

        // console.log({ practiceLevelSingle, practiceLevelMelody, noteRanges });
        // !important! Practice games are pushed into levels before game begins, then they are popped out from levels
        const game = gameType == GameType.Single ? practiceLevelSingle : practiceLevelMelody;
        ALL_LEVELS.push(game);

        await wait(200);

        router.push({
            pathname: "/game-level/[id]",
            params: { id: levelId, clef, keySignature, previousPage: "/practice" },
        });
    }, [
        clef,
        hasKey,
        accident,
        noteRangeIndices.low,
        noteRangeIndices.high,
        CURR_KEY_SIGNATURES,
        keySignature,
        allNotes,
        ALL_LEVELS,
    ]);

    // useEffect(() => {
    //     console.log("---", { hasKey, accident, keySignature });
    // }, [hasKey, accident, keySignature]);

    return (
        <SafeAreaView style={{ minHeight: "100%", backgroundColor: Colors[theme].bg }}>
            <ScrollView contentContainerStyle={s.container}>
                <AppView style={s.top}>
                    <AppView style={{ position: "absolute", left: 0, top: 1 }}>
                        <BackLink onPress={() => endGame()} />
                    </AppView>
                    <AppText type="defaultSemiBold">{t("practice.title")}</AppText>
                </AppView>

                <AppView style={s.controlsContainer}>
                    <AppView style={s.clefSwitchContainer}>
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
                    </AppView>

                    <AppView style={s.keyContainer}>
                        <AppView style={s.box}>
                            <AppText>{t("music.keySignature")}</AppText>
                            <AppSwitch
                                value={hasKey}
                                setValue={async (val) => {
                                    // console.log(val);
                                    if (!val) {
                                        updatePracticeSettings("keySignature", KeySignature.C);
                                        updatePracticeSettings("isMinorKey", false);
                                    }
                                    updatePracticeSettings("hasKey", val);
                                }}
                            />
                            {hasKey && <AppText style={{ fontSize: 20 }}>{keySignature}</AppText>}
                        </AppView>
                    </AppView>

                    <AppView>
                        {hasKey ? (
                            <AppView>
                                <AppView style={s.box}>
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

                                <AppView style={s.box}>
                                    <KeySignatureSlider
                                        keySignatures={CURR_KEY_SIGNATURES.map((item) => item.label)}
                                        keySigIndex={keySigIndex}
                                        setKeySigIndex={(n) => {
                                            const keySig = keySigArray.find((_, i) => i == n);
                                            updatePracticeSettings("keySignature", keySig);
                                        }}
                                    />
                                </AppView>
                            </AppView>
                        ) : (
                            <AppView>
                                <AppText>{t("music.accidents")}</AppText>
                                <SelectList
                                    data={ACCIDENTS}
                                    save="value"
                                    setSelected={(val: LevelAccidentType) => updatePracticeSettings("accident", val)}
                                    search={false}
                                    defaultOption={DEFAULT_ACCIDENT}
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
                                />
                            </AppView>
                        )}

                        <AppView>
                            <AppText>{t("music.scale")}</AppText>
                            <SelectList
                                data={SCALES}
                                save="key"
                                setSelected={(val: ScaleType) => updatePracticeSettings("scaleType", val)}
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

                    <AppView style={s.rangeSliderContainer}>
                        <AppText>{t("music.noteRange")}</AppText>
                        <AppView style={s.rangeDisplay}>
                            <AppView>
                                <AppText style={[{ fontWeight: "bold" }, { fontSize: 18 }]}>
                                    {allNotes[noteRangeIndices.low]}
                                </AppText>
                            </AppView>
                            <AppView>
                                <AppText style={[{ fontWeight: "bold" }, { fontSize: 18 }]}>
                                    {allNotes[noteRangeIndices.high]}
                                </AppText>
                            </AppView>
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

                    <AppView style={s.sheetMusicContainer}>
                        <SheetMusic.RangeDisplay
                            clef={clef}
                            keySignature={keySignature}
                            keys={[[allNotes[noteRangeIndices.low], allNotes[noteRangeIndices.high]]]}
                        />
                    </AppView>
                </AppView>

                <AppView>
                    <AppView style={{ borderWidth: 0, paddingBottom: 16 }}>
                        <AppView style={s.clefSwitch}>
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

                    <AppButton
                        text={t("practice.start")}
                        onPress={startPracticeGame}
                        style={{ width: 300, height: 56 }}
                        textStyle={{ color: "white", fontSize: 24 }}
                        activeOpacity={0.7}
                    />
                    {/* <Button
                        title={t("practice.start")}
                        onPress={startPracticeGame}
                        // ={{ width: 300, height: 56 }}
                        // textStyle={{ color: "white", fontSize: 24 }}
                        // activeOpacity={0.7}
                    /> */}
                </AppView>
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
    top: {
        width: "100%",
        position: "relative",
        alignItems: "center",
    },
    controlsContainer: {
        width: "100%",
        paddingHorizontal: 16,
        gap: 16,
    },
    clefSwitchContainer: {},
    clefSwitch: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
    },
    box: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
    },
    keyContainer: {},
    inputContainer: {
        width: "100%",
        gap: 12,
    },
    input: {
        borderWidth: 1,
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    rangeSliderContainer: {
        borderColor: "#fff",
        width: "100%",
        alignItems: "center",
    },
    rangeDisplay: {
        marginBottom: 8,
        flexDirection: "row",
        gap: 12,
    },
    sheetMusicContainer: {
        // borderWidth: 1,
        // borderStyle: "dashed",
        // borderColor: "red",
        marginBottom: 24,
    },
});
