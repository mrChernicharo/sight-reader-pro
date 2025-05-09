import { useAppStore } from "@/hooks/useAppStore";
import { useSpamBlocker } from "@/hooks/useSpamBlocker";
import { useTranslation } from "@/hooks/useTranslation";
import { GameType, KeySignature, NoteName } from "@/utils/enums";
import { capitalizeStr, explodeNote } from "@/utils/helperFns";
import { FLAT_KEY_SIGNATURES } from "@/utils/keySignature";
import { WHITE_NOTES } from "@/utils/notes";
import { Note } from "@/utils/types";
import { useCallback, useRef } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { WhitePianoKey } from "./WhitePianoKey";
import { BlackPianoKey } from "./BlackPianoKey";
import { getPianoKeyHeight } from "@/utils/device_sizes";
import { testBorder } from "@/utils/styles";

export interface PianoKeyProps {
    note: NoteName;
    keyWidth: number;
    disabled?: boolean;
    hintColor?: string;
    onPressed: (note: NoteName) => void;
}

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

const pianoHeights = getPianoKeyHeight();

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
    const { updateSpamData } = useSpamBlocker();

    const { width } = useWindowDimensions();

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
        <View style={s.piano}>
            {/* TODO: SPLIT BLACK_NOTES IN 2 CHUNKS */}
            <View style={[s.blackNotes, { left: keyboardMargin + keyWidth * 0.52 }]}>
                {blackNotesLeft.map((note) => {
                    const hintColor = hintPianoKey(note) ? hintColors[hints.current] : undefined;
                    return (
                        <BlackPianoKey
                            key={`black-key-${note}`}
                            note={note}
                            keyWidth={keyWidth}
                            disabled={pianoDisabled}
                            onPressed={onPianoKeyPress}
                            hintColor={hintColor}
                        />
                    );
                })}
            </View>

            <View style={[s.blackNotes, { right: keyboardMargin + keyWidth * 0.48 }]}>
                {blackNotesRight.map((note) => {
                    const hintColor = hintPianoKey(note) ? hintColors[hints.current] : undefined;
                    return (
                        <BlackPianoKey
                            key={`black-key-${note}`}
                            note={note}
                            keyWidth={keyWidth}
                            disabled={pianoDisabled}
                            onPressed={onPianoKeyPress}
                            hintColor={hintColor}
                        />
                    );
                })}
            </View>

            <View style={s.whiteNotes}>
                {WHITE_NOTES.map((note) => {
                    const hintColor = hintPianoKey(note) ? hintColors[hints.current] : undefined;
                    return (
                        <WhitePianoKey
                            key={`white-key-${note}`}
                            note={note}
                            keyWidth={keyWidth}
                            disabled={pianoDisabled}
                            onPressed={onPianoKeyPress}
                            hintColor={hintColor}
                        />
                    );
                })}
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    piano: {
        // position: "relative",
    },
    whiteNotes: {
        flexDirection: "row",
        justifyContent: "center",
        height: pianoHeights.white,
    },
    blackNotes: {
        flexDirection: "row",
        position: "absolute",
        top: -10,
        backgroundColor: "transparent",
        zIndex: 100,
        height: pianoHeights.black,
        // ...testBorder("green"),
    },
});
