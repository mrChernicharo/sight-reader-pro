import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppTextLogo } from "@/components/atoms/AppTextLogo";
import { AppView } from "@/components/atoms/AppView";
import { FadeIn } from "@/components/atoms/FadeIn";
import { TooltipTextLines } from "@/components/atoms/TooltipTextLines";
import { LoadingScreen } from "@/components/molecules/LoadingScreen";
import { useAppStore } from "@/hooks/useAppStore";
import { useLoadingNavigation } from "@/hooks/useLoadingNavigation";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { WALKTHROUGH_TOP_ADJUSTMENT } from "@/utils/constants";
import { router, usePathname } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { StyleProp, StyleSheet, TextStyle, Image, View, Text } from "react-native";
// import Tooltip from "react-native-walkthrough-tooltip";
import Tooltip, { Placement } from "react-native-tooltip-2";
import { eventEmitter } from "./_layout";
import { AppEvents } from "@/utils/enums";
import { WalkthroughTooltip } from "@/components/atoms/WalkthroughTooltip";
import { isDev } from "@/utils/helperFns";
// import { BlurView } from "expo-blur";

const tourTextProps = { forceBlackText: true, style: { textAlign: "center" } as StyleProp<TextStyle> };

export default function Home() {
    const { t } = useTranslation();
    const { navigateTo, isNavigating } = useLoadingNavigation();
    const theme = useTheme();
    const path = usePathname();

    const username = useAppStore((state) => state.username);
    const hasCompletedTour = useAppStore((state) => state.completedTours.home);
    const setTourCompleted = useAppStore((state) => state.setTourCompleted);

    const greetingMessage = t("app.welcome") + (username ? `, ${username}` : "!");

    const [tourStep, setTourStep] = useState(-1);

    const onTooltipDismiss = useCallback(() => {
        setTourStep(-1);
        setTourCompleted("home", true);
    }, [setTourStep, setTourCompleted]);

    useLayoutEffect(() => {
        if (path !== "/") return;
        setTimeout(() => {
            if (!hasCompletedTour) {
                setTourStep(0);
            }
        }, 0);
    }, [path, hasCompletedTour]);

    useEffect(() => {
        if (router.canDismiss()) {
            router.dismissAll();
        }
    }, []);

    if (isNavigating) return <LoadingScreen />;

    return (
        <AppView style={s.outerContainer}>
            <Image style={s.image} source={require("../assets/images/girl.03.png")} />
            <View style={s.container}>
                <FadeIn y={50} x={0} delay={0}>
                    <AppTextLogo subtitles={t("app.slogan")} />
                </FadeIn>

                <FadeIn y={50} x={0} delay={250}>
                    <AppView style={s.btnGroup}>
                        <AppButton
                            onPress={() => navigateTo("/practice")}
                            text={t("routes.practice")}
                            style={{ ...s.btn, borderColor: Colors[theme].text }}
                            textStyle={{ color: Colors[theme].text }}
                        />

                        <AppButton
                            onPress={() => navigateTo("/history")}
                            text={t("routes.history")}
                            style={{ ...s.btn, borderColor: Colors[theme].text }}
                            textStyle={{ color: Colors[theme].text }}
                        />

                        <AppButton
                            onPress={() => navigateTo("/settings")}
                            text={t("routes.settings")}
                            style={{ ...s.btn, borderColor: Colors[theme].text }}
                            textStyle={{ color: Colors[theme].text }}
                        />
                        {isDev() ? (
                            <AppButton
                                onPress={() => navigateTo("/test")}
                                text={"Test"}
                                style={{ ...s.btn, borderColor: Colors[theme].text }}
                                textStyle={{ color: Colors[theme].text }}
                            />
                        ) : null}
                    </AppView>
                </FadeIn>

                <FadeIn y={50} x={0} delay={500}>
                    {/* <BlurView intensity={50} tint="dark"> */}
                    <Text>hello</Text>
                    {/* </BlurView> */}
                    <AppButton
                        onPress={() => navigateTo("/level-selection")}
                        text={t("routes.main.cta")}
                        style={s.cta}
                        textStyle={{ color: "white", fontSize: 24, opacity: 1 }}
                        activeOpacity={0.7}
                    />
                </FadeIn>

                <WalkthroughTooltip
                    isVisible={tourStep == 0}
                    placement={Placement.CENTER}
                    onClose={onTooltipDismiss}
                    content={
                        <AppView transparentBG style={{ alignItems: "center" }}>
                            <AppText {...tourTextProps} type="subtitle">
                                {greetingMessage}
                            </AppText>
                            <TooltipTextLines keypath="tour.home.0" />
                            <AppButton
                                style={{ marginVertical: 6 }}
                                text={t("tour.home.0_ok")}
                                onPress={onTooltipDismiss}
                            />
                        </AppView>
                    }
                />
            </View>
        </AppView>
    );
}

const s = StyleSheet.create({
    outerContainer: {
        position: "relative",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 104,
        paddingBottom: 54,
        backgroundColor: Colors.dark.girlBG_0,
        zIndex: 1,
    },
    container: {
        position: "relative",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 104,
        paddingBottom: 54,
        // backgroundColor: "transparent",
        zIndex: 10,
    },
    btnGroup: { backgroundColor: "transparent", alignItems: "center", rowGap: 12, width: 200, marginTop: -32 },
    btn: {
        backgroundColor: "#000",
        opacity: 0.4,
        // backdropFilter: "blur(0.3)",
        borderWidth: StyleSheet.hairlineWidth,
        width: 200,
    },
    cta: { width: 300, height: 56 },
    image: {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: 280,
        height: 420,
        zIndex: 2,
    },
});
