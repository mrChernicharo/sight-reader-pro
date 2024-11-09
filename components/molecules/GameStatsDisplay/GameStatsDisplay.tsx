import { Colors } from "@/utils/Colors";
import { getGameStats, intl } from "@/utils/helperFns";
import { GameScore, GameStatsDisplayProps, Level, LevelScore } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { AppText } from "../../atoms/AppText";
import { AppView } from "../../atoms/AppView";
import { GameType } from "@/utils/enums";
import { useAppStore } from "@/hooks/useAppStore";

export function GameStatsDisplay({ level, hitsPerMinute }: GameStatsDisplayProps) {
  const theme = useColorScheme() ?? "light";

  const { currentGame } = useAppStore();

  if (!currentGame?.rounds || currentGame.rounds.length === 0) return <></>;

  const { accuracy, attempts, successes, mistakes, score: gs } = getGameStats(level, currentGame?.rounds);
  const score = gs as LevelScore;
  const notesPerMinute = !hitsPerMinute ? "--" : intl.format(hitsPerMinute ?? 0);
  // useEffect(() => {
  //   console.log({ attempts, hitsPerMinute, elapsed, theme });
  // }, [attempts, hitsPerMinute, elapsed, theme]);

  return (
    <AppView style={[s.container, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
      <AppView style={[s.separator, { backgroundColor: "rgba(0, 0, 0, 0)" }]} />

      <AppView style={[s.row, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
        <AppView style={s.rowItem}>
          <AppText>
            <Ionicons name="time-outline" />
            &nbsp;Notes per minute
          </AppText>
          <AppView>
            <AppText>{notesPerMinute}</AppText>
          </AppView>
        </AppView>

        <AppView style={s.rowItem}>
          <AppText>
            <Ionicons name="eye-outline" />
            &nbsp;Accuracy
          </AppText>
          <AppView>
            <AppText>{accuracy}</AppText>
          </AppView>
        </AppView>
      </AppView>

      <AppView style={[s.row, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
        <AppView style={[s.rowItem]}>
          <AppText>
            <Ionicons name="musical-notes-outline" />
            &nbsp;Attempts
          </AppText>
          <AppView>
            <AppText>{attempts}</AppText>
          </AppView>
        </AppView>

        <AppView style={s.rowItem}>
          <AppText>
            <Ionicons name="checkmark" color={Colors[theme].green} />
            &nbsp;Successes
          </AppText>
          <AppView>
            <AppText>{successes}</AppText>
          </AppView>
        </AppView>

        <AppView style={s.rowItem}>
          <AppText>
            <Ionicons name="close-outline" color={Colors[theme].red} />
            &nbsp;Mistakes
          </AppText>
          <AppView>
            <AppText>{mistakes}</AppText>
          </AppView>
        </AppView>
      </AppView>

      <AppView style={[s.score, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
        <AppView style={{ alignItems: "flex-end", width: 120 }}>
          <AppText style={{ color: Colors[theme].textMute }}>{score.hits} hits</AppText>
          <AppText style={{ color: Colors[theme].textMute }}>{score.hitScore} pts</AppText>
          <AppText style={{ color: Colors[theme].textMute }}>{score.multiplier} mult</AppText>
          <AppText style={{ position: "absolute", left: 20, top: 36, color: Colors[theme].textMute }}>X</AppText>
        </AppView>

        <AppView style={[{ height: 1, backgroundColor: Colors[theme].text, width: 160, marginVertical: 12 }]} />

        <AppView style={{ alignItems: "center" }}>
          <AppText type="subtitle">TOTAL SCORE</AppText>
          <AppText type="title">{score.valueStr}</AppText>
        </AppView>
      </AppView>
    </AppView>
  );
}

// export function GameStatsDisplaySimple({ level, hitsPerMinute }: GameStatsDisplay) {
//   const theme = useColorScheme() ?? "light";

//   const { currentGame } = useAppStore();

//   if (!currentGame?.rounds || currentGame.rounds.length === 0) return <></>;

//   const { accuracy, attempts, successes, mistakes, score: gs } = getGameStats(level, currentGame?.rounds);
//   const score = gs as LevelScore;

//   // useEffect(() => {
//   //   console.log({ attempts, hitsPerMinute, elapsed, theme });
//   // }, [attempts, hitsPerMinute, elapsed, theme]);

//   return (
//     <AppView style={[s.container, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
//       <AppView style={[s.row, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
//         <AppText>
//           <Ionicons name="musical-notes-outline" /> {attempts}
//         </AppText>
//         <AppText>
//           <Ionicons name="checkmark" color={Colors[theme].green} /> {successes}
//         </AppText>
//         <AppText>
//           <Ionicons name="close-outline" color={Colors[theme].red} /> {mistakes}
//         </AppText>
//       </AppView>

//       <AppView style={[s.row, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
//         <AppText>
//           <Ionicons name="eye-outline" /> {accuracy}
//         </AppText>
//         <AppText>
//           <Ionicons name="time-outline" /> NpM {!hitsPerMinute ? "--" : intl.format(hitsPerMinute ?? 0)}
//         </AppText>
//       </AppView>

//       <AppView style={[s.row, s.score, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
//         <AppText type="subtitle">score {score.valueStr}</AppText>
//       </AppView>
//     </AppView>
//   );
// }

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
    paddingVertical: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
