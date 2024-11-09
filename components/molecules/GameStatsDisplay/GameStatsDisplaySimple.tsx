import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { Colors } from "@/constants/Colors";
import { getGameStats, intl } from "@/constants/helperFns";
import { GameStatsDisplayProps, LevelScore } from "@/constants/types";
import { useAppStore } from "@/hooks/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, useColorScheme } from "react-native";

// export function GameStatsDisplaySimple({ level, hitsPerMinute }: GameStatsDisplayProps) {
//   const theme = useColorScheme() ?? "light";

//   const { currentGame } = useAppStore();

//   if (!currentGame?.rounds || currentGame.rounds.length === 0) return <></>;

//   const { accuracy, attempts, successes, mistakes, score: gs } = getGameStats(level, currentGame?.rounds);
//   const score = gs as LevelScore;

//   // useEffect(() => {
//   //   console.log({ attempts, hitsPerMinute, elapsed, theme });
//   // }, [attempts, hitsPerMinute, elapsed, theme]);

//   return (
//     <AppView style={[s.container, { backgroundColor: "rgba(0, 0, 0, 0)", width: 260 }]}>
//       <AppView style={[s.row, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
//         {/* <AppView style={{ borderWidth: 1, borderColor: "red" }}> */}
//         <Ionicons name="musical-notes-outline" />
//         <AppText>{attempts}</AppText>
//         {/* </AppView> */}
//         {/* <AppView> */}
//         <Ionicons name="checkmark" color={Colors[theme].green} />
//         <AppText>{successes}</AppText>
//         {/* </AppView> */}
//         {/* <AppView> */}
//         <Ionicons name="close-outline" color={Colors[theme].red} />
//         <AppText>{mistakes}</AppText>
//         {/* </AppView> */}
//       </AppView>

//       <AppView style={[s.row, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
//         <Ionicons name="eye-outline" />
//         <AppText>{accuracy}</AppText>
//         <Ionicons name="time-outline" />
//         <AppText>NpM {!hitsPerMinute ? "--" : intl.format(hitsPerMinute ?? 0)}</AppText>
//       </AppView>

//       <AppView style={[s.row, s.score, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
//         <AppText type="subtitle">score {score.valueStr}</AppText>
//       </AppView>
//     </AppView>
//   );
// }

export function GameStatsDisplaySimple({ level, hitsPerMinute }: GameStatsDisplayProps) {
  const theme = useColorScheme() ?? "light";

  const { currentGame } = useAppStore();

  if (!currentGame?.rounds || currentGame.rounds.length === 0) return <></>;

  const { accuracy, attempts, successes, mistakes, score: gs } = getGameStats(level, currentGame?.rounds);
  const score = gs as LevelScore;

  // useEffect(() => {
  //   console.log({ attempts, hitsPerMinute, elapsed, theme });
  // }, [attempts, hitsPerMinute, elapsed, theme]);

  return (
    <AppView style={[s.container, { backgroundColor: "rgba(0, 0, 0, 0)", width: 220, marginHorizontal: "auto" }]}>
      <AppView style={[s.row, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
        <AppView style={s.rowItem}>
          <AppText>
            <Ionicons name="musical-notes-outline" />
          </AppText>
          <AppText>{attempts}</AppText>
        </AppView>

        <AppView style={s.rowItem}>
          <AppText>
            <Ionicons name="checkmark" color={Colors[theme].green} />
          </AppText>
          <AppText>{successes}</AppText>
        </AppView>

        <AppView style={s.rowItem}>
          <AppText>
            <Ionicons name="close-outline" color={Colors[theme].red} />
          </AppText>
          <AppText>{mistakes}</AppText>
        </AppView>
      </AppView>

      <AppView style={[s.row, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
        <AppView style={s.rowItem}>
          <AppText>
            <Ionicons name="eye-outline" />
            &nbsp;
          </AppText>
          <AppText>{accuracy}</AppText>
        </AppView>

        <AppView style={[s.rowItem, { width: 100 }]}>
          <AppText>
            <Ionicons name="time-outline" /> NpM
          </AppText>
          <AppText>{!hitsPerMinute ? "--" : intl.format(hitsPerMinute ?? 0)}</AppText>
        </AppView>
      </AppView>

      <AppView style={[s.row, s.score, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
        <AppText type="subtitle">score {score.valueStr}</AppText>
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
    // gap: 12,
    justifyContent: "space-between",
  },
  separator: {
    height: 12,
  },
  rowItem: {
    minWidth: 42,
    justifyContent: "space-between",
    flexDirection: "row",
    // borderWidth: 1,
    // borderColor: "#444",
  },
  score: {
    paddingVertical: 24,
    // borderWidth: 1,
    // borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
});
