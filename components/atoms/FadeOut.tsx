import { useFocusEffect, usePathname } from "expo-router";
import React, { useRef } from "react";
import { ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

interface FadeInReanimatedProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    x?: number;
    y?: number;
    style?: ViewStyle;
}

const initial = {
    scale: 0.8,
    opacity: 0,
    X: 0,
    Y: 0,
};

export function FadeOut({ children, x = 0, y = 0, duration = 500, delay = 0, style, ...rest }: FadeInReanimatedProps) {
    const delayTimeout = useRef(0);
    const scale = useSharedValue(initial.scale);
    const opacity = useSharedValue(initial.opacity);
    const X = useSharedValue(initial.X);
    const Y = useSharedValue(initial.Y);

    useFocusEffect(
        React.useCallback(() => {
            // console.log("Component focused:", pathname);
            delayTimeout.current = window.setTimeout(() => {
                X.value = withTiming(x, { duration, easing: Easing.linear });
                Y.value = withTiming(y, { duration, easing: Easing.linear });

                opacity.value = withTiming(1, { duration: 20 }, (a) => {
                    opacity.value = withTiming(0, { duration: duration - 20 });
                    scale.value = withTiming(1, { duration: 120, easing: Easing.elastic(3) });
                });
            }, delay);

            return () => {
                opacity.value = initial.opacity;
                X.value = initial.X;
                Y.value = initial.Y;
                scale.value = initial.scale;

                window.clearTimeout(delayTimeout.current);
            };
        }, [opacity, X, Y, x, y, duration, delay])
    );

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: "transparent",
            opacity: opacity.value,
            transform: [{ translateY: Y.value }, { translateX: X.value }, { scale: scale.value }],
        };
    });

    const finalStyle = { ...style };

    return (
        <Animated.View style={[finalStyle, animatedStyle]} {...rest}>
            {children}
        </Animated.View>
    );
}
