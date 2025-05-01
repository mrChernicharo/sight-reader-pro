import { NoteName } from "@/utils/enums";
import { isNoteMatch } from "@/utils/helperFns";
import { router } from "expo-router";
import { useRef, useCallback, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { useTranslation } from "./useTranslation";

export function useSpamBlocker() {
    const { t } = useTranslation();

    const interval = useRef(0);
    const playedNotesInInterval = useRef(0);
    const successesInInterval = useRef(0);

    const alertTitle = t("game.spam.title");
    const alertDescription = t("game.spam.message");

    const updateSpamData = useCallback(
        ({ currNoteName, playedNote }: { currNoteName: NoteName; playedNote: NoteName }) => {
            if (currNoteName) {
                const isSuccess = isNoteMatch(currNoteName, playedNote);
                if (isSuccess) successesInInterval.current++;
            }
            playedNotesInInterval.current++;
        },
        []
    );

    useEffect(() => {
        interval.current = window.setInterval(() => {
            const isPlayingFast = playedNotesInInterval.current > 5;
            const mistakeCount = playedNotesInInterval.current - successesInInterval.current;
            const isSpamming = isPlayingFast && mistakeCount > 2;
            // console.log({ clickCount: playedNotesInInterval.current, mistakeCount, isSpamming });
            if (isSpamming) {
                if (Platform.OS == "web") {
                    window.alert(alertTitle + " " + alertDescription);
                    router.back();
                } else {
                    Alert.alert(alertTitle, alertDescription, [
                        { text: "Go back", onPress: router.back },
                        // @TODO { text: "Retry", onPress: () => { restartGame } }
                    ]);
                }
            }
            playedNotesInInterval.current = 0;
            successesInInterval.current = 0;
        }, 1000);

        return () => window.clearInterval(interval.current);
    }, []);

    return {
        updateSpamData,
    };
}
