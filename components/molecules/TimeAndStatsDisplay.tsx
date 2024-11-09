import { getLevel } from "@/constants/levels";
import { GameScore } from "@/constants/types";
import { AppView } from "../atoms/AppView";
import { CountdownTimer } from "./Timer";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import { getGameStats } from "@/constants/helperFns";
import { GameStatsDisplaySimple } from "./GameStatsDisplay/GameStatsDisplaySimple";

export function TimerAndStatsDisplay({
  levelId,
  onCountdownFinish,
}: {
  levelId: string;
  onCountdownFinish: () => void;
}) {
  const level = getLevel(levelId);
  const [hitsPerMinute, setHitsPerMinute] = useState(0);
  const { currentGame } = useAppStore();
  const { successes } = getGameStats(level, currentGame?.rounds ?? []);

  function onTick(secondsRemaining: number) {
    const elapsedPercent = (level.durationInSeconds - secondsRemaining) / level.durationInSeconds;
    const minuteFraction = 60 / level.durationInSeconds;
    const _hitsPerMinute = (successes * minuteFraction) / elapsedPercent;
    setHitsPerMinute(_hitsPerMinute);

    if (elapsedPercent >= 1) {
      onCountdownFinish();
    }
  }

  return (
    <AppView style={s.container}>
      <GameStatsDisplaySimple level={level} hitsPerMinute={hitsPerMinute} />

      <CountdownTimer initialTime={level.durationInSeconds} onTick={onTick} />
    </AppView>
  );
}
const s = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    // borderWidth: 1,
  },
});
