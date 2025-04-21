import { useFocusEffect, usePathname } from "expo-router";
import React, { useRef } from "react";
import { ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface FadeInReanimatedProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    x?: number;
    y?: number;
    style?: ViewStyle;
}

export function FadeOut({ children, x = 0, y = 0, duration = 500, delay = 0, style, ...rest }: FadeInReanimatedProps) {
    const delayTimeout = useRef(1);
    const opacity = useSharedValue(1);
    const X = useSharedValue(0);
    const Y = useSharedValue(0);
    const pathname = usePathname();

    useFocusEffect(
        React.useCallback(() => {
            // console.log("Component focused:", pathname);
            delayTimeout.current = window.setTimeout(() => {
                opacity.value = withTiming(0, { duration });
                X.value = withTiming(x, { duration });
                Y.value = withTiming(y, { duration });
            }, delay);

            return () => {
                // console.log("Component blurred:", pathname);
                opacity.value = 1;
                X.value = 0;
                Y.value = 0;

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
