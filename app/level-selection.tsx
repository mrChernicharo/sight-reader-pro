import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useAppStore } from "@/hooks/useAppStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { glyphs, WALKTHROUGH_TOP_ADJUSTMENT } from "@/utils/constants";
import { useCallback, useLayoutEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Tooltip from "react-native-walkthrough-tooltip";
import AppButton from "@/components/atoms/AppButton";
import { LevelTile } from "@/components/atoms/LevelTile";
import { TooltipTextLines } from "@/components/atoms/TooltipTextLines";
import { BottomTabs } from "@/components/molecules/BottomTabs";
import { useAllLevels } from "@/hooks/useAllLevels";
import { SafeAreaView } from "react-native-safe-area-context";

const cols = 3;

export default function LevelSelectionScreen() {
    const { t } = useTranslation();
    // const theme = useTheme();
    const { sectionedLevels, unlockedLevels } = useAllLevels();
    const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");
    // const accentColor = useThemeColor({ light: Colors.light.accent, dark: Colors.dark.accent }, "accent");
    // const games = useAppStore((state) => state.games);
    const clef = useAppStore((state) => state.selectedLevelsClef);
    const hasCompletedTour = useAppStore((state) => state.completedTours.levelSelection);
    const setTourCompleted = useAppStore((state) => state.setTourCompleted);

    const [tourStep, setTourStep] = useState(-1);

    // const unlockedLevels = getUnlockedLevels(games, intl);
    const clefLevels = sectionedLevels.find((lvls) => lvls.title == clef)!;
    const grid = makeGrid(clefLevels.data, cols);
    const clefInfo = { name: clef, glyph: glyphs[`${clef}Clef`] };

    const goToStepOne = useCallback(() => {
        setTourStep(1);
    }, []);

    const goToStepTwo = useCallback(() => {
        setTourStep(2);
    }, []);

    const doFinalStep = useCallback(() => {
        setTourCompleted("levelSelection", true);
        setTourStep(-1);
    }, []);

    useLayoutEffect(() => {
        if (!hasCompletedTour) setTourStep(0);
    }, [hasCompletedTour]);

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
                        <AppView style={{ flexDirection: "row", justifyContent: "center", gap: 4 }}>
                            <AppText type="title" style={s.sectionTitle}>
                                {clefInfo.glyph}
                            </AppText>
                            <AppView style={{ justifyContent: "center" }}>
                                <AppText type="mdSemiBold">{t(`music.clefs.${clefInfo.name}`)}</AppText>
                            </AppView>
                        </AppView>
                        <AppView style={s.gridSection}>
                            {grid.map((row, rowIdx) => (
                                <AppView key={`row-${rowIdx}`} style={s.gridRow}>
                                    {row.map((level, lvlIdx) => {
                                        const isFirstLevel = rowIdx == 0 && lvlIdx == 0;
                                        return isFirstLevel ? (
                                            <Tooltip
                                                key={`tooltip-${level.id}`}
                                                isVisible={tourStep == 2}
                                                placement="right"
                                                topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                                                contentStyle={{ minHeight: 146 }}
                                                onClose={doFinalStep}
                                                content={
                                                    <AppView transparentBG style={{ alignItems: "center" }}>
                                                        <TooltipTextLines keypath={`tour.levelSelection.${tourStep}`} />
                                                        <AppButton
                                                            style={{ marginVertical: 8 }}
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
                                                />
                                            </Tooltip>
                                        ) : (
                                            <LevelTile
                                                key={level.id}
                                                level={level}
                                                isLocked={level.index > unlockedLevels[level.clef] + 1}
                                            />
                                        );
                                    })}
                                </AppView>
                            ))}
                        </AppView>
                    </AppView>
                </AppView>

                <Tooltip
                    isVisible={tourStep == 0}
                    placement="center"
                    topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                    onClose={goToStepOne}
                    content={
                        <AppView transparentBG style={{ alignItems: "center" }}>
                            <TooltipTextLines keypath={`tour.levelSelection.${tourStep}`} />
                            <AppButton style={{ marginVertical: 8 }} text="OK" onPress={goToStepOne} />
                        </AppView>
                    }
                />

                <AppView style={s.footerFiller}></AppView>
            </ScrollView>

            {/* Bottom Tabs */}
            <Tooltip
                isVisible={tourStep == 1}
                placement="top"
                tooltipStyle={{ transform: [{ translateY: -100 }] }}
                contentStyle={{ height: 132 }}
                topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                onClose={goToStepTwo}
                content={
                    <AppView transparentBG style={{ alignItems: "center" }}>
                        <TooltipTextLines keypath={`tour.levelSelection.${tourStep}`} />
                        <AppButton style={{ marginVertical: 8 }} text="OK" onPress={goToStepTwo} />
                    </AppView>
                }
            >
                <BottomTabs />
            </Tooltip>
        </SafeAreaView>
    );
}

export const s = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 24,
        // paddingTop: StatusBar.currentHeight,
        minHeight: Dimensions.get("window").height,
        position: "relative",
    },
    top: {
        width: Dimensions.get("window").width - 64,
        position: "relative",
        alignItems: "center",
        marginHorizontal: "auto",
        // ...testBorder(),
    },
    sectionTitle: {
        paddingBottom: 16,
        paddingTop: 24,
        // justifyContent: "center",
        // alignItems: "baseline",
        // borderWidth: 2,
        // borderColor: "red",
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
