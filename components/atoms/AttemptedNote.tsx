import { AppText } from "./AppText";
import { AttemptedNote as AttemptedNoteType } from "@/utils/types";
import { FadeOut } from "./FadeOut";
import { explodeNote, getAttemptedNoteDuration } from "@/utils/helperFns";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/utils/Colors";
import { useTheme } from "@/hooks/useTheme";
import { testBorder } from "@/utils/styles";
import { AntDesign } from "@expo/vector-icons";
import { AppView } from "./AppView";

export function AttemptedNote({ attempt }: { attempt: AttemptedNoteType }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { noteName } = explodeNote(attempt.you);
    const { noteName: correct } = explodeNote(attempt.correct);
    const success = attempt.you === attempt.correct;
    const duration = getAttemptedNoteDuration(success);
    const color = success ? Colors[theme].green : Colors[theme].red;

    return (
        <FadeOut
            y={-60}
            duration={duration}
            style={{ position: "absolute", bottom: 40, alignItems: "center", backdropFilter: "blur(1.2)" }}
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
