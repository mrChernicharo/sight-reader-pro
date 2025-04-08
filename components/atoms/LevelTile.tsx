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

interface LevelTileProps {
    level: Level<GameType>;
    isLocked: boolean;
}
export function LevelTile({ level, isLocked }: LevelTileProps) {
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
            <AppView style={[s.item, { backgroundColor }]}>
                <AppText>{levelName}</AppText>
                <AppText>{levelIdx}</AppText>
            </AppView>
        </Pressable>
    );
}
function getLevelName(item: Level<GameType>) {
    const splitLevelName = item.name.split(" ");
    const levelIdx = splitLevelName.pop();
    const levelName = splitLevelName.join(" ");
    return { levelIdx, levelName };
}
export const s = StyleSheet.create({
    item: {
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
    },
});
