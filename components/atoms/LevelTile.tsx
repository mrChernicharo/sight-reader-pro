import { AppText } from "@/components/atoms/AppText";
import { useTheme } from "@/hooks/useTheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/utils/Colors";
import { Level } from "@/utils/types";
import { StyleSheet } from "react-native";
import { Pressable } from "react-native";

import { router } from "expo-router";

interface LevelTileProps {
    level: Level;
    isLocked: boolean;
}
export function LevelTile({ level, isLocked }: LevelTileProps) {
    const { levelName, levelIdx } = getLevelName(level);
    const theme = useTheme();
    const accentColor = useThemeColor({ light: Colors.light.accent, dark: Colors.dark.accent }, "bg");
    const backgroundColor = isLocked ? "gray" : accentColor;

    return (
        <Pressable
            disabled={isLocked}
            style={{ ...s.item, backgroundColor }}
            android_ripple={{ radius: 90, color: Colors[theme].text }}
            onPress={() => {
                router.dismissTo({
                    pathname: "/level-details/[id]",
                    params: { id: level.id },
                });
                // router.push({});
            }}
        >
            <AppText>{levelName}</AppText>
            <AppText>{levelIdx}</AppText>
        </Pressable>
    );
}
function getLevelName(item: Level) {
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
