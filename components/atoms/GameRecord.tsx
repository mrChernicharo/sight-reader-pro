import { Colors } from "@/constants/Colors";
import { isNoteMatch } from "@/constants/helperFns";
import { getLevel } from "@/constants/levels";
import { Game } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, useColorScheme } from "react-native";
import { AppText } from "./AppText";
import { AppView } from "./AppView";

const intlDate = new Intl.DateTimeFormat("en-us", { dateStyle: "medium", timeStyle: "medium" });

export function GameRecord({ game }: { game: Game }) {
  const theme = useColorScheme() ?? "light";
  const level = getLevel(game.level_id);
  const aftermath = game.notes.reduce(
    (acc, { note, attempt }) => {
      isNoteMatch(note, attempt) ? acc.successes++ : acc.mistakes++;
      return acc;
    },
    { successes: 0, mistakes: 0 }
  );

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
        <AppText>{aftermath.successes}</AppText>
        <AppText>
          <Ionicons name="close" color={Colors[theme].red} />
        </AppText>
        <AppText>{aftermath.mistakes}</AppText>
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
