import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { MusicNoteRange } from "@/components/molecules/MusicNoteRange";
import { getLevel } from "@/constants/helperFns";
import { SECTIONED_LEVELS } from "@/constants/levels";
import { Accident, Clef, Game } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export function calcGameScore(game: Game) {}

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
  const { id, clef } = useLocalSearchParams() as { id: string; clef: Clef };
  const level = getLevel(clef, id);

  if (!level) return null;

  const accidentText = getAccidentText(level.accident);

  return (
    <SafeAreaView style={s.container}>
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
        <AppText type="subtitle" style={s.rangeTitle}>
          Note Range
        </AppText>

        <MusicNoteRange clef={clef} keys={level.range.split(":::")} />
      </AppView>

      <Link
        asChild
        href={{
          pathname: "/game-level/[id]",
          params: { id: String(id), clef, levelAccident: level?.accident, levelRange: level?.range },
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
    marginBottom: -80,
    zIndex: 1000,
  },
  cta: {
    width: "90%",
  },
  ctaText: {
    color: "white",
  },
});
