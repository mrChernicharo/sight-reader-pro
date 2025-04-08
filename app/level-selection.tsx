import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useAppStore } from "@/hooks/useAppStore";
import { useIntl } from "@/hooks/useIntl";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { glyphs } from "@/utils/constants";
import { Clef, GameType } from "@/utils/enums";
import { getUnlockedLevels, SECTIONED_LEVELS } from "@/utils/levels";
import { Level } from "@/utils/types";
import { useLayoutEffect, useState } from "react";
import {
    Dimensions,
    Platform,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleProp,
    StyleSheet,
    TextStyle,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Tooltip, { TooltipChildrenContext } from "react-native-walkthrough-tooltip";

import { router } from "expo-router";
import AppButton from "@/components/atoms/AppButton";
import { LevelTile } from "@/components/atoms/LevelTile";
import { BottomTabs } from "@/components/molecules/BottomTabs";

const cols = 3;

export default function LevelSelectionScreen() {
    const { intl } = useIntl();
    const { t } = useTranslation();
    const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");
    const accentColor = useThemeColor({ light: Colors.light.accent, dark: Colors.dark.accent }, "accent");

    const games = useAppStore((state) => state.games);
    const clef = useAppStore((state) => state.selectedLevelsClef);
    const hasCompletedTour = useAppStore((state) => state.completedTours.levelSelection);
    const setTourCompleted = useAppStore((state) => state.setTourCompleted);

    const [tourStep, setTourStep] = useState(-1);

    const unlockedLevels = getUnlockedLevels(games, intl);
    const clefLevels = SECTIONED_LEVELS.find((lvls) => lvls.title == clef)!;
    const grid = makeGrid(clefLevels.data, cols);
    const clefInfo = { name: clef, glyph: glyphs[`${clef}Clef`] };

    const topAdjustment = Platform.OS === "android" ? -StatusBar.currentHeight! : 0;
    const tourTextProps = { forceBlackText: true, style: { textAlign: "center" } as StyleProp<TextStyle> };

    useLayoutEffect(() => {
        if (!hasCompletedTour) setTourStep(0);
    }, []);

    return (
        <SafeAreaView style={{ minHeight: "100%" }}>
            <ScrollView contentContainerStyle={{ backgroundColor }}>
                <AppView>
                    <AppView>
                        <AppView style={s.container}>
                            <AppView style={s.top}>
                                <AppView style={{ position: "absolute", left: 0, top: 1 }}>
                                    <BackLink />
                                </AppView>
                                <AppText type="defaultSemiBold">{t("routes.levelSelection")}</AppText>
                            </AppView>

                            <AppView key={clefLevels.title}>
                                <AppView style={{ flexDirection: "row", gap: 6 }}>
                                    <AppText type="title" style={[s.sectionTitle, { transform: [{ translateY: 5 }] }]}>
                                        {clefInfo.glyph}
                                    </AppText>
                                    <AppText type="title" style={s.sectionTitle}>
                                        {t(`music.clefs.${clefInfo.name}`)}
                                    </AppText>
                                </AppView>
                                <AppView style={s.gridSection}>
                                    {grid.map((row, rowIdx) => (
                                        <AppView key={`row-${rowIdx}`} style={s.gridRow}>
                                            {row.map((level, lvlIdx) => {
                                                const isFirstLevel = rowIdx == 0 && lvlIdx == 0;
                                                return isFirstLevel ? (
                                                    <Tooltip
                                                        isVisible={tourStep == 2}
                                                        placement="right"
                                                        topAdjustment={topAdjustment}
                                                        contentStyle={{ minHeight: 160 }}
                                                        content={
                                                            <AppView transparentBG style={{ alignItems: "center" }}>
                                                                <AppText {...tourTextProps}>
                                                                    {t(`tour.levelSelection.${tourStep}`)}
                                                                </AppText>
                                                                <AppButton
                                                                    text="OK"
                                                                    onPress={() => {
                                                                        setTourCompleted("levelSelection", true);
                                                                        setTourStep(-1);
                                                                    }}
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
                            topAdjustment={topAdjustment}
                            content={
                                <AppView transparentBG style={{ alignItems: "center" }}>
                                    <AppText {...tourTextProps}>{t(`tour.levelSelection.${tourStep}`)}</AppText>
                                    <AppButton
                                        text="OK"
                                        onPress={() => {
                                            setTourStep(1);
                                        }}
                                    />
                                </AppView>
                            }
                        />

                        <AppView style={s.footerFiller}></AppView>
                    </AppView>
                </AppView>
            </ScrollView>

            {/* Bottom Tabs */}
            <Tooltip
                isVisible={tourStep == 1}
                placement="top"
                tooltipStyle={{ transform: [{ translateY: -100 }] }}
                topAdjustment={topAdjustment}
                content={
                    <AppView transparentBG style={{ alignItems: "center" }}>
                        <AppText {...tourTextProps}>{t(`tour.levelSelection.${tourStep}`)}</AppText>
                        <AppButton
                            text="OK"
                            onPress={() => {
                                setTourStep(2);
                            }}
                        />
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
        paddingVertical: 24,
        // paddingTop: StatusBar.currentHeight,
        minHeight: Dimensions.get("window").height,
        position: "relative",
    },
    top: {
        width: "100%",
        position: "relative",
        alignItems: "center",
    },
    sectionTitle: {
        paddingVertical: 16,
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
