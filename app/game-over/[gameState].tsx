import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { GameStatsDisplay } from "@/components/molecules/GameStatsDisplay";
import { Colors } from "@/constants/Colors";
import { Clef, GameType, KeySignature } from "@/constants/enums";
import { isNoteMatch, pickKeySignature } from "@/constants/helperFns";
import { ALL_LEVELS, getLevel } from "@/constants/levels";
import { useAppStore } from "@/hooks/useStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GameOverScreen() {
  const theme = useColorScheme() ?? "light";
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, "background");
  const games = useAppStore((state) => state.games);
  const { gameState, levelId, clef, keySignature } = useLocalSearchParams() as {
    gameState: "win" | "lose";
    levelId: string;
    clef: Clef;
    keySignature: KeySignature;
  };

  const level = getLevel(levelId);
  const lastGame = games.at(-1);
  const message = gameState === "win" ? "You Win" : "You Lose";
  const emoji = gameState === "win" ? " 🎉 " : " 😩 ";

  if (!lastGame) return null;

  if (lastGame.type !== GameType.Single) return;

  const playerMoves = lastGame?.rounds.map((round) => ({
    ...round,
    success: isNoteMatch(round.attempt!, round.value),
  }));

  const gameScore = playerMoves.reduce(
    (acc, move) => {
      move.success ? (acc.successes += 1) : (acc.mistakes += 1);
      return acc;
    },
    { successes: 0, mistakes: 0 }
  );

  const minuteFraction = 60 / level.durationInSeconds;
  const hitsPerMinute = gameScore.successes * minuteFraction;
  if (!level) return null;

  // console.log({ lastGame }, JSON.stringify({ playerMoves }, null, 2));

  return (
    <SafeAreaView style={[s.container, { backgroundColor }]}>
      <AppView style={s.messageContainer}>
        <AppText type="title">{message}</AppText>

        <GameStatsDisplay gameScore={gameScore} level={level} complete hitsPerMinute={hitsPerMinute} />

        <AppView>
          <AppText style={s.bigEmoji}>{emoji}</AppText>
        </AppView>
      </AppView>

      <AppView style={s.btnsContainer}>
        {gameState === "win" ? (
          <AppButton
            text="Next Level"
            onPress={() => {
              const nextLevel = ALL_LEVELS.find((lvl) => lvl.clef === level.clef && lvl.index === level.index + 1);
              if (nextLevel) {
                router.push({
                  pathname: "/level-details/[id]",
                  params: { id: nextLevel.id, clef },
                });
              } else {
                console.log("NO MORE LEVELS. ZEROU O GAME!");
              }
            }}
          />
        ) : null}

        <AppButton
          text="Play again"
          style={{ ...(gameState === "win" && { backgroundColor: "transparent" }) }}
          textStyle={{ ...(gameState === "win" && { color: Colors[theme].text }) }}
          onPress={() => {
            router.push({
              pathname: "/game-level/[id]",
              params: {
                id: levelId,
                clef,
                ...(level.gameType !== GameType.Rhythm &&
                  level.hasKey && { keySignature: pickKeySignature(level.keySignatures) }),
              },
            });
          }}
        />

        <AppButton
          text="Level selection"
          style={{ backgroundColor: "transparent" }}
          textStyle={{ color: "gray" }}
          onPress={() => {
            router.navigate({
              pathname: "/level-selection",
            });
          }}
        />
      </AppView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  messageContainer: {
    paddingVertical: 64,
    gap: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnsContainer: {
    // flexDirection: "row",
    gap: 12,
  },
  bigEmoji: {
    fontSize: 64,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    lineHeight: 90,
  },
});
