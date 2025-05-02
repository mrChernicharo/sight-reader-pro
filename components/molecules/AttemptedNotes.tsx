import { useAppStore } from "@/hooks/useAppStore";
import { AppEvents } from "@/utils/enums";
import { getAttemptedNoteDuration, wait, randomUID } from "@/utils/helperFns";
import { useState, useMemo, useEffect } from "react";
import { View } from "react-native";
import { AttemptedNote } from "../atoms/AttemptedNote";
import { NotePlayedEventData } from "./Game/SingleNoteGame";
import { AttemptedNote as AttemptedNoteType } from "@/utils/types";
import { eventEmitter } from "@/app/_layout";
import { STYLES } from "@/utils/styles";

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
            // console.log(event);
            const { currNote, playedNote, isSuccess, noteScore } = event.data as NotePlayedEventData;

            setAttemptedNotes((prev) => [
                ...prev,
                { id: randomUID(), you: playedNote, correct: currNote, isSuccess, noteScore },
            ]);
        });
        return () => eventEmitter.removeAllListeners(AppEvents.NotePlayed);
    }, []);

    // useEffect(() => {
    //     console.log({ attemptedNotes });
    // }, [attemptedNotes]);

    return (
        <View style={{ ...s.attemptedNotes, transform: [{ translateY: 20 }] }}>
            {attemptedNotes.map((attempt) => (
                <AttemptedNote key={attempt.id} attempt={attempt} />
            ))}
        </View>
    );
}
