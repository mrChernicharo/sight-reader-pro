import React, { useEffect } from "react";
import { View, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useFocusEffect, useNavigation, usePathname, useRouter } from "expo-router";

interface FadeInReanimatedProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yPos?: number;
  style?: ViewStyle;
}

export function FadeIn({ children, yPos = 50, duration = 500, delay = 0, style, ...rest }: FadeInReanimatedProps) {
  const opacity = useSharedValue(0);
  const y = useSharedValue(yPos);
  const router = useRouter();
  const pathname = usePathname();

  //   useEffect(() => {
  //     opacity.value = withTiming(1, { duration });
  //     y.value = withTiming(1, { duration });

  //     //    const unsubscribe = navigation.addListener('blur', () => {
  //     //   opacity.value = 0;
  //     // });

  //     return () => {
  //       opacity.value = 0;
  //       y.value = 0;
  //     };
  //   }, [y, opacity, duration]);

  //   useEffect(() => {
  //     opacity.value = withTiming(1, { duration });
  //     y.value = withTiming(1, { duration });
  //   }, [opacity, y, duration]);

  //   useFocusEffect(() => {
  //     opacity.value = 0;
  //     y.value = 0;
  //   });

  useFocusEffect(
    React.useCallback(() => {
      console.log("Component focused:", pathname);

      setTimeout(() => {
        opacity.value = withTiming(1, { duration });
        y.value = withTiming(1, { duration });
      }, delay);

      return () => {
        console.log("Component blurred:", pathname);
        opacity.value = 0;
        y.value = yPos;
      };
    }, [pathname, opacity, y, yPos, duration])
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: y.value }],
    };
  });

  return <Animated.View style={[style, animatedStyle, rest]}>{children}</Animated.View>;
}
