import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useFocusEffect, useNavigation, usePathname, useRouter } from "expo-router";

interface FadeInReanimatedProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  style?: ViewStyle;
}

export function FadeIn({ children, x = 0, y = 0, duration = 500, delay = 0, style, ...rest }: FadeInReanimatedProps) {
  const delayTimeout = useRef(0);
  const opacity = useSharedValue(0);
  const X = useSharedValue(x);
  const Y = useSharedValue(y);
  const pathname = usePathname();

  useFocusEffect(
    React.useCallback(() => {
      // console.log("Component focused:", pathname);
      delayTimeout.current = window.setTimeout(() => {
        opacity.value = withTiming(1, { duration });
        X.value = withTiming(1, { duration });
        Y.value = withTiming(1, { duration });
      }, delay);

      return () => {
        // console.log("Component blurred:", pathname);
        opacity.value = 0;
        X.value = x;
        Y.value = y;

        window.clearTimeout(delayTimeout.current);
      };
    }, [pathname, opacity, X, Y, x, y, duration])
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: Y.value }, { translateX: X.value }],
    };
  });

  return <Animated.View style={[style, animatedStyle, rest]}>{children}</Animated.View>;
}
