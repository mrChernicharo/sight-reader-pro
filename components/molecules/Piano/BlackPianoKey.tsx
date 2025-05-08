import { AppText } from "@/components/atoms/AppText";
import { useAppStore } from "@/hooks/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { NoteName } from "@/utils/enums";
import { capitalizeStr } from "@/utils/helperFns";
import { memo, useCallback, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { PianoKeyProps } from "./Piano";

const rippleStyle = { radius: 90, color: "#ffffff33" };

function BlackKey({ note, keyWidth, hintColor = "", disabled = false, onPressed }: PianoKeyProps) {
    const { t } = useTranslation();

    const showPianoNoteNames = useAppStore((state) => state.showPianoNoteNames);

    const nameStyle = useMemo(() => ({ color: hintColor ? "#232323" : "#9b9b9b" }), [hintColor]);
    const bgStyle = useMemo(() => ({ ...(hintColor && { backgroundColor: hintColor }) }), [keyWidth, hintColor]);

    const onPress = useCallback(() => {
        onPressed(note);
    }, [note, onPressed]);

    return (
        <View key={note} style={{ ...s.blackNote, width: keyWidth, ...(!String(note) && { height: 0 }) }}>
            <Pressable
                disabled={disabled}
                key={note}
                android_ripple={rippleStyle}
                style={{ ...s.blackNoteInner, ...bgStyle }}
                // style={[ps.blackNote, bgStyle]}
                onPressIn={onPress}
                hitSlop={8}
                // onPressOut={() => onKeyReleased(note)}
            >
                {showPianoNoteNames && (
                    <AppText style={{ ...s.text, ...nameStyle }}>{capitalizeStr(t(`music.notes.${note}`))}</AppText>
                )}
            </Pressable>
        </View>
    );
}
export const BlackPianoKey = memo(BlackKey);

const s = StyleSheet.create({
    text: { fontWeight: 700, userSelect: "none" },
    blackNote: {
        height: "100%",
        backgroundColor: "transparent",
    },
    blackNoteInner: {
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#333",
        height: "100%",
        width: "74%",
        borderRadius: 6,
        zIndex: 10000,
        margin: "auto",
    },
});
