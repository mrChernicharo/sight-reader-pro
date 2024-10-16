import { getLevel } from "@/constants/levels";
import { GameScore } from "@/constants/types";
import { AppView } from "../atoms/AppView";
import { GameStatsDisplay } from "./GameStatsDisplay";
import { CountdownTimer } from "./Timer";
import { StyleSheet } from "react-native";
import { useState } from "react";

export function TimerAndStatsDisplay({
  levelId,
  gameScore,
  onCountdownFinish,
}: {
  levelId: string;
  gameScore: GameScore;
  onCountdownFinish: () => void;
}) {
  const level = getLevel(levelId);
  const [hitsPerMinute, setHitsPerMinute] = useState(0);

  function onTick(secondsRemaining: number) {
    const elapsedPercent = (level.durationInSeconds - secondsRemaining) / level.durationInSeconds;
    const minuteFraction = 60 / level.durationInSeconds;
    const _hitsPerMinute = (gameScore.successes * minuteFraction) / elapsedPercent;
    setHitsPerMinute(_hitsPerMinute);

    if (elapsedPercent >= 1) {
      onCountdownFinish();
    }
  }

  return (
    <AppView style={s.container}>
      <GameStatsDisplay gameScore={gameScore} level={level} hitsPerMinute={hitsPerMinute} />

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
