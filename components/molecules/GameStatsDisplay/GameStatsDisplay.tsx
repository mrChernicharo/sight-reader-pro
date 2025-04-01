import { Colors } from "@/utils/Colors";
import { getGameStats } from "@/utils/helperFns";
import { GameScore, GameStatsDisplayProps, Level, LevelScore } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { AppText } from "../../atoms/AppText";
import { AppView } from "../../atoms/AppView";
import { GameType } from "@/utils/enums";
import { useAppStore } from "@/hooks/useAppStore";
import { useIntl } from "@/hooks/useIntl";

export function GameStatsDisplay({ level, hitsPerMinute }: GameStatsDisplayProps) {
  const theme = useColorScheme() ?? "light";
  const { intl } = useIntl();

  const { currentGame } = useAppStore();

  if (!currentGame?.rounds || currentGame.rounds.length === 0) return <></>;

  const { accuracy, attempts, successes, mistakes, score: gs } = getGameStats(level, currentGame?.rounds, intl);
  const score = gs as LevelScore;
  const notesPerMinute = !hitsPerMinute ? "--" : intl.format(hitsPerMinute ?? 0);
  // useEffect(() => {
  //   console.log({ attempts, hitsPerMinute, elapsed, theme });
  // }, [attempts, hitsPerMinute, elapsed, theme]);

  return (
    <AppView transparentBG style={[s.container]}>
      <AppView transparentBG style={[s.separator]} />

      <AppView transparentBG style={[s.row]}>
        <AppView transparentBG style={s.rowItem}>
          <AppText>
            <Ionicons name="time-outline" />
            &nbsp;Notes per minute
          </AppText>
          <AppView>
            <AppText>{notesPerMinute}</AppText>
          </AppView>
        </AppView>

        <AppView transparentBG style={s.rowItem}>
          <AppText>
            <Ionicons name="eye-outline" />
            &nbsp;Accuracy
          </AppText>
          <AppView>
            <AppText>{accuracy}</AppText>
          </AppView>
        </AppView>
      </AppView>

      <AppView transparentBG style={[s.row]}>
        <AppView transparentBG style={[s.rowItem]}>
          <AppText>
            <Ionicons name="musical-notes-outline" />
            &nbsp;Attempts
          </AppText>
          <AppView>
            <AppText>{attempts}</AppText>
          </AppView>
        </AppView>

        <AppView transparentBG style={s.rowItem}>
          <AppText>
            <Ionicons name="checkmark" color={Colors[theme].green} />
            &nbsp;Successes
          </AppText>
          <AppView>
            <AppText>{successes}</AppText>
          </AppView>
        </AppView>

        <AppView transparentBG style={s.rowItem}>
          <AppText>
            <Ionicons name="close-outline" color={Colors[theme].red} />
            &nbsp;Mistakes
          </AppText>
          <AppView>
            <AppText>{mistakes}</AppText>
          </AppView>
        </AppView>
      </AppView>

      <AppView transparentBG style={[s.score]}>
        <AppView transparentBG style={{ alignItems: "flex-end", width: 120 }}>
          <AppText style={{ color: Colors[theme].textMute }}>{score.hits} hits</AppText>
          <AppText style={{ color: Colors[theme].textMute }}>{score.hitScore} pts</AppText>
          <AppText style={{ color: Colors[theme].textMute }}>{score.multiplier} mult</AppText>
          <AppText style={{ position: "absolute", left: 20, top: 36, color: Colors[theme].textMute }}>X</AppText>
        </AppView>

        <AppView
          transparentBG
          style={[{ height: 1, backgroundColor: Colors[theme].text, width: 160, marginVertical: 12 }]}
        />

        <AppView transparentBG style={{ alignItems: "center" }}>
          <AppText type="subtitle">TOTAL SCORE</AppText>
          <AppText type="title">{score.value}</AppText>
        </AppView>
      </AppView>
    </AppView>
  );
}

const s = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderColor: "#cacacaca",
  },
  row: {
    flexDirection: "row",
    // justifyContent: "space-between",
    justifyContent: "center",
  },
  rowItem: {
    alignItems: "center",
    padding: 8,
    minWidth: 80,
    // borderWidth: 1,
    // borderColor: "#444",
  },
  separator: {
    height: 12,
  },
  score: {
    paddingTop: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
