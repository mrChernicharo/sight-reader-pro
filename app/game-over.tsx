import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { GameStatsDisplay } from "@/components/molecules/GameStatsDisplay/GameStatsDisplay";
import { Colors } from "@/utils/Colors";
import { Clef, GameType, KeySignature } from "@/utils/enums";
import { getGameStats, isNoteMatch, pickKeySignature } from "@/utils/helperFns";
import { ALL_LEVELS, getLevel } from "@/utils/levels";
import { explodeNote } from "@/utils/noteFns";
import { SingleNoteRound } from "@/utils/types";
import { useAppStore } from "@/hooks/useAppStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";

export default function GameOverScreen() {
  const confettiRef = useRef<LottieView>(null);
  const theme = useColorScheme() ?? "light";
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, "background");
  const { games, currentGame, endGame } = useAppStore();

  const level = getLevel(currentGame!.levelId);
  const lastGame = games.at(-1);

  const { attempts, successes, mistakes, accuracy, score, hasWon, hitsPerMinute } = getGameStats(
    level,
    currentGame!.rounds
  );
  const message = hasWon ? "You Win" : "You Lose";
  const emoji = hasWon ? " 🎉 " : " 😩 ";

  useEffect(() => {
    // console.log("::: game-over", { level, hasWon });
    if (hasWon && confettiRef.current) {
      setTimeout(confettiRef.current.play, 200);
    }

    return () => {
      console.log("::: game-over UNMOUNT");
      endGame();
    };
  }, [hasWon, confettiRef]);

  useEffect(() => {
    console.log("<<< Game Over >>>", { attempts, successes, mistakes, accuracy, score, hasWon, hitsPerMinute });
  }, [attempts, successes, mistakes, accuracy, score, hasWon, hitsPerMinute]);

  if (!currentGame || !currentGame?.rounds?.length) return null;
  if (!level || !lastGame) return null;

  return (
    <SafeAreaView style={[s.container, { backgroundColor }]}>
      <AppView style={s.lottieConfetti}>
        <LottieView source={require("@/assets/lottie/confettie-explosion-animation.lottie.json")} ref={confettiRef} />
      </AppView>

      <AppView style={[s.messageContainer, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
        <AppText type="title">{message}</AppText>

        <GameStatsDisplay level={level} hitsPerMinute={hitsPerMinute} />

        <AppView style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}>
          <AppText style={[s.bigEmoji]}>{emoji}</AppText>
        </AppView>
      </AppView>

      <AppView style={s.btnsContainer}>
        {hasWon ? (
          <AppButton
            text="Next Level"
            onPress={() => {
              const nextLevel = ALL_LEVELS.find((lvl) => lvl.clef === level.clef && lvl.index === level.index + 1);
              if (nextLevel) {
                router.navigate({
                  pathname: "/level-details/[id]",
                  params: { id: nextLevel.id, clef: nextLevel.clef },
                });
              } else {
                console.log("NO MORE LEVELS. ZEROU O GAME!");
              }
            }}
          />
        ) : null}

        <AppButton
          text="Play again"
          style={{
            ...(hasWon && { backgroundColor: "rgba(0, 0, 0, 0)" }),
          }}
          textStyle={{ ...(hasWon && { color: Colors[theme].text }) }}
          onPress={() => {
            router.replace({
              pathname: "/game-level/[id]",
              params: {
                id: level.id,
                keySignature: pickKeySignature(level),
                previousPage: "/level-details",
              },
            });
          }}
        />

        <AppButton
          text="Level selection"
          style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
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
    backgroundColor: "rgba(0, 0, 0, 0)",
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
  lottieConfetti: {
    // borderColor: "#fff",
    // borderWidth: 1,
    position: "absolute",
    pointerEvents: "none",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
