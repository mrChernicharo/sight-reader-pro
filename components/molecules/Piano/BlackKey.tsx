import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { NoteName } from "@/utils/enums";
import { capitalizeStr } from "@/utils/helperFns";
import { memo, useCallback } from "react";
import { StyleSheet } from "react-native";
import { Pressable } from "react-native-gesture-handler";

export const BlackPianoKey = memo(
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

        const noteNameText = capitalizeStr(t(`music.notes.${notename}`));

        return (
            <AppView style={{ ...s.blackNote, width }}>
                <Pressable
                    android_ripple={{ radius: 90, color: "#ffffff33" }}
                    onPressIn={handlePress}
                    onPressOut={handleRelease}
                    style={{
                        ...s.blackNoteInner,
                        ...(highlighted && { backgroundColor: Colors[theme].green }),
                    }}
                >
                    {showNoteName && (
                        <AppText style={{ color: Colors[theme].bg, userSelect: "none" }}>{noteNameText}</AppText>
                    )}
                </Pressable>
            </AppView>
        );
    }
);

const s = StyleSheet.create({
    blackNote: {
        height: 110,
        backgroundColor: "rgba(0, 0, 0, 0)",
    },
    blackNoteInner: {
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#333",
        height: "100%",
        width: "80%",
        borderRadius: 6,
        zIndex: 10000,
    },
});
