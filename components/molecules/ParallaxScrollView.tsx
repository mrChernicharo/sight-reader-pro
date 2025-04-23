import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from "react-native-reanimated";

import { AppView } from "@/components/atoms/AppView";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
    headerImage: ReactElement;
    headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({ children, headerImage, headerBackgroundColor }: Props) {
    const colorScheme = useTheme();
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
                    ),
                },
                {
                    scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
                },
            ],
        };
    });

    return (
        <AppView style={styles.container}>
            <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
                <Animated.View
                    style={{
                        ...styles.header,
                        backgroundColor: headerBackgroundColor[colorScheme],
                        ...headerAnimatedStyle,
                    }}
                >
                    {headerImage}
                </Animated.View>
                <AppView style={styles.content}>{children}</AppView>
            </Animated.ScrollView>
        </AppView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 250,
        overflow: "hidden",
    },
    content: {
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: "hidden",
    },
});
