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
import { router } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Dimensions, Pressable, SafeAreaView, StyleProp, StyleSheet, TextStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Tooltip from "react-native-walkthrough-tooltip";
import AppButton from "../atoms/AppButton";

const cols = 3;

export function LevelSelectionTab({ clef }: { clef: Clef }) {
    const { intl } = useIntl();
    const { t } = useTranslation();
    const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");
    const games = useAppStore((state) => state.games);

    const unlockedLevels = getUnlockedLevels(games, intl);

    const clefLevels = SECTIONED_LEVELS.find((lvls) => lvls.title == clef)!;
    const grid = makeGrid(clefLevels.data, cols);
    const clefInfo = { name: clef, glyph: glyphs[`${clef}Clef`] };

    const hasCompletedTour = useAppStore((state) => state.completedTours.levelSelection);
    const [tourStep, setTourStep] = useState(-1);

    useLayoutEffect(() => {
        setTourStep(0);
    }, []);

    const tourTextProps = { forceBlackText: true, style: { textAlign: "center" } as StyleProp<TextStyle> };

    return (
        <SafeAreaView style={{ minHeight: "100%" }}>
            <ScrollView contentContainerStyle={{ backgroundColor }}>
                <AppView style={tabStyles.container}>
                    <AppView style={tabStyles.top}>
                        <AppView style={{ position: "absolute", left: 0, top: 1 }}>
                            <BackLink />
                        </AppView>
                        <AppText type="defaultSemiBold">{t("routes.levelSelection")}</AppText>
                    </AppView>

                    <AppView key={clefLevels.title}>
                        <AppView style={{ flexDirection: "row", gap: 6 }}>
                            <AppText type="title" style={[tabStyles.sectionTitle, { transform: [{ translateY: 5 }] }]}>
                                {clefInfo.glyph}
                            </AppText>
                            <AppText type="title" style={tabStyles.sectionTitle}>
                                {t(`music.clefs.${clefInfo.name}`)}
                            </AppText>
                        </AppView>
                        <AppView style={tabStyles.gridSection}>
                            {grid.map((row, rowIdx) => (
                                <AppView key={`row-${rowIdx}`} style={tabStyles.gridRow}>
                                    {row.map((level) => {
                                        return (
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

                <Tooltip
                    isVisible={tourStep == 1}
                    placement="bottom"
                    tooltipStyle={{ transform: [{ translateY: -60 }] }}
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
                />

                <Tooltip
                    isVisible={tourStep == 2}
                    placement="center"
                    content={
                        <AppView transparentBG style={{ alignItems: "center" }}>
                            <AppText {...tourTextProps}>{t(`tour.levelSelection.${tourStep}`)}</AppText>
                            <AppButton
                                text="OK"
                                onPress={() => {
                                    setTourStep(-1);
                                }}
                            />
                        </AppView>
                    }
                />
                <AppView style={tabStyles.footerFiller}></AppView>
            </ScrollView>
        </SafeAreaView>
    );
}

interface LevelTileProps {
    level: Level<GameType>;
    isLocked: boolean;
}
function LevelTile({ level, isLocked }: LevelTileProps) {
    const { levelName, levelIdx } = getLevelName(level);
    const accentColor = useThemeColor({ light: Colors.light.accent, dark: Colors.dark.accent }, "bg");
    const backgroundColor = isLocked ? "gray" : accentColor;
    return (
        <Pressable
            disabled={isLocked}
            onPress={() => {
                router.push({
                    pathname: "/level-details/[id]",
                    params: { id: level.id },
                });
            }}
        >
            <AppView style={[tabStyles.item, { backgroundColor }]}>
                <AppText>{levelName}</AppText>
                <AppText>{levelIdx}</AppText>
            </AppView>
        </Pressable>
    );
}

export const tabStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 24,
        // paddingTop: StatusBar.currentHeight,
        minHeight: Dimensions.get("window").height,
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

    footerFiller: {
        height: 60,
    },
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

function getLevelName(item: Level<GameType>) {
    const splitLevelName = item.name.split(" ");
    const levelIdx = splitLevelName.pop();
    const levelName = splitLevelName.join(" ");
    return { levelIdx, levelName };
}
