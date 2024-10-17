import { Colors } from "@/constants/Colors";
import { getGameStats, intl } from "@/constants/helperFns";
import { GameScore, Level } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";

type GameStatsDisplay = {
  level: Level;
  gameScore: GameScore;
  hitsPerMinute: number;
  complete?: boolean;
};

export function GameStatsDisplay({ level, gameScore, complete, hitsPerMinute }: GameStatsDisplay) {
  const theme = useColorScheme() ?? "light";

  // const [elapsed, setElapsed] = useState(elapsed);

  const { accuracy, attempts } = getGameStats(level, gameScore);

  // useEffect(() => {
  //   console.log({ attempts, hitsPerMinute, elapsed, theme });
  // }, [attempts, hitsPerMinute, elapsed, theme]);

  return (
    <AppView style={[s.container, !complete && { width: 140 }]}>
      {/*  */}
      <AppView style={[s.row]}>
        {/*  */}
        <AppText>
          {complete && "notes"} <Ionicons name="musical-notes-outline" /> {attempts}
        </AppText>
        <AppText>
          {complete && "successes"} <Ionicons name="checkmark" color={Colors[theme].green} /> {gameScore.successes}
        </AppText>
        <AppText>
          {complete && "mistakes"} <Ionicons name="close-outline" color={Colors[theme].red} /> {gameScore.mistakes}
        </AppText>
        {/*  */}
      </AppView>

      {complete && <AppView style={s.separator} />}

      <AppView style={[s.row]}>
        {/*  */}
        <AppText>
          {complete && "accuracy"} <Ionicons name="eye-outline" /> {accuracy}
          {/* {complete && "accuracy"} <Ionicons name="flash-outline" /> {accuracy} */}
        </AppText>
        <AppText>
          {complete ? "notes per minute" : "NpM"} <Ionicons name="time-outline" />{" "}
          {!hitsPerMinute ? "--" : intl.format(hitsPerMinute ?? 0)}
        </AppText>
        {/*  */}
      </AppView>
      {/*  */}
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
    gap: 12,
    justifyContent: "space-between",
  },
  separator: {
    height: 12,
  },
});
