import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { Accident, Clef, GameType, KeySignature, LevelAccidentType, ScaleType } from "@/utils/enums";
import { MAJOR_KEY_SIGNATURES, MINOR_KEY_SIGNATURES, chromatickeySignatureNotes } from "@/utils/keySignature";
import { ALL_LEVELS, getLevel } from "@/utils/levels";
import Slider from "@react-native-community/slider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Switch, useColorScheme, useWindowDimensions } from "react-native";
import RangeSlider from "../components/atoms/RangeSlider";
import { ScrollView } from "react-native-gesture-handler";
import { glyphs } from "@/utils/constants";
import { BackLink } from "@/components/atoms/BackLink";
import { Colors } from "@/utils/Colors";
import { explodeNote, isFlatKeySignature } from "@/utils/helperFns";
import { NOTES_FLAT_ALL_OCTAVES, NOTES_SHARP_ALL_OCTAVES } from "@/utils/notes";
import { useAppStore } from "@/hooks/useAppStore";
import { router } from "expo-router";
import { CurrentGame, Level, LevelId, Note } from "@/utils/types";
import { AppSwitch } from "@/components/atoms/AppSwitch";
import { KeySignatureSlider } from "@/components/molecules/KeySlider";
import { Ionicons } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";
import { SheetMusic } from "@/components/molecules/SheetMusic";

const SCALES = Object.values(ScaleType).map((v) => ({
  key: v,
  value: v.toLowerCase(),
}));
const ACCIDENTS = Object.values(LevelAccidentType).map((v) => ({
  key: v,
  value: v.toLowerCase(),
}));
// const KEY_SIGNATURES = Object.values(KeySignature).map((v) => ({ label: v, value: v.toLowerCase() }));

export default function PracticeScreen() {
  // const lvl = getLevel("treble-01");
  const theme = useColorScheme() ?? "light";
  const { width } = useWindowDimensions();
  const { startNewGame } = useAppStore();

  const [isBassClef, setIsBassClef] = useState(false);
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [isMinorKey, setIsMinorKey] = useState(false);
  const [keySigIndex, setKeySigIndex] = useState(7);
  const [accident, setAccident] = useState(LevelAccidentType.None);
  const [scale, setScale] = useState(ScaleType.Chromatic);
  const [rangeIdx, setRangeIdx] = useState({ low: 0, high: 0 });

  const clef = isBassClef ? Clef.Bass : Clef.Treble;
  const keySigArray = isMinorKey ? MINOR_KEY_SIGNATURES : MAJOR_KEY_SIGNATURES;
  const keySignatures = keySigArray.map((v) => ({
    label: v,
    value: v.toLowerCase(),
  }));
  const keySignature = keySignatures[keySigIndex].label;

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

      console.log({ note, index });

      switch (clef) {
        case Clef.Bass:
          return index < 50;
        case Clef.Treble:
          return index >= 24 && index < 78;
      }
    });
  }, [clef, hasKey, keySignature, accident]);

  // const rangeNotes = allNotes.filter((_, idx) => rangeIdx.low < idx && idx < rangeIdx.high);

  const handleValueChange = useCallback(
    (low: number, high: number) => {
      setRangeIdx({ low, high });
    },
    [setRangeIdx]
  );

  const startPracticeGame = useCallback(async () => {
    // console.log({ clef, hasKey, accident, keySignature, range: rangeNotes });
    const levelId: LevelId = `${clef}-practice`;
    const practiceLevel = {
      id: levelId,
      clef,
      description: "",
      durationInSeconds: 600,
      gameType: GameType.Single,
      winConditions: { bronze: 20, silver: 25, gold: 30 },
      noteRanges: [`${allNotes[rangeIdx.low]}:::${allNotes[rangeIdx.high]}`],
      hasKey,
      ...(hasKey ? { keySignatures: [keySignature], scaleType: scale } : { accident }),
    } as Level<GameType.Single>;

    ALL_LEVELS.push(practiceLevel);
    // console.log(":::: ALL_LEVELS", { ALL_LEVELS });

    await startNewGame({
      ...practiceLevel,
      levelId,
      timestamp: Date.now(),
      rounds: [],
      type: GameType.Single,
    } as unknown as CurrentGame<GameType.Single>);

    router.push({
      pathname: "/game-level/[id]",
      params: {
        id: levelId,
        clef,
        keySignature,
        previousPage: "/practice",
      },
    });
  }, [clef, hasKey, accident, rangeIdx, keySignatures, keySignature, allNotes, ALL_LEVELS]);

  // useEffect(() => {
  //   console.log({ rangeNotes });
  // }, [rangeNotes]);

  // useEffect(() => {
  //   console.log("---", { clef, hasKey, accident, keySignatures, keySignature, rangeNotes, allNotes });
  // }, [clef, hasKey, accident, keySignatures, keySignature, rangeNotes, allNotes]);

  return (
    <SafeAreaView style={{ minHeight: "100%" }}>
      <ScrollView contentContainerStyle={[s.container, { backgroundColor: Colors[theme].background }]}>
        <AppView style={s.top}>
          <AppView style={{ position: "absolute", left: 0, top: 4 }}>
            <BackLink />
          </AppView>
          <AppText type="title">Practice Setup</AppText>
        </AppView>

        <AppView style={s.controlsContainer}>
          <AppView style={s.clefSwitchContainer}>
            <AppView style={s.clefSwitch}>
              <AppText>Clef</AppText>
              <AppText style={{ fontSize: 34, lineHeight: 80 }}>{glyphs.trebleClef}</AppText>
              <AppSwitch value={isBassClef} setValue={setIsBassClef} />
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
              <AppText>Key signature</AppText>
              <AppSwitch value={hasKey} setValue={setHasKey} />
              {hasKey && <AppText style={{ fontSize: 20 }}>{keySignature}</AppText>}
            </AppView>
          </AppView>

          {hasKey ? (
            <AppView>
              <AppView style={s.box}>
                <AppText>Major</AppText>
                <AppSwitch value={isMinorKey} setValue={setIsMinorKey} />
                <AppText>Minor</AppText>
              </AppView>

              <AppView style={s.box}>
                <KeySignatureSlider
                  keySignatures={keySignatures.map((item) => item.label)}
                  keySigIndex={keySigIndex}
                  setKeySigIndex={setKeySigIndex}
                />
              </AppView>

              <AppView>
                <AppText>Scale</AppText>
                <SelectList
                  data={SCALES}
                  save="value"
                  setSelected={setAccident}
                  search={false}
                  defaultOption={SCALES[0]}
                  inputStyles={{
                    color: Colors[theme].text,
                    backgroundColor: Colors[theme].background,
                  }}
                  dropdownTextStyles={{
                    color: Colors[theme].text,
                  }}
                  disabledTextStyles={{
                    color: Colors[theme].textMute,
                  }}
                  boxStyles={{
                    marginBottom: 24,
                  }}
                  dropdownStyles={{}}
                  disabledItemStyles={{}}
                  dropdownItemStyles={{}}
                />
              </AppView>
            </AppView>
          ) : (
            <AppView>
              <AppText>Accients</AppText>
              <SelectList
                data={ACCIDENTS}
                save="value"
                setSelected={setAccident}
                search={false}
                defaultOption={ACCIDENTS[0]}
                inputStyles={{
                  color: Colors[theme].text,
                  backgroundColor: Colors[theme].background,
                }}
                dropdownTextStyles={{
                  color: Colors[theme].text,
                }}
                disabledTextStyles={{
                  color: Colors[theme].textMute,
                }}
                boxStyles={{
                  marginBottom: 24,
                }}
              />
            </AppView>
          )}

          <AppView style={s.rangeSliderContainer}>
            <AppText>Note Range</AppText>
            <AppView style={s.rangeDisplay}>
              <AppView>
                <AppText style={[{ fontWeight: "bold" }, { fontSize: 18 }]}>{allNotes[rangeIdx.low]}</AppText>
              </AppView>
              <AppView>
                <AppText style={[{ fontWeight: "bold" }, { fontSize: 18 }]}>{allNotes[rangeIdx.high]}</AppText>
              </AppView>
            </AppView>

            <RangeSlider min={0} max={allNotes.length - 1} step={1} handleValueChange={handleValueChange} />

            <SheetMusic.Range
              clef={clef}
              keySignature={keySignature}
              keys={[[allNotes[rangeIdx.low], allNotes[rangeIdx.high]]]}
            />
          </AppView>
        </AppView>

        <AppView>
          <AppButton
            text="Start"
            onPress={startPracticeGame}
            style={{ width: 300, height: 56 }}
            textStyle={{ color: "white", fontSize: 24 }}
            activeOpacity={0.7}
          />
        </AppView>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 36,
    paddingVertical: 64,
  },
  top: {
    width: "100%",
    position: "relative",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: '#999',
  },
  controlsContainer: {
    width: "100%",
    paddingHorizontal: 16,
    gap: 16,
  },
  clefSwitchContainer: {
    // borderWidth: 1,
    // borderColor: '#999',
  },
  clefSwitch: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    // borderWidth: 1,
    // borderColor: '#999',
  },
  box: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    height: 50,
    // borderWidth: 1,
    // borderColor: '#999',
  },
  keyContainer: {},
  inputContainer: {
    width: "100%",
    gap: 12,
  },
  input: {
    borderWidth: 1,
    // borderColor: "#999",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  rangeSliderContainer: {
    // borderWidth: 1,
    borderColor: "#fff",
    width: "100%",
    alignItems: "center",
  },
  rangeDisplay: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
});
