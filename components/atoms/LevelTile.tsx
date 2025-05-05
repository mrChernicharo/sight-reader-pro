import { AppText } from "@/components/atoms/AppText";
import { useTheme } from "@/hooks/useTheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/utils/Colors";
import { Level } from "@/utils/types";
import { StyleSheet } from "react-native";
import { Pressable } from "react-native";

import { router } from "expo-router";
import { useTranslation } from "@/hooks/useTranslation";
import { getLevelName, toCamelCase } from "@/utils/helperFns";
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

    const Star = () => <Ionicons name="star" color={Colors.dark.text} />;

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
            <AppText style={{ textAlign: "center" }}>{t(`levelName.${toCamelCase(levelName)}`)}</AppText>
            <AppText>{levelIdx}</AppText>

            <AppText>
                {stars === 3 ? (
                    <>
                        <Star /> <Star /> <Star />
                    </>
                ) : null}
                {stars === 2 ? (
                    <>
                        <Star /> <Star />
                    </>
                ) : null}
                {stars === 1 ? <Star /> : null}
            </AppText>
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
