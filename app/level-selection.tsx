import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { FadeIn } from "@/components/atoms/FadeIn";
import { LevelTile } from "@/components/atoms/LevelTile";
import { TooltipTextLines } from "@/components/atoms/TooltipTextLines";
import { WalkthroughTooltip } from "@/components/atoms/WalkthroughTooltip";
import { BottomTabs } from "@/components/molecules/BottomTabs";
import { useAllLevels } from "@/hooks/useAllLevels";
import { useAppStore } from "@/hooks/useAppStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { glyphs } from "@/utils/constants";
import { Clef } from "@/utils/enums";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Placement } from "react-native-tooltip-2";

const cols = 3;

export default function LevelSelectionScreen() {
    const { t } = useTranslation();
    // const theme = useTheme();
    // const accentColor = useThemeColor({ light: Colors.light.accent, dark: Colors.dark.accent }, "accent");
    const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");

    const { sectionedLevels, unlockedLevels, levelStars } = useAllLevels();
    const clef = useAppStore((state) => state.selectedLevelsClef);
    const hasCompletedTour = useAppStore((state) => state.completedTours.levelSelection);
    const setTourCompleted = useAppStore((state) => state.setTourCompleted);

    const [tourStep, setTourStep] = useState(-1);

    const clefLevels = sectionedLevels.find((lvls) => lvls.title == clef)!;
    const grid = makeGrid(clefLevels.data, cols);
    const clefInfo = { name: clef, glyph: glyphs[`${clef}Clef`] };
    const xDisplacement = clef == Clef.Treble ? 50 : -50;

    const goToStepOne = useCallback(() => {
        setTourStep(-1);
        setTimeout(() => setTourStep(1), 0);
    }, []);

    const goToStepTwo = useCallback(() => {
        setTourStep(-1);
        setTimeout(() => setTourStep(2), 0);
    }, []);

    const doFinalStep = useCallback(() => {
        setTourCompleted("levelSelection", true);
        setTourStep(-1);
    }, []);

    useLayoutEffect(() => {
        if (!hasCompletedTour) setTourStep(0);
    }, [hasCompletedTour]);

    useEffect(() => {
        console.log({ tourStep });
    }, [tourStep]);

    return (
        <SafeAreaView style={{ minHeight: "100%", backgroundColor }}>
            <ScrollView contentContainerStyle={{ backgroundColor }}>
                <AppView style={s.container}>
                    <AppView style={s.top}>
                        <AppView style={{ position: "absolute", left: 0, top: 6 }}>
                            <BackLink />
                        </AppView>
                        <AppText type="subtitle">{t("routes.levelSelection")}</AppText>
                    </AppView>

                    <AppView key={clefLevels.title}>
                        <FadeIn x={xDisplacement} delay={0}>
                            <AppView style={{ flexDirection: "row", justifyContent: "center", gap: 4 }}>
                                <AppText type="title" style={s.sectionTitle}>
                                    {clefInfo.glyph}
                                </AppText>
                                <AppView style={{ justifyContent: "center" }}>
                                    <AppText type="mdSemiBold">{t(`music.clefs.${clefInfo.name}`)}</AppText>
                                </AppView>
                            </AppView>
                        </FadeIn>

                        <FadeIn x={xDisplacement} delay={300}>
                            <AppView style={s.gridSection}>
                                {grid.map((row, rowIdx) => (
                                    <AppView key={`row-${rowIdx}`} style={s.gridRow}>
                                        {row.map((level, lvlIdx) => {
                                            const isFirstLevel = rowIdx == 0 && lvlIdx == 0;
                                            return isFirstLevel ? (
                                                <WalkthroughTooltip
                                                    key={`tooltip-${level.id}`}
                                                    isVisible={Boolean(tourStep == 2)}
                                                    placement={Placement.RIGHT}
                                                    contentStyle={{ minHeight: 150 }}
                                                    content={
                                                        <AppView transparentBG style={{ alignItems: "center" }}>
                                                            <TooltipTextLines
                                                                keypath={`tour.levelSelection.${tourStep}`}
                                                            />
                                                            <AppButton
                                                                style={s.tooltipBtn}
                                                                text="OK"
                                                                onPress={doFinalStep}
                                                            />
                                                        </AppView>
                                                    }
                                                >
                                                    <LevelTile
                                                        key={level.id}
                                                        level={level}
                                                        isLocked={level.index > unlockedLevels[level.clef] + 1}
                                                        stars={levelStars[level.clef][level.index]}
                                                    />
                                                </WalkthroughTooltip>
                                            ) : (
                                                <LevelTile
                                                    key={level.id}
                                                    level={level}
                                                    isLocked={level.index > unlockedLevels[level.clef] + 1}
                                                    stars={levelStars[level.clef][level.index]}
                                                />
                                            );
                                        })}
                                    </AppView>
                                ))}
                            </AppView>
                        </FadeIn>
                    </AppView>
                </AppView>

                <WalkthroughTooltip
                    isVisible={Boolean(tourStep == 0)}
                    placement={Placement.CENTER}
                    content={
                        <AppView transparentBG style={{ alignItems: "center" }}>
                            <TooltipTextLines keypath={`tour.levelSelection.${tourStep}`} />
                            <AppButton style={s.tooltipBtn} text="OK" onPress={goToStepOne} />
                        </AppView>
                    }
                />

                <AppView style={s.footerFiller}></AppView>
            </ScrollView>

            {/* Bottom Tabs */}
            <WalkthroughTooltip
                isVisible={Boolean(tourStep == 1)}
                placement={Placement.TOP}
                contentStyle={{ transform: [{ translateY: -100 }] }}
                arrowStyle={{ transform: [{ translateY: -100 }] }}
                content={
                    <AppView transparentBG style={{ alignItems: "center" }}>
                        <TooltipTextLines keypath={`tour.levelSelection.${tourStep}`} />
                        <AppButton style={s.tooltipBtn} text="OK" onPress={goToStepTwo} />
                    </AppView>
                }
            >
                <BottomTabs />
            </WalkthroughTooltip>
        </SafeAreaView>
    );
}

export const s = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 24,
        minHeight: Dimensions.get("window").height,
        position: "relative",
    },
    top: {
        width: Dimensions.get("window").width - 64,
        position: "relative",
        alignItems: "center",
        marginHorizontal: "auto",
    },
    sectionTitle: {
        paddingBottom: 16,
        paddingTop: 24,
    },
    gridSection: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
        gap: 16,
    },
    gridRow: {
        flexDirection: "row",
        gap: 16,
    },
    item: {
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    footerFiller: { height: 40 },
    tooltipBtn: { marginVertical: 8, minWidth: "40%" },
});

function makeGrid<T>(nums: T[], cols = 2) {
    const grid: T[][] = [];
    nums.forEach((n, i) => {
        if (i % cols == 0) {
            grid.push([n]);
        } else {
            grid?.at(-1)?.push(n);
        }
    });

    return grid;
}
