import { AppText } from "./AppText";
import { AttemptedNote as AttemptedNoteType } from "@/utils/types";
import { FadeOut } from "./FadeOut";
import { explodeNote, getAttemptedNoteDuration, getNoteIdx } from "@/utils/helperFns";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/utils/Colors";
import { useTheme } from "@/hooks/useTheme";
import { testBorder } from "@/utils/styles";
import { AntDesign } from "@expo/vector-icons";
import { AppView } from "./AppView";
import { NoteName } from "@/utils/enums";

const noteStyles: Record<NoteName, any> = {
    c: { left: 20 },
    "b#": { left: 20 },
    dbb: { left: 20 },

    "c#": { left: 40 },
    db: { left: 40 },

    d: { left: 60 },
    cx: { left: 60 },
    ebb: { left: 60 },

    "d#": { left: 90 },
    eb: { left: 90 },

    e: { left: 120 },
    dx: { left: 120 },
    fb: { left: 120 },

    f: { right: 180 },
    "e#": { right: 180 },

    gbb: { right: 150 },
    "f#": { right: 150 },
    gb: { right: 150 },

    g: { right: 120 },
    fx: { right: 120 },
    abb: { right: 120 },

    "g#": { right: 90 },
    ab: { right: 90 },

    a: { right: 60 },
    gx: { right: 60 },
    bbb: { right: 60 },

    "a#": { right: 40 },
    bb: { right: 40 },

    b: { right: 20 },
    ax: { right: 20 },
    cb: { right: 20 },
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
                bottom: 40,
                ...notePositionStyles,
            }}
        >
            {/* TOP LINE */}
            <AppView transparentBG style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                <AntDesign
                    name={success ? "checkcircle" : "closecircle"}
                    style={{ fontWeight: "900", marginBottom: 2 }}
                    size={14}
                    color={color}
                />

                <AppText style={{ color, fontWeight: "900", fontSize: 24, lineHeight: 24 }}>
                    {t(`music.notes.${noteName}`)}
                </AppText>
            </AppView>

            {/* BOTTOM LINE */}
            <AppText style={{ color, lineHeight: 16 }}>
                {success ? "800 pts" : `( ${t(`game.was`)} ${t(`music.notes.${correct}`)} )`}
            </AppText>
        </FadeOut>
    );
}
