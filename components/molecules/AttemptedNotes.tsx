import { eventEmitter } from "@/app/_layout";
import { useAppStore } from "@/hooks/useAppStore";
import { AppEvents } from "@/utils/enums";
import { getAttemptedNoteDuration, randomUID, wait } from "@/utils/helperFns";
import { STYLES } from "@/utils/styles";
import { AttemptedNote as AttemptedNoteType, NotePlayedEventData } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { AttemptedNote } from "../atoms/AttemptedNote";

const s = STYLES.game;

export function AttemptedNotes() {
    const [attemptedNotes, setAttemptedNotes] = useState<AttemptedNoteType[]>([]);
    const { currentGame } = useAppStore();
    const rounds = useMemo(() => currentGame?.rounds || [], [currentGame?.rounds]);

    useEffect(() => {
        (async () => {
            const duration = getAttemptedNoteDuration(true);
            await wait(duration);

            setAttemptedNotes((prev) => {
                const [first, ...rest] = prev;
                return rest;
            });
        })();
    }, [rounds.length]);

    useEffect(() => {
        eventEmitter.addListener(AppEvents.NotePlayed, (event) => {
            // console.log("event:::", event);
            const { currNote, playedNote, isSuccess, currNoteValue } = event.data as NotePlayedEventData;

            setAttemptedNotes((prev) => [
                ...prev,
                { id: randomUID(), you: playedNote, correct: currNote, isSuccess, noteScore: currNoteValue },
            ]);
        });

        return () => eventEmitter.removeAllListeners(AppEvents.NotePlayed);
    }, []);

    // useEffect(() => {
    //     console.log({ attemptedNotes });
    // }, [attemptedNotes]);

    // useEffect(() => {
    //     console.log({ rounds });
    // }, [rounds]);

    return (
        <View style={s.attemptedNotes}>
            {attemptedNotes.map((attempt) => (
                <AttemptedNote key={attempt.id} attempt={attempt} />
            ))}
        </View>
    );
}
