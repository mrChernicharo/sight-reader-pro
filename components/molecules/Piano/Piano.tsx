import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { KeySignature, NoteName } from "@/utils/enums";
import { capitalizeStr, explodeNote } from "@/utils/helperFns";
import { FLAT_KEY_SIGNATURES } from "@/utils/keySignature";
import { WHITE_NOTES } from "@/utils/notes";
import { Note } from "@/utils/types";
import { useCallback, useEffect, useRef } from "react";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";

const blackNoteNames: Record<"Flat" | "Sharp", NoteName[]> = {
    Flat: ["db", "eb", "", "gb", "ab", "bb"] as NoteName[],
    Sharp: ["c#", "d#", "", "f#", "g#", "a#"] as NoteName[],
};

export function Piano({
    currNote,
    keySignature,
    hintCount,
    onKeyPressed,
    onKeyReleased,
}: {
    currNote: Note | null;
    keySignature: KeySignature;
    hintCount: number;
    onKeyPressed: (note: NoteName) => void;
    onKeyReleased: (note: NoteName) => void;
}) {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const showPianoNoteNames = useAppStore((state) => state.showPianoNoteNames);
    // const playedNotes = useAppStore((state) => state.playedNotes);
    const theme = useTheme();

    const pianoBlackKeySpec = FLAT_KEY_SIGNATURES.includes(keySignature) ? "Flat" : "Sharp";
    const BLACK_NOTES = blackNoteNames[pianoBlackKeySpec];
    const [blackNotesLeft, blackNotesRight] = [BLACK_NOTES.slice(0, 2), BLACK_NOTES.slice(3)];
    const keyboardMargin = 0;
    const keyWidth = (width - keyboardMargin * 2) / 7;
    const currNoteName = currNote ? explodeNote(currNote).noteName : null;
    const hasCompletedTour = useAppStore((state) => state.completedTours.game);

    const hints = useRef(hintCount);

    const hintPianoKey = useCallback(
        (note: NoteName) => {
            // console.log({ note, currNoteName, currNote, notePlayedTimes, hintCount });
            return hasCompletedTour && note === currNoteName && hints.current > 0;
        },
        [hintCount, currNoteName, hasCompletedTour]
    );

    useEffect(() => {
        console.log("hintCount::::", hintCount);
    }, [hintCount]);

    return (
        <AppView style={s.piano}>
            {/* TODO: SPLIT BLACK_NOTES IN 2 CHUNKS */}
            <AppView
                style={{
                    ...s.blackNotes,
                    width: keyboardMargin + keyWidth * 2.35,
                    left: keyboardMargin + keyWidth / 1.63,
                }}
            >
                {blackNotesLeft.map((note) => (
                    <AppView
                        key={note}
                        style={{ ...s.blackNote, width: keyWidth, ...(!String(note) && { height: 0 }) }}
                    >
                        <Pressable
                            style={{
                                ...s.blackNoteInner,
                                ...(hintPianoKey(note) && { backgroundColor: Colors[theme].green }),
                            }}
                            android_ripple={{ radius: 90, color: "#ffffff33" }}
                            onPressIn={() => {
                                onKeyPressed(note);
                                hints.current--;
                            }}
                            onPressOut={() => onKeyReleased(note)}
                        >
                            {showPianoNoteNames && (
                                <AppText style={{ color: "white", userSelect: "none" }}>
                                    {capitalizeStr(t(`music.notes.${note}`))}
                                </AppText>
                            )}
                        </Pressable>
                    </AppView>
                ))}
            </AppView>

            <AppView
                style={{
                    ...s.blackNotes,
                    width: keyboardMargin + keyWidth * 2.35,
                    right: keyboardMargin + keyWidth / 0.96,
                }}
            >
                {blackNotesRight.map((note) => (
                    <AppView
                        key={note}
                        style={{ ...s.blackNote, width: keyWidth, ...(!String(note) && { height: 0 }) }}
                    >
                        <Pressable
                            style={{
                                ...s.blackNoteInner,
                                ...(hintPianoKey(note) && { backgroundColor: Colors[theme].green }),
                            }}
                            android_ripple={{ radius: 90, color: "#ffffff33" }}
                            onPressIn={() => {
                                onKeyPressed(note);
                                hints.current--;
                            }}
                            onPressOut={() => onKeyReleased(note)}
                        >
                            {showPianoNoteNames && (
                                <AppText style={{ color: "white", userSelect: "none" }}>
                                    {capitalizeStr(t(`music.notes.${note}`))}
                                </AppText>
                            )}
                        </Pressable>
                    </AppView>
                ))}
            </AppView>

            <AppView style={s.whiteNotes}>
                {WHITE_NOTES.map((note) => {
                    return (
                        <Pressable
                            key={note}
                            android_ripple={{ radius: 90, color: "#000000066" }}
                            onPressIn={() => {
                                onKeyPressed(note);
                                hints.current--;
                            }}
                            onPressOut={() => onKeyReleased(note)}
                            style={{
                                ...s.whiteNote,
                                width: keyWidth,
                                ...(hintPianoKey(note) && { backgroundColor: Colors[theme].green }),
                            }}
                        >
                            {showPianoNoteNames && (
                                <AppText style={{ color: "black", userSelect: "none" }}>
                                    {capitalizeStr(t(`music.notes.${note}`))}
                                </AppText>
                            )}
                        </Pressable>
                    );
                })}
            </AppView>
        </AppView>
    );
}

const s = StyleSheet.create({
    piano: {
        position: "relative",
        paddingBottom: 20,
        // marginTop: -20,
    },
    whiteNotes: {
        flexDirection: "row",
        justifyContent: "center",
    },
    whiteNote: {
        borderWidth: 1,
        borderColor: "#bbb",
        backgroundColor: "#ddd",
        height: 160,
        alignItems: "center",
        justifyContent: "flex-end",
    },
    blackNotes: {
        flexDirection: "row",
        position: "absolute",
        top: -10,
        backgroundColor: "rgba(0, 0, 0, 0)",
        zIndex: 10000,
    },
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
