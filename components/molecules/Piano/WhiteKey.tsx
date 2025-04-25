import { AppText } from "@/components/atoms/AppText";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { NoteName } from "@/utils/enums";
import { capitalizeStr } from "@/utils/helperFns";
import { memo, useCallback } from "react";
import { StyleSheet } from "react-native";
import { Pressable } from "react-native-gesture-handler";

export const WhitePianoKey = memo(
    ({
        width,
        notename,
        showNoteName,
        highlighted = false,
        onPress,
        onRelease,
    }: {
        width: number;
        notename: NoteName;
        showNoteName: boolean;
        highlighted: boolean;
        onPress: (notename: NoteName) => void;
        onRelease: (notename: NoteName) => void;
        // onPress: () => void;
        // onRelease: () => void;
    }) => {
        const { t } = useTranslation();
        const theme = useTheme();

        const handlePress = useCallback(() => {
            onPress(notename);
        }, [onPress]);

        const handleRelease = useCallback(() => {
            onRelease(notename);
        }, [onRelease]);

        return (
            <Pressable
                android_ripple={{ radius: 90, color: "#000000aa" }}
                onPressIn={handlePress}
                onPressOut={handleRelease}
                style={{
                    width,
                    ...s.whiteNote,
                    ...(highlighted && { backgroundColor: Colors[theme].green }),
                }}
            >
                {showNoteName && (
                    <AppText style={{ color: Colors[theme].text, userSelect: "none" }}>
                        {capitalizeStr(t(`music.notes.${notename}`))}
                    </AppText>
                )}
            </Pressable>
        );
    }
);

const s = StyleSheet.create({
    whiteNote: {
        borderWidth: 1,
        borderColor: "#bbb",
        backgroundColor: "#ddd",
        height: 160,
        alignItems: "center",
        justifyContent: "flex-end",
    },
});
