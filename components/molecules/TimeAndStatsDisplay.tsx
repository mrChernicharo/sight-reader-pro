import { getLevel } from "@/constants/levels";
import { GameScore } from "@/constants/types";
import { AppView } from "../atoms/AppView";
import { GameStatsDisplay } from "./GameStatsDisplay";
import { CountdownTimer } from "./Timer";
import { StyleSheet } from "react-native";

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

  function onTick(secondsRemaining: number) {
    const percVal = (level.durationInSeconds - secondsRemaining) / level.durationInSeconds;
    if (percVal >= 1) {
      onCountdownFinish();
    }
  }

  return (
    <AppView style={s.container}>
      <GameStatsDisplay gameScore={gameScore} level={level} />

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
