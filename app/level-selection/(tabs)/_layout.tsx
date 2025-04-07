import AppButton from "@/components/atoms/AppButton";
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
import { router, Tabs } from "expo-router";
import { useState } from "react";
import { Dimensions, Pressable, SafeAreaView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Tooltip from "react-native-walkthrough-tooltip";

export default function TabLayout() {
    const { t } = useTranslation();
    const accentColor = useThemeColor({ light: Colors.light.accent, dark: Colors.dark.accent }, "accent");

    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: accentColor }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: t("music.clefs.treble"),
                    headerShown: false,
                    // headerBackButtonDisplayMode: "minimal",
                    // tabBarIcon: ({ color, focused }) => <FontAwesome size={28} name="home" color={color} />,
                    tabBarIcon: ({ color, focused }) => (
                        <AppText style={{ ...(focused && { color: accentColor }) }}>{glyphs[`trebleClef`]}</AppText>
                    ),
                }}
            />
            <Tabs.Screen
                name="bass"
                options={{
                    title: t("music.clefs.bass"),
                    // headerBackButtonDisplayMode: "generic",
                    // tabBarShowLabel: false,
                    headerShown: false,

                    // tabBarIcon: ({ color, focused }) => <FontAwesome size={28} name="cog" color={color} />,
                    tabBarIcon: ({ color, focused }) => (
                        <AppText type="lg" style={{ ...(focused && { color: accentColor }) }}>
                            {glyphs[`bassClef`]}
                        </AppText>
                    ),
                }}
            />
        </Tabs>
    );
}

const cols = 3;

export function LevelSelectionTab({ clef }: { clef: Clef }) {
    const { intl } = useIntl();
    const { t } = useTranslation();
    const accentColor = useThemeColor({ light: Colors.light.accent, dark: Colors.dark.accent }, "background");
    const backgroundColor = useThemeColor(
        { light: Colors.light.background, dark: Colors.dark.background },
        "background"
    );
    const games = useAppStore((state) => state.games);

    const unlockedLevels = getUnlockedLevels(games, intl);

    const clefLevels = SECTIONED_LEVELS.find((lvls) => lvls.title == clef)!;
    const grid = makeGrid(clefLevels.data, cols);
    const clefInfo = { name: clef, glyph: glyphs[`${clef}Clef`] };

    const hasCompletedTour = useAppStore((state) => state.completedTours.levelSelection);
    const [tourStep, setTourStep] = useState(0);

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
                                        const { levelName, levelIdx } = getLevelName(level);
                                        const disabled = level.index > unlockedLevels[level.clef] + 1;
                                        return (
                                            <Pressable
                                                key={level.id}
                                                disabled={disabled}
                                                onPress={() => {
                                                    router.push({
                                                        pathname: "/level-details/[id]",
                                                        params: { id: level.id },
                                                    });
                                                }}
                                            >
                                                <AppView
                                                    style={[
                                                        tabStyles.item,
                                                        {
                                                            backgroundColor: disabled ? "gray" : accentColor,
                                                        },
                                                    ]}
                                                >
                                                    <AppText>{levelName}</AppText>
                                                    <AppText>{levelIdx}</AppText>
                                                </AppView>
                                            </Pressable>
                                        );
                                    })}
                                </AppView>
                            ))}
                        </AppView>
                    </AppView>
                </AppView>

                <AppView style={tabStyles.footerFiller}></AppView>
            </ScrollView>
        </SafeAreaView>
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
