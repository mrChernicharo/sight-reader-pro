import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { useSpamBlocker } from "@/hooks/useSpamBlocker";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { GameType, KeySignature, NoteName } from "@/utils/enums";
import { capitalizeStr, explodeNote, getNoteIdx, isNoteMatch } from "@/utils/helperFns";
import { FLAT_KEY_SIGNATURES } from "@/utils/keySignature";
import { WHITE_NOTES } from "@/utils/notes";
import { testBorder } from "@/utils/styles";
import { Note } from "@/utils/types";
import { router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { Alert, StyleSheet, useWindowDimensions } from "react-native";
import { Pressable } from "react-native";

const blackNoteNames: Record<"Flat" | "Sharp", NoteName[]> = {
    Flat: ["db", "eb", "", "gb", "ab", "bb"] as NoteName[],
    Sharp: ["c#", "d#", "", "f#", "g#", "a#"] as NoteName[],
};

const hintColors: Record<number, string> = {
    4: "#02ba5e", // Darkest Green
    3: "#39c37e",
    2: "#70cc9e",
    1: "#a6d4bd",
    // 1: "#dddddd"  // Lightest Gray (#ddd)
};

export function Piano({
    gameType,
    currNote,
    keySignature,
    hintCount,
    onKeyPressed,
    onKeyReleased,
}: {
    gameType: GameType;
    currNote: Note | null;
    keySignature: KeySignature;
    hintCount: number;
    onKeyPressed: (note: NoteName) => void;
    onKeyReleased: (note: NoteName) => void;
}) {
    const { t } = useTranslation();
    const { updateSpamData } = useSpamBlocker();

    const { width } = useWindowDimensions();
    const showPianoNoteNames = useAppStore((state) => state.showPianoNoteNames);
    // const playedNotes = useAppStore((state) => state.playedNotes);
    // const theme = useTheme();

    const pianoBlackKeySpec = FLAT_KEY_SIGNATURES.includes(keySignature) ? "Flat" : "Sharp";
    const BLACK_NOTES = blackNoteNames[pianoBlackKeySpec];
    const [blackNotesLeft, blackNotesRight] = [BLACK_NOTES.slice(0, 2), BLACK_NOTES.slice(3)];
    const keyboardMargin = 0;
    const keyWidth = (width - keyboardMargin * 2) / 7;
    const currNoteName = currNote ? explodeNote(currNote).noteName : null;
    const hasCompletedTour = useAppStore((state) => state.completedTours.game);

    const hints = useRef(hintCount);

    const pianoDisabled = gameType == GameType.Single && !hasCompletedTour;

    const hintPianoKey = useCallback(
        (note: NoteName) => {
            // console.log({ note, hintCount, hintsLeft: hints.current });
            switch (gameType) {
                case GameType.Single:
                    return hasCompletedTour && note === currNoteName && hints.current > 0;
                default:
                    return note === currNoteName && hints.current > 0;
            }
        },
        [hintCount, gameType, currNoteName, hasCompletedTour]
    );

    const onPianoKeyPress = useCallback(
        (note: NoteName) => {
            hints.current--;

            if (currNoteName) updateSpamData({ currNoteName, playedNote: note });

            onKeyPressed(note);
        },
        [onKeyPressed]
    );

    return (
        <AppView style={s.piano}>
            {/* TODO: SPLIT BLACK_NOTES IN 2 CHUNKS */}
            <AppView
                style={{
                    ...s.blackNotes,
                    // width: keyboardMargin + keyWidth * 2.35,
                    left: keyboardMargin + keyWidth * 0.5,
                }}
            >
                {blackNotesLeft.map((note) => (
                    <AppView
                        key={note}
                        style={{ ...s.blackNote, width: keyWidth, ...(!String(note) && { height: 0 }) }}
                    >
                        <Pressable
                            disabled={pianoDisabled}
                            style={{
                                ...s.blackNoteInner,
                                ...(hintPianoKey(note) && { backgroundColor: hintColors[hints.current] }),
                            }}
                            android_ripple={{ radius: 90, color: "#ffffff33" }}
                            onPressIn={() => {
                                onPianoKeyPress(note);
                            }}
                            onPressOut={() => onKeyReleased(note)}
                        >
                            {showPianoNoteNames && (
                                <AppText
                                    style={{
                                        color: hintPianoKey(note) ? "#232323" : "#9b9b9b",
                                        fontWeight: 700,
                                        userSelect: "none",
                                    }}
                                >
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
                    // width: keyboardMargin + keyWidth * 2.35,
                    right: keyboardMargin + keyWidth * 0.5,
                }}
            >
                {blackNotesRight.map((note) => (
                    <AppView
                        key={note}
                        style={{ ...s.blackNote, width: keyWidth, ...(!String(note) && { height: 0 }) }}
                    >
                        <Pressable
                            disabled={pianoDisabled}
                            style={{
                                ...s.blackNoteInner,
                                ...(hintPianoKey(note) && { backgroundColor: hintColors[hints.current] }),
                            }}
                            android_ripple={{ radius: 90, color: "#ffffff33" }}
                            onPressIn={() => {
                                onPianoKeyPress(note);
                            }}
                            onPressOut={() => onKeyReleased(note)}
                        >
                            {showPianoNoteNames && (
                                <AppText
                                    style={{
                                        color: hintPianoKey(note) ? "#232323" : "#9b9b9b",
                                        fontWeight: 700,
                                        userSelect: "none",
                                    }}
                                >
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
                            disabled={pianoDisabled}
                            key={note}
                            android_ripple={{ radius: 90, color: "#000000066" }}
                            onPressIn={() => {
                                onPianoKeyPress(note);
                            }}
                            onPressOut={() => onKeyReleased(note)}
                            style={{
                                ...s.whiteNote,
                                width: keyWidth,
                                ...(hintPianoKey(note) && { backgroundColor: hintColors[hints.current] }),
                            }}
                        >
                            {showPianoNoteNames && (
                                <AppText
                                    style={{
                                        color: hintPianoKey(note) ? "#232323" : "#9b9b9b",
                                        fontWeight: 700,
                                        userSelect: "none",
                                    }}
                                >
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
        backgroundColor: "transparent",
        zIndex: 100,
    },
    blackNote: {
        height: 110,
        backgroundColor: "transparent",
    },
    blackNoteInner: {
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#333",
        height: "100%",
        width: "80%",
        borderRadius: 6,
        zIndex: 10000,
        margin: "auto",
    },
});
