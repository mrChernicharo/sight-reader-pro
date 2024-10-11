import { getGameStats, intl } from "@/constants/helperFns";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import { GameScore, LevelConfig } from "@/constants/types";
import { useEffect, useRef, useState } from "react";
import { CountdownTimer } from "./Timer";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useColorScheme } from "react-native";

type GameStatsDisplay = {
  level: LevelConfig;
  gameScore: GameScore;
  complete?: boolean;
  elapsed?: number;
};

export function GameStatsDisplay({ level, gameScore, complete, elapsed = 1 }: GameStatsDisplay) {
  const theme = useColorScheme() ?? "light";

  const { accuracy, attempts } = getGameStats(level, gameScore);
  const hitsPerMinute = gameScore.successes / elapsed;

  useEffect(() => {
    console.log({ attempts, hitsPerMinute, elapsed, theme });
  }, [attempts, hitsPerMinute, elapsed, theme]);

  return (
    <AppView>
      <AppView>
        <AppText>
          <Ionicons name="musical-notes-outline" /> {complete && "notes"} {attempts}
        </AppText>
        <AppText>
          <Ionicons name="checkmark" color={Colors[theme].green} /> {complete && "successes"} {gameScore.successes}
        </AppText>
        <AppText>
          <Ionicons name="close-outline" /> {complete && "mistakes"} {gameScore.mistakes}
        </AppText>
      </AppView>
      <AppView>
        <AppText>
          <Ionicons name="flash-outline" /> {complete && "accuracy"} {accuracy}
        </AppText>
        <AppText>
          <Ionicons name="time-outline" /> {complete ? "notes per minute" : "NpM"}{" "}
          {!hitsPerMinute ? "--" : intl.format(hitsPerMinute ?? 0)}
        </AppText>
      </AppView>
    </AppView>
  );
}
