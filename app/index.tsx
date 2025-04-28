import AppButton from "@/components/atoms/AppButton";
import { AppLogo } from "@/components/atoms/AppLogo";
import { AppText } from "@/components/atoms/AppText";
import { AppTextLogo } from "@/components/atoms/AppTextLogo";
import { AppView } from "@/components/atoms/AppView";
import { FadeIn } from "@/components/atoms/FadeIn";
import { TooltipTextLines } from "@/components/atoms/TooltipTextLines";
import { LoadingScreen } from "@/components/molecules/LoadingScreen";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { WALKTHROUGH_TOP_ADJUSTMENT } from "@/utils/constants";
import { wait } from "@/utils/helperFns";
import { Link, router, usePathname } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import Animated from "react-native-reanimated";
// import Tooltip from "react-native-walkthrough-tooltip";
import Tooltip, { Placement } from "react-native-tooltip-2";

const tourTextProps = { forceBlackText: true, style: { textAlign: "center" } as StyleProp<TextStyle> };

export function useAppNavigation() {
    const [isNavigating, setIsNavigating] = useState(false);
    const path = usePathname();

    const navigateTo = useCallback(async (route: any) => {
        setIsNavigating(true);
        console.log("navigating to ", route);
        await wait(200);
        router.push({
            pathname: route,
        });
    }, []);

    useEffect(() => {
        console.log("path :::", { p: path });

        if (path) {
            setIsNavigating(false);
        }
    }, [path]);

    useEffect(() => {
        console.log("isNavigating :::", { isNavigating });
    }, [isNavigating]);

    return {
        navigateTo,
        isNavigating,
    };
}

export default function Home() {
    const { t } = useTranslation();
    const { navigateTo, isNavigating } = useAppNavigation();
    const theme = useTheme();

    const username = useAppStore((state) => state.username);
    const hasCompletedTour = useAppStore((state) => state.completedTours.home);
    const setTourCompleted = useAppStore((state) => state.setTourCompleted);

    const [tourStep, setTourStep] = useState(-1);

    const onTooltipDismiss = useCallback(() => {
        setTourStep(-1);
        setTourCompleted("home", true);
    }, [setTourStep, setTourCompleted]);

    useLayoutEffect(() => {
        setTimeout(() => {
            if (!hasCompletedTour) {
                setTourStep(0);
            }
        });
    }, [hasCompletedTour]);

    useEffect(() => {
        if (router.canDismiss()) {
            router.dismissAll();
        }
    }, []);

    const greetingMessage = t("app.welcome") + (username ? `, ${username}` : "!");

    if (isNavigating) return <LoadingScreen />;

    return (
        <AppView style={s.container}>
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
                        onPress={() => navigateTo("/profile")}
                        text={t("routes.profile")}
                        style={{ ...s.btn, borderColor: Colors[theme].text }}
                        textStyle={{ color: Colors[theme].text }}
                    />

                    <AppButton
                        onPress={() => navigateTo("/settings")}
                        text={t("routes.settings")}
                        style={{ ...s.btn, borderColor: Colors[theme].text }}
                        textStyle={{ color: Colors[theme].text }}
                    />
                </AppView>
            </FadeIn>

            <FadeIn y={50} x={0} delay={500}>
                <AppButton
                    onPress={() => navigateTo("/level-selection")}
                    text={t("routes.main.cta")}
                    style={s.cta}
                    textStyle={{ color: "white", fontSize: 24 }}
                    activeOpacity={0.7}
                />
            </FadeIn>

            <Tooltip
                isVisible={tourStep == 0}
                placement={Placement.CENTER}
                topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
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
        </AppView>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 104,
        paddingBottom: 54,
    },
    btnGroup: { alignItems: "center", rowGap: 12, width: 200, marginTop: -32 },
    btn: { backgroundColor: "transparent", borderWidth: StyleSheet.hairlineWidth, width: 200 },
    cta: { width: 300, height: 56 },
});
