import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { GameStatsDisplay } from "@/components/molecules/GameStatsDisplay/GameStatsDisplay";
import { Colors } from "@/utils/Colors";
import { Clef, GameType, KeySignature } from "@/utils/enums";
import { getGameStats, isNoteMatch, pickKeySignature } from "@/utils/helperFns";
import { ALL_LEVELS, getLevel } from "@/utils/levels";
import { SingleNoteRound } from "@/utils/types";
import { useAppStore } from "@/hooks/useAppStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
import { Animated, Dimensions, Easing, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Confetti } from "@/components/molecules/Game/Confetti";
import { useIntl } from "@/hooks/useIntl";

export default function GameOverScreen() {
  // const confettiRef = useRef<LottieView>(null);
  const { intl } = useIntl();
  const theme = useColorScheme() ?? "light";
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, "background");
  const { games, currentGame, endGame } = useAppStore();

  const level = getLevel(currentGame?.levelId ?? "basics 01");
  const lastGame = games.at(-1);

  const { attempts, successes, mistakes, accuracy, score, hasWon, hitsPerMinute } = getGameStats(
    level,
    currentGame!.rounds,
    intl
  );
  const emoji = hasWon ? " 🎉 " : " 😩 ";
  const message = (hasWon ? "You Win" : "You Lose") + emoji;

  useEffect(() => {
    // console.log("::: game-over", { level, hasWon });
    // const confetti = confettiRef.current;
    // if (confetti) {
    //   // if (hasWon && confetti) {
    //   setTimeout(() => {
    //     console.log("::: confetti", confetti);
    //     confetti.play();
    //   }, 200);
    // }

    return () => {
      console.log("::: game-over UNMOUNT");
      endGame();
    };
  }, [hasWon]);

  // useEffect(() => {
  //   console.log("<<< Game Over >>>", { attempts, successes, mistakes, accuracy, score, hasWon, hitsPerMinute });
  // }, [attempts, successes, mistakes, accuracy, score, hasWon, hitsPerMinute]);

  if (!currentGame || !currentGame?.rounds?.length) return null;
  if (!level || !lastGame) return null;

  return (
    <SafeAreaView style={[s.container, { backgroundColor }]}>
      <ScrollView style={{ width: "100%" }}>
        <AppView style={{ minHeight: Dimensions.get("screen").height }}>
          <Confetti x={-120} duration={2000} />
          <Confetti x={0} y={-50} duration={2000} delay={500} />
          <Confetti x={120} duration={2000} delay={1000} />

          <AppView style={[s.messageContainer, { backgroundColor: "rgba(0, 0, 0, 0)" }]}>
            <AppText type="title">{message}</AppText>

            <GameStatsDisplay level={level} hitsPerMinute={hitsPerMinute} />
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
              style={{ backgroundColor: "rgba(0, 0, 0, 0)", marginBottom: 36 }}
              textStyle={{ color: "gray" }}
              onPress={() => {
                router.navigate({
                  pathname: "/level-selection",
                });
              }}
            />
          </AppView>
        </AppView>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    // paddingBottom: 64,
    // paddingTop: 12,
    // minHeight: Dimensions.get("screen").height,
  },
  messageContainer: {
    paddingVertical: 64,
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  btnsContainer: {
    // flexDirection: "row",
    paddingHorizontal: 36,
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
