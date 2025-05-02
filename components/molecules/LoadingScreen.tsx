import { useEffect } from "react";
import { AppLogo } from "../atoms/AppLogo";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { Image, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import { useTranslation } from "@/hooks/useTranslation";
import { AppTextLogo } from "../atoms/AppTextLogo";
import AntDesign from "@expo/vector-icons/build/AntDesign";
// import ReactLogo from "@/assets/images/react-logo.png";

const duration = 2000;

export function LoadingScreen() {
    const theme = useTheme();
    const { t } = useTranslation();

    const overallOpacity = useSharedValue(0);
    const opacity = useSharedValue(1);
    const rotate = useSharedValue(0);

    const rotationStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: rotate.value + "deg" }],
    }));
    const opacityStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));
    const overallOpacityStyle = useAnimatedStyle(() => ({
        opacity: overallOpacity.value,
    }));

    useEffect(() => {
        rotate.value = withRepeat(withTiming(360, { duration, easing: Easing.linear }), -1, false);
        opacity.value = withRepeat(withTiming(0.15, { duration: 600, easing: Easing.linear }), -1, true);
        overallOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    }, []);

    return (
        <Animated.View
            style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors[theme].bg }}
        >
            <Animated.View style={[overallOpacityStyle, { flex: 1, justifyContent: "center", alignItems: "center" }]}>
                <AppTextLogo subtitles="" />

                <Animated.Text style={[s.transparentBg, s.text, opacityStyle, { color: Colors[theme].text }]}>
                    {t("app.loading")}...
                </Animated.Text>

                <Animated.View style={[s.transparentBg, rotationStyle]}>
                    {/* {<Image source={{ uri: "../assets/images/react-logo.png" }} width={50} height={50} />} */}
                    <AntDesign name="loading2" size={32} color={Colors[theme].accent} />
                </Animated.View>
            </Animated.View>
        </Animated.View>
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
