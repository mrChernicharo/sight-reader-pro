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

export function FadeIn({ children, x = 0, y = 0, duration = 500, delay = 0, style, ...rest }: FadeInReanimatedProps) {
    const delayTimeout = useRef(0);
    const opacity = useSharedValue(0);
    const pointerEvents = useSharedValue("none");
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
                pointerEvents.value = "auto";
            }, delay);

            return () => {
                // console.log("Component blurred:", pathname);
                pointerEvents.value = "none";
                opacity.value = 0;
                X.value = x;
                Y.value = y;

                window.clearTimeout(delayTimeout.current);
            };
        }, [pathname, opacity, X, Y, x, y, duration])
    );

    const animatedStyle = useAnimatedStyle(() => {
        return {
            pointerEvents: pointerEvents.value,
            opacity: opacity.value,
            transform: [{ translateY: Y.value }, { translateX: X.value }],
        };
    });

    return <Animated.View style={{ ...(style as any), ...animatedStyle, ...rest }}>{children}</Animated.View>;
}
