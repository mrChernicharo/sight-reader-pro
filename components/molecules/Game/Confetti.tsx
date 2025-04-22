import { AppView } from "@/components/atoms/AppView";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet } from "react-native";

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
        const animation = Animated.timing(animationProgress.current, {
            toValue: 1,
            delay,
            duration,
            easing: Easing.ease,
            useNativeDriver: true,
        });
        animation.start();
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
