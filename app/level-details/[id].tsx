import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { MusicNoteRange } from "@/components/molecules/MusicNoteRange";
import { Colors } from "@/constants/Colors";
import { getLevel } from "@/constants/levels";
import { Accident, Clef, Game, Note } from "@/constants/types";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function calcGameScore(game: Game) {}

function getRangeTitleOffset(clef: Clef, highNote: Note) {
  const [note, octave] = highNote.split("/");
  const defaultOffset = -100;
  // console.log(highNote, note, octave, clef, defaultOffset);
  switch (clef) {
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
    case Accident.B:
      return "♭ flat accidents";
  }
}

export default function LevelDetails() {
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, "background");
  const { id } = useLocalSearchParams() as { id: string };
  const level = getLevel(id);

  if (!level) return null;

  console.log(":::LevelDetails", level);

  const accidentText = getAccidentText(level.accident);
  const [lowNote, highNote] = level.range.split(":::") as [Note, Note];
  const rangeTitleOffset = getRangeTitleOffset(level.clef, highNote);

  return (
    <SafeAreaView style={[s.container, { backgroundColor }]}>
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
      </AppView>

      <AppView style={s.midContainer}>
        <AppText type="subtitle" style={[s.rangeTitle, { marginBottom: rangeTitleOffset }]}>
          Note Range
        </AppText>

        <MusicNoteRange clef={level.clef} keys={[lowNote, highNote]} />
      </AppView>

      <Link
        asChild
        href={{
          pathname: "/game-level/[id]",
          params: { id: String(id), clef: level.clef, levelAccident: level?.accident, levelRange: level?.range },
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
    paddingTop: 48,
    paddingBottom: 64,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  top: {
    width: "100%",
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
  },
  rangeTitle: {
    marginTop: 52,
    zIndex: 1000,
  },
  cta: {
    width: "90%",
  },
  ctaText: {
    color: "white",
  },
});
