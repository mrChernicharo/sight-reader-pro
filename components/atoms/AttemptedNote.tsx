import { AppText } from "./AppText";
import { AttemptedNote as AttemptedNoteType } from "@/utils/types";
import { FadeOut } from "./FadeOut";
import { explodeNote, getAttemptedNoteDuration, getNoteIdx, mapRange } from "@/utils/helperFns";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/utils/Colors";
import { useTheme } from "@/hooks/useTheme";
import { testBorder } from "@/utils/styles";
import { AntDesign } from "@expo/vector-icons";
import { AppView } from "./AppView";
import { NoteName } from "@/utils/enums";
import { Dimensions } from "react-native";

const calcOffset = (zeroToOneValue: number) => {
    return mapRange(zeroToOneValue, 0, Dimensions.get("window").width, 1);
};

const noteStyles: Record<NoteName, any> = {
    c: { left: calcOffset(0.0125) },
    "b#": { left: calcOffset(0.0125) },
    dbb: { left: calcOffset(0.0125) },

    "c#": { left: calcOffset(0.065) },
    db: { left: calcOffset(0.065) },

    d: { left: calcOffset(0.125) },
    cx: { left: calcOffset(0.125) },
    ebb: { left: calcOffset(0.125) },

    "d#": { left: calcOffset(0.2) },
    eb: { left: calcOffset(0.2) },

    e: { left: calcOffset(0.265) },
    dx: { left: calcOffset(0.265) },
    fb: { left: calcOffset(0.265) },

    f: { right: calcOffset(0.4) },
    "e#": { right: calcOffset(0.4) },

    gbb: { right: calcOffset(0.325) },
    "f#": { right: calcOffset(0.325) },
    gb: { right: calcOffset(0.325) },

    g: { right: calcOffset(0.265) },
    fx: { right: calcOffset(0.265) },
    abb: { right: calcOffset(0.265) },

    "g#": { right: calcOffset(0.2) },
    ab: { right: calcOffset(0.2) },

    a: { right: calcOffset(0.125) },
    gx: { right: calcOffset(0.125) },
    bbb: { right: calcOffset(0.125) },

    "a#": { right: calcOffset(0.065) },
    bb: { right: calcOffset(0.065) },

    b: { right: calcOffset(0.0125) },
    ax: { right: calcOffset(0.0125) },
    cb: { right: calcOffset(0.0125) },
};

export function AttemptedNote({ attempt }: { attempt: AttemptedNoteType }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { noteName } = explodeNote(attempt.you);
    const { noteName: correct } = explodeNote(attempt.correct);
    const success = getNoteIdx(attempt.you) === getNoteIdx(attempt.correct);
    const duration = getAttemptedNoteDuration(success);
    const color = success ? Colors[theme].green : Colors[theme].red;

    const notePositionStyles = noteStyles[noteName];

    return (
        <FadeOut
            y={-60}
            duration={duration}
            style={{
                position: "absolute",
                alignItems: "center",
                backdropFilter: "blur(1.2)",
                bottom: 12,
                ...notePositionStyles,
            }}
        >
            {/* TOP LINE */}
            <AppView transparentBG style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                <AntDesign
                    name={success ? "checkcircle" : "closecircle"}
                    style={{ fontWeight: 900, marginBottom: 2 }}
                    size={14}
                    color={color}
                />

                <AppText style={{ fontFamily: "Grotesque", fontSize: 24, lineHeight: 36 }}>
                    {t(`music.notes.${noteName}`)}
                </AppText>
            </AppView>

            {/* BOTTOM LINE */}
            <AppText style={{ fontFamily: "Grotesque", lineHeight: 16 }}>
                {success ? "800 pts" : `( ${t(`game.was`)} ${t(`music.notes.${correct}`)} )`}
            </AppText>
        </FadeOut>
    );
}
