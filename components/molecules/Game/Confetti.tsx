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

export interface ConfettiProps {
  height?: number;
  x?: number;
  y?: number;
  delay?: number;
  duration?: number;
}

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export function Confetti(props: ConfettiProps) {
  const { height = 150, x = 0, y = 0, delay = 0, duration = 1000 } = props;
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      delay,
      duration,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <AppView style={s.lottieContainer}>
      <AnimatedLottieView
        style={[s.lottieConfetti, { height, transform: [{ translateX: x }, { translateY: y }] }]}
        source={require("@/assets/lottie/confettie-explosion-animation.lottie.json")}
        progress={animationProgress.current}
      />
    </AppView>
  );
}

const s = StyleSheet.create({
  lottieContainer: {
    // borderWidth: 1,
    // borderColor: "red",
    width: Dimensions.get("screen").width,
    height: 0,
  },
  lottieConfetti: {
    backgroundColor: "transparent",
    width: Dimensions.get("screen").width - 2,
    position: "absolute",
    zIndex: 0,
  },
});
