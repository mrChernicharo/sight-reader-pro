import { useEffect } from "react";
import { AppLogo } from "../atoms/AppLogo";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { Image, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import { useTranslation } from "@/hooks/useTranslation";
import { AppTextLogo } from "../atoms/AppTextLogo";
// import ReactLogo from "@/assets/images/react-logo.png";

const duration = 2000;

export function LoadingScreen() {
    const theme = useTheme();
    const { t } = useTranslation();

    const opacity = useSharedValue(1);
    const rotate = useSharedValue(0);

    const rotationStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: rotate.value + "deg" }],
    }));
    const opacityStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    useEffect(() => {
        rotate.value = withRepeat(withTiming(360, { duration, easing: Easing.linear }), -1, false);
        opacity.value = withRepeat(withTiming(0.15, { duration: 600, easing: Easing.linear }), -1, true);
    }, []);

    return (
        <AppView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <AppTextLogo subtitles="" />

            <Animated.Text style={[s.transparentBg, s.text, opacityStyle, { color: Colors[theme].text }]}>
                {t("app.loading")}...
            </Animated.Text>

            <Animated.View style={[s.transparentBg, rotationStyle]}>
                {/* {<Image source={{ uri: "../assets/images/react-logo.png" }} width={50} height={50} />} */}
            </Animated.View>
        </AppView>
    );
}

const s = StyleSheet.create({
    transparentBg: {
        backgroundColor: "transparent",
    },
    text: {
        marginBottom: 16,
    },
});
