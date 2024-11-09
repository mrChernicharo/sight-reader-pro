import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";

import { SheetMusic } from "@/components/molecules/SheetMusic";
import { Colors } from "@/utils/Colors";
import { LevelAccidentType, Clef, GameType, WinRank, KeySignature } from "@/utils/enums";
import { isNoteHigher, pickKeySignature } from "@/utils/helperFns";
import { getLevel } from "@/utils/levels";
import { Level, Note } from "@/utils/types";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LevelDetails() {
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, "background");
  const { id } = useLocalSearchParams() as { id: string };
  const level = getLevel(id);

  if (!level) return null;

  // console.log(":::LevelDetails", level);

  // if (level.gameType !== GameType.Single) return;

  const displayInfo = {
    rangeTitleOffset: getRangeTitleOffset(level),
    accidentText: level.hasKey ? level.keySignatures.join(" | ") : getAccidentText(level.accident),
    rangeKeys: (level as Level<GameType.Single>).noteRanges.map((range) => range.split(":::") as [Note, Note]),
  };

  function handleNewGame() {
    switch (level.gameType) {
      case GameType.Single:
      case GameType.Melody: {
        const chosenKeySignature = pickKeySignature(level);
        // console.log({ level, displayInfo, chosenKeySignature });
        router.push({
          pathname: "/game-level/[id]",
          params: { id: String(id), keySignature: chosenKeySignature, previousPage: "/level-details" },
        });
      }
    }
  }

  return (
    <SafeAreaView style={[s.container, { backgroundColor }]}>
      <AppView style={s.infoContainer}>
        <BackLink to="/level-selection" style={s.backlink} />

        <AppView style={s.top}>
          <AppText type="title" style={s.title}>
            {level.name}
          </AppText>
          <AppText type="subtitle" style={s.subtitle}>
            {level.id}
          </AppText>
        </AppView>

        <AppView style={s.midContainer}>
          <AppText>{level.gameType}</AppText>
          <AppText>{displayInfo.accidentText}</AppText>
          <AppText>
            <Ionicons name="time-outline" /> {level.durationInSeconds} seconds
          </AppText>
          <AppText>
            <Ionicons name="flag-outline" /> {level.winConditions[WinRank.Bronze]}/min
          </AppText>
        </AppView>
      </AppView>

      <AppView style={s.midContainer}>
        <AppText type="subtitle" style={[s.rangeTitle, { marginBottom: displayInfo.rangeTitleOffset }]}>
          Note Range
        </AppText>

        <SheetMusic.Range
          clef={level.clef}
          keys={displayInfo.rangeKeys}
          keySignature={level.hasKey ? level.keySignatures[0] : KeySignature["C"]}
        />
      </AppView>

      <AppButton text="Start Level" textStyle={s.ctaText} containerStyle={s.cta} onPress={handleNewGame} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 64,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  backlink: {
    transform: [{ translateX: -8 }, { translateY: 0 }],
  },
  infoContainer: { width: "100%" },
  top: {
    paddingBottom: 8,
    // borderWidth: 1,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    color: "gray",
    paddingTop: 6,
    textAlign: "center",
  },
  midContainer: {
    alignItems: "center",
    // borderWidth: 1,
  },
  rangeTitle: {
    marginTop: 52,
    zIndex: 1000,
    // borderWidth: 1,
  },
  cta: {
    width: "90%",
  },
  ctaText: {
    color: "white",
  },
});

function getRangeTitleOffset(level: Level<GameType>) {
  if (!(level as Level<GameType.Single>).noteRanges) {
    throw Error("getRangeTitleOffset [ERROR] :: level.noteRanges is wonky");
  }

  const defaultOffset = -100;
  if (level.gameType === GameType.Rhythm) return defaultOffset;

  let highNote: Note = "a/1";
  (level as Level<GameType.Single>).noteRanges.forEach((range) => {
    const [, high] = range.split(":::") as [Note, Note];
    if (isNoteHigher(high, highNote)) {
      highNote = high;
    }
  });

  const [note, octave] = highNote.split("/");
  // console.log(highNote, note, octave, clef, defaultOffset);
  switch (level.clef) {
    case Clef.Bass:
      if (+octave > 3 || (+octave == 3 && note >= "g")) return defaultOffset + 50;
      return defaultOffset;
    case Clef.Treble:
      if (+octave > 6 || (+octave == 6 && note >= "a")) return defaultOffset + 50;
      return defaultOffset;
    default:
      return defaultOffset;
  }
}

function getAccidentText(levelAccident: LevelAccidentType) {
  switch (levelAccident) {
    case LevelAccidentType.None:
      return "no accidents";
    case LevelAccidentType["#"]:
      return "♯ sharp accidents";
    case LevelAccidentType.b:
      return "♭ flat accidents";
    default:
      return "@TODO";
  }
}
