import { AppText } from "@/components/atoms/AppText";
import { useAppStore } from "@/hooks/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { NoteName } from "@/utils/enums";
import { capitalizeStr } from "@/utils/helperFns";
import { memo, useCallback, useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";
import { PianoKeyProps } from "./Piano";

const rippleStyle = { radius: 90, color: "#000000066" };

function WhiteKey({ note, keyWidth, hintColor = "", disabled = false, onPressed }: PianoKeyProps) {
    const { t } = useTranslation();

    const showPianoNoteNames = useAppStore((state) => state.showPianoNoteNames);

    const nameStyle = useMemo(() => ({ color: hintColor ? "#232323" : "#9b9b9b" }), [hintColor]);
    const bgStyle = useMemo(
        () => ({ width: keyWidth, ...(hintColor && { backgroundColor: hintColor }) }),
        [keyWidth, hintColor]
    );

    const onPress = useCallback(() => {
        onPressed(note);
    }, [note, onPressed]);

    return (
        <Pressable
            disabled={disabled}
            key={note}
            android_ripple={rippleStyle}
            style={{ ...ps.whiteNote, ...bgStyle }}
            // style={[ps.whiteNote, bgStyle]}
            onPressIn={onPress}
            // onPressOut={() => onKeyReleased(note)}
        >
            {showPianoNoteNames && (
                <AppText style={{ ...ps.text, ...nameStyle }}>{capitalizeStr(t(`music.notes.${note}`))}</AppText>
            )}
        </Pressable>
    );
}
export const WhitePianoKey = memo(WhiteKey);

const ps = StyleSheet.create({
    text: { fontWeight: 700, userSelect: "none" },
    whiteNote: {
        borderWidth: 1,
        borderColor: "#bbb",
        backgroundColor: "#ddd",
        height: 160,
        alignItems: "center",
        justifyContent: "flex-end",
    },
});
