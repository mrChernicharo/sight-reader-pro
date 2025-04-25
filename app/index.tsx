import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppTextLogo } from "@/components/atoms/AppTextLogo";
import { AppView } from "@/components/atoms/AppView";
import { FadeIn } from "@/components/atoms/FadeIn";
import { TooltipTextLines } from "@/components/atoms/TooltipTextLines";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { WALKTHROUGH_TOP_ADJUSTMENT } from "@/utils/constants";
import { Link, router, usePathname } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import Tooltip from "react-native-walkthrough-tooltip";

const tourTextProps = { forceBlackText: true, style: { textAlign: "center" } as StyleProp<TextStyle> };

export default function Home() {
    const { t } = useTranslation();
    const path = usePathname();
    const theme = useTheme();
    // const { width } = useWindowDimensions();

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
            if (path == "/" && !hasCompletedTour) setTourStep(0);
        });
    }, [hasCompletedTour, path]);

    useEffect(() => {
        if (router.canDismiss()) router.dismissAll();
    }, []);

    const greetingMessage = t("app.welcome") + (username ? `, ${username}` : "!");

    return (
        <AppView style={s.container}>
            <FadeIn y={50} x={0} delay={0}>
                <AppTextLogo subtitles={t("app.slogan")} />
            </FadeIn>

            <FadeIn y={50} x={0} delay={250}>
                <AppView style={{ alignItems: "center", rowGap: 12, width: 200 }}>
                    <Link asChild href="/practice">
                        <AppButton
                            text={t("routes.practice")}
                            style={{ ...s.btn, borderColor: Colors[theme].text }}
                            textStyle={{ color: Colors[theme].text }}
                        />
                    </Link>
                    <Link asChild href="/profile">
                        <AppButton
                            text={t("routes.profile")}
                            style={{ ...s.btn, borderColor: Colors[theme].text }}
                            textStyle={{ color: Colors[theme].text }}
                        />
                    </Link>
                    <Link asChild href="/settings">
                        <AppButton
                            text={t("routes.settings")}
                            style={{ ...s.btn, borderColor: Colors[theme].text }}
                            textStyle={{ color: Colors[theme].text }}
                        />
                    </Link>
                </AppView>
            </FadeIn>

            <FadeIn y={50} x={0} delay={500}>
                <Link asChild href="/level-selection">
                    <AppButton
                        text={t("routes.main.cta")}
                        style={s.cta}
                        textStyle={{ color: "white", fontSize: 24 }}
                        activeOpacity={0.7}
                    />
                </Link>
            </FadeIn>

            <Tooltip
                isVisible={tourStep == 0}
                placement="center"
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
        paddingBottom: 52,
    },
    btn: { backgroundColor: "transparent", borderWidth: 1, width: 200 },
    cta: { width: 300, height: 56 },
});
