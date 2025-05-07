import { AppText } from "@/components/atoms/AppText";
import { useTheme } from "@/hooks/useTheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/utils/Colors";
import { Level } from "@/utils/types";
import { StyleSheet, View } from "react-native";
import { Pressable } from "react-native";

import { router } from "expo-router";
import { useTranslation } from "@/hooks/useTranslation";
import { capitalizeStr, getLevelName, toCamelCase } from "@/utils/helperFns";
import { GameStars } from "./GameStars";
import Ionicons from "@expo/vector-icons/Ionicons";

interface LevelTileProps {
    level: Level;
    stars: number; // 0 - 3
    isLocked: boolean;
}
export function LevelTile({ level, isLocked, stars }: LevelTileProps) {
    const { levelName, levelIdx } = getLevelName(level);
    const { t } = useTranslation();
    const theme = useTheme();
    const accentColor = useThemeColor({ light: Colors.light.accent, dark: Colors.dark.accent }, "bg");
    const backgroundColor = isLocked ? "gray" : accentColor;

    return (
        <Pressable
            disabled={isLocked}
            style={{ ...s.item, backgroundColor }}
            android_ripple={{ radius: 90, color: Colors[theme].text }}
            onPress={() => {
                router.push({
                    pathname: "/level-details/[id]",
                    params: { id: level.id },
                });
                // router.push({});
            }}
        >
            <AppText style={{ textAlign: "center" }}>{levelIdx}</AppText>
            <AppText numberOfLines={1}>{capitalizeStr(t(`levelName.${toCamelCase(levelName)}`))}</AppText>
            {stars ? <GameStars stars={stars} /> : null}
            {isLocked ? (
                <AppText>
                    <Ionicons name="lock-closed" size={18} />
                </AppText>
            ) : null}
        </Pressable>
    );
}

export const s = StyleSheet.create({
    item: {
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
    },
});
