import { Colors } from "@/constants/Colors";
import { getGameStats, isNoteMatch } from "@/constants/helperFns";
import { getLevel } from "@/constants/levels";
import { Game, Note } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, useColorScheme } from "react-native";
import { AppText } from "./AppText";
import { AppView } from "./AppView";
import { GameType } from "@/constants/enums";

const intlDate = new Intl.DateTimeFormat("en-us", { dateStyle: "medium", timeStyle: "medium" });

export function GameRecord({ game }: { game: Game<GameType> }) {
  const theme = useColorScheme() ?? "light";
  const level = getLevel(game.levelId);

  const { successes, mistakes, accuracy } = getGameStats(level, game.rounds);

  return (
    <AppView style={s.container}>
      <AppView>
        <AppText>{level.name}</AppText>
      </AppView>

      <AppView>
        <AppText>{intlDate.format(game.timestamp)}</AppText>
      </AppView>

      <AppView style={s.notesContainer}>
        <AppText>
          <Ionicons name="checkmark" color={Colors[theme].green} />
        </AppText>
        <AppText>{successes}</AppText>

        <AppText>
          <Ionicons name="close" color={Colors[theme].red} />
        </AppText>
        <AppText>{mistakes}</AppText>

        <AppText>
          <Ionicons name="eye-outline" />
        </AppText>
        <AppText>{accuracy}</AppText>
      </AppView>
    </AppView>
  );
}

const s = StyleSheet.create({
  container: {
    padding: 12,
  },
  notesContainer: {
    flexDirection: "row",
    gap: 6,
  },
  gameNote: {
    flexDirection: "row",
    gap: 6,
    margin: 6,
  },
});
