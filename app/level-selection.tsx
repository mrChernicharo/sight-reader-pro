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
import { useState } from "react";
import { Dimensions, Pressable, SafeAreaView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const cols = 3;

export function getLevelName(item: Level<GameType>) {
    const splitLevelName = item.name.split(" ");
    const levelIdx = splitLevelName.pop();
    const levelName = splitLevelName.join(" ");
    return { levelIdx, levelName };
}

export default function LevelSelectionScreen() {
    const { intl } = useIntl();
    const { t } = useTranslation();
    const accentColor = useThemeColor({ light: Colors.light.accent, dark: Colors.dark.accent }, "background");
    const backgroundColor = useThemeColor(
        { light: Colors.light.background, dark: Colors.dark.background },
        "background"
    );
    const games = useAppStore((state) => state.games);

    const [selectedClef, setSelectedClef] = useState(Clef.Treble);

    const unlockedLevels = getUnlockedLevels(games, intl);

    const clefLevels = SECTIONED_LEVELS.find((lvls) => lvls.title == selectedClef)!;
    const grid = makeGrid(clefLevels.data, cols);
    const clefInfo = { name: selectedClef, glyph: glyphs[`${selectedClef}Clef`] };

    return (
        <SafeAreaView style={{ minHeight: "100%" }}>
            <ScrollView contentContainerStyle={{ backgroundColor }}>
                <AppView style={styles.container}>
                    <AppView style={styles.top}>
                        <AppView style={{ position: "absolute", left: 0, top: 1 }}>
                            <BackLink />
                        </AppView>
                        <AppText type="defaultSemiBold">{t("routes.levelSelection")}</AppText>
                    </AppView>

                    <AppView key={clefLevels.title}>
                        <AppView style={{ flexDirection: "row", gap: 6 }}>
                            <AppText
                                type="title"
                                style={[
                                    styles.sectionTitle,
                                    selectedClef == Clef.Bass && { transform: [{ translateY: 5 }] },
                                ]}
                            >
                                {clefInfo.glyph}
                            </AppText>
                            <AppText type="title" style={styles.sectionTitle}>
                                {t(`music.clefs.${clefInfo.name}`)}
                            </AppText>
                        </AppView>

                        <AppView style={styles.gridSection}>
                            {grid.map((row, rowIdx) => (
                                <AppView key={`row-${rowIdx}`} style={styles.gridRow}>
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
                                                        styles.item,
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
                <AppView style={styles.footerFiller}></AppView>
            </ScrollView>

            {/* Bottom Tabs */}
            <AppView style={{ position: "absolute", bottom: 0, zIndex: 100, flexDirection: "row" }}>
                <Pressable
                    android_ripple={{ radius: 240 }}
                    onPress={() => setSelectedClef(Clef.Treble)}
                    style={{
                        flex: 1,
                        alignItems: "center",
                        paddingTop: 5,
                        borderColor: selectedClef == Clef.Treble ? "purple" : backgroundColor,
                        borderTopWidth: 3,
                    }}
                >
                    <AppText type="lg" style={{ lineHeight: 54 }}>
                        {glyphs[`trebleClef`]}
                    </AppText>
                </Pressable>
                <Pressable
                    android_ripple={{ radius: 240 }}
                    onPress={() => setSelectedClef(Clef.Bass)}
                    style={{
                        flex: 1,
                        alignItems: "center",
                        paddingTop: 5,
                        borderColor: selectedClef == Clef.Bass ? "purple" : backgroundColor,
                        borderTopWidth: 3,
                    }}
                >
                    <AppText type="title" style={{ lineHeight: 54 }}>
                        {glyphs[`bassClef`]}
                    </AppText>
                </Pressable>
            </AppView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
