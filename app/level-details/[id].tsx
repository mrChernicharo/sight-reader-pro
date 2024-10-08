import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { MusicNoteRange } from "@/components/molecules/MusicNoteRange";
import { SECTIONED_LEVELS } from "@/constants/levels";
import { Clef } from "@/constants/notes";
import { Link, useLocalSearchParams } from "expo-router";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";

export default function LevelDetails() {
  const { id, clef } = useLocalSearchParams();
  const level = SECTIONED_LEVELS.find((lvl) => lvl.data[0].clef === clef)?.data.find((lvl) => lvl.id === Number(id));

  if (!level) return null;

  return (
    <AppView>
      <AppText>Level {level?.id}</AppText>

      <AppText>Range</AppText>
      <MusicNoteRange clef={clef as Clef} keys={level?.range.split(":::")} />

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
