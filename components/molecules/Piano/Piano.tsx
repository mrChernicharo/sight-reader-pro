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
import { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { WhitePianoKey } from "./WhiteKey";
import { BlackPianoKey } from "./BlackKey";

const blackNoteNames: Record<"Flat" | "Sharp", NoteName[]> = {
    Flat: ["db", "eb", "", "gb", "ab", "bb"] as NoteName[],
    Sharp: ["c#", "d#", "", "f#", "g#", "a#"] as NoteName[],
};

const keyboardMargin = 0;

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

    const pianoBlackKeySpec = FLAT_KEY_SIGNATURES.includes(keySignature) ? "Flat" : "Sharp";
    const BLACK_NOTES = blackNoteNames[pianoBlackKeySpec];
    const [blackNotesLeft, blackNotesRight] = [BLACK_NOTES.slice(0, 2), BLACK_NOTES.slice(3)];
    const keyWidth = useMemo(() => (width - keyboardMargin * 2) / 7, [width]);
    const hasCompletedTour = useAppStore((state) => state.completedTours.game);
    const currNoteName = currNote ? explodeNote(currNote).noteName : null;

    const hints = useRef(hintCount);

    const hintPianoKey = useCallback(
        (note: NoteName) => {
            return hasCompletedTour && note === currNoteName && hints.current > 0;
        },
        [hintCount, currNoteName, hasCompletedTour]
    );

    const handleKeyPress = useCallback(
        (notename: NoteName) => {
            onKeyPressed(notename);
            hints.current--;
        },
        [onKeyPressed]
    );

    return (
        <AppView style={s.piano}>
            {/* Black Notes Left */}
            <AppView
                style={{
                    ...s.blackNotes,
                    width: keyboardMargin + keyWidth * 2.35,
                    left: keyboardMargin + keyWidth / 1.63,
                }}
            >
                {blackNotesLeft.map((note) => {
                    const highlighted = hintPianoKey(note);
                    return (
                        <BlackPianoKey
                            key={`black-note-${note}`}
                            notename={note}
                            width={keyWidth}
                            showNoteName={showPianoNoteNames}
                            highlighted={highlighted}
                            onPress={handleKeyPress}
                            onRelease={onKeyReleased}
                        />
                    );
                })}
            </AppView>

            {/* Black Notes Right */}
            <AppView
                style={{
                    ...s.blackNotes,
                    width: keyboardMargin + keyWidth * 2.35,
                    right: keyboardMargin + keyWidth / 0.96,
                }}
            >
                {blackNotesRight.map((note) => {
                    const highlighted = hintPianoKey(note);
                    return (
                        <BlackPianoKey
                            key={`black-note-${note}`}
                            notename={note}
                            width={keyWidth}
                            showNoteName={showPianoNoteNames}
                            highlighted={highlighted}
                            onPress={handleKeyPress}
                            onRelease={onKeyReleased}
                        />
                    );
                })}
            </AppView>

            {/* White Notes */}
            <AppView style={s.whiteNotes}>
                {WHITE_NOTES.map((note) => {
                    const highlighted = hintPianoKey(note);
                    return (
                        <WhitePianoKey
                            key={`white-note-${note}`}
                            notename={note}
                            width={keyWidth}
                            showNoteName={showPianoNoteNames}
                            highlighted={highlighted}
                            onPress={handleKeyPress}
                            onRelease={onKeyReleased}
                        />
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
