import { GameScore } from "@/app/game-level/[id]";
import { getGameStats } from "@/constants/helperFns";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";

export function GameStatsDisplay({ gameScore, complete }: { gameScore: GameScore; complete?: boolean }) {
  const { accuracy, attempts } = getGameStats(gameScore);

  return (
    <AppView>
      <AppText>
        <Ionicons name="musical-notes-outline" /> {complete && "notes"} {attempts}
      </AppText>
      <AppText>
        <Ionicons name="checkmark" /> {complete && "successes"} {gameScore.successes}
      </AppText>
      <AppText>
        <Ionicons name="close-outline" /> {complete && "mistakes"} {gameScore.mistakes}
      </AppText>
      <AppText>
        <Ionicons name="flash-outline" /> {complete && "accuracy"} {accuracy}
      </AppText>
    </AppView>
  );
}
