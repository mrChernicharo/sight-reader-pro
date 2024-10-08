import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { MusicNoteRange } from "@/components/molecules/MusicNoteRange";
import { getLevel } from "@/constants/helperFns";
import { SECTIONED_LEVELS } from "@/constants/levels";
import { Clef } from "@/constants/types";
import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";

export default function LevelDetails() {
  const { id, clef } = useLocalSearchParams() as { id: string; clef: Clef };
  const level = getLevel(clef, id);

  if (!level) return null;

  return (
    <AppView style={s.container}>
      <AppText>Level {level?.id}</AppText>
      <AppText>Level {level?.id}</AppText>
      <AppText>Level {level?.id}</AppText>
      <AppText>Level {level?.id}</AppText>

      <AppText type="subtitle" style={s.rangeTitle}>
        Note Range
      </AppText>
      <MusicNoteRange clef={clef} keys={level?.range.split(":::")} />

      <Link
        asChild
        href={{
          pathname: "/game-level/[id]",
          params: { id: String(id), clef, levelAccident: level?.accident, levelRange: level?.range },
        }}
      >
        <TouchableOpacity>
          <AppText>Start Level</AppText>
        </TouchableOpacity>
      </Link>
    </AppView>
  );
}

const s = StyleSheet.create({
  container: {
    padding: 24,
  },
  rangeTitle: {
    marginTop: 52,
    marginBottom: -80,
    zIndex: 1000,
  },
});
