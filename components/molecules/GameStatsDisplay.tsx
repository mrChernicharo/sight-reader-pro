import { getGameStats, intl } from "@/constants/helperFns";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import { GameScore, LevelConfig } from "@/constants/types";
import { useEffect, useRef, useState } from "react";
import { CountdownTimer } from "./Timer";

type GameStatsDisplay =
  | {
    level: LevelConfig;
    gameScore: GameScore;
    complete?: boolean;
  } & (
    | {
      showTimer: true;
      onCountdownFinish: () => Promise<void>;
    }
    | {
      showTimer: false;
      onCountdownFinish: undefined;
    }
  );

export function GameStatsDisplay({ level, gameScore, complete, showTimer, onCountdownFinish }: GameStatsDisplay) {
  const initialTime = level.durationInSeconds * 1000;
  const { accuracy, attempts } = getGameStats(level, gameScore);
  const [count, setCount] = useState(initialTime);
  const elapsed = 1 - count / initialTime;
  const hitsPerMinute = gameScore.successes / elapsed;


  useEffect(() => {
    console.log({ attempts, hitsPerMinute, elapsed });
  }, [attempts, hitsPerMinute, elapsed]);


  return (
    <AppView>
      {showTimer && (
        <CountdownTimer
          count={count}
          setCount={setCount}
          initialTime={initialTime}
          onCountdownFinish={onCountdownFinish}
        />
      )}

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
      <AppText>
        <Ionicons name="checkmark" /> {complete && "successes"} {gameScore.successes}
      </AppText>
      <AppText>
        <Ionicons name="time-outline" /> {complete && "notes per minute"} {!hitsPerMinute ? '--' : intl.format(hitsPerMinute ?? 0)}
      </AppText>
    </AppView>
  );
}
