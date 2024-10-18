import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";

import { Colors } from "@/constants/Colors";
import { getLevel } from "@/constants/levels";
import { Accident, Clef, GameType, WinRank } from "@/constants/enums";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Level, Note } from "@/constants/types";
import { isNoteHigher } from "@/constants/helperFns";
import { SheetMusic } from "@/components/molecules/SheetMusic";

export function calcGameScore(game: Game) {}

export default function LevelDetails() {
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, "background");
  const { id } = useLocalSearchParams() as { id: string };
  const level = getLevel(id);

  if (!level) return null;

  console.log(":::LevelDetails", level);

  if (level.gameType !== GameType.Single) return;

  const accidentText = level.hasKey ? level.keySignatures.join("") : getAccidentText(level.accident);

  const rangeKeys: [Note, Note][] = level.noteRanges.map((range) => range.split(":::") as [Note, Note]);

  const rangeTitleOffset = getRangeTitleOffset(level);

  return (
    <SafeAreaView style={[s.container, { backgroundColor }]}>
      <AppView style={s.infoContainer}>
        <AppView style={s.top}>
          <BackLink to="/level-selection" />
          <AppText type="title" style={s.title}>
            {level.name}
          </AppText>
          <AppText type="subtitle" style={s.subtitle}>
            {level.id}
          </AppText>
        </AppView>

        <AppView style={s.midContainer}>
          <AppText>{accidentText}</AppText>
          <AppText>
            <Ionicons name="time-outline" /> {level.durationInSeconds} seconds
          </AppText>
          <AppText>
            <Ionicons name="flag-outline" /> {level.winConditions[WinRank.Bronze]}/min
          </AppText>
        </AppView>
      </AppView>

      <AppView style={s.midContainer}>
        <AppText type="subtitle" style={[s.rangeTitle, { marginBottom: rangeTitleOffset }]}>
          Note Range
        </AppText>

        <SheetMusic.Range clef={level.clef} keys={rangeKeys} />
      </AppView>

      <Link
        asChild
        href={{
          pathname: "/game-level/[id]",
          params: { id: String(id) },
        }}
      >
        <AppButton text="Start Level" textStyle={s.ctaText} containerStyle={s.cta} />
      </Link>
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

function getRangeTitleOffset(level: Level) {
  const defaultOffset = -100;
  if (level.gameType === GameType.Rhythm) return defaultOffset;

  let highNote: Note = "a/1";
  level.noteRanges.forEach((range) => {
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

function getAccidentText(accident: Accident) {
  switch (accident) {
    case Accident.None:
      return "no accidents";
    case Accident["#"]:
      return "♯ sharp accidents";
    case Accident.b:
      return "♭ flat accidents";
  }
}
