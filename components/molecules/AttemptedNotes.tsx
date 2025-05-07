import { useAppStore } from "@/hooks/useAppStore";
import { AppEvents } from "@/utils/enums";
import { getAttemptedNoteDuration, wait, randomUID } from "@/utils/helperFns";
import { useState, useMemo, useEffect, useLayoutEffect } from "react";
import { View } from "react-native";
import { AttemptedNote } from "../atoms/AttemptedNote";
import { AttemptedNote as AttemptedNoteType, NotePlayedEventData } from "@/utils/types";
import { eventEmitter } from "@/app/_layout";
import { STYLES } from "@/utils/styles";

const s = STYLES.game;

export function AttemptedNotes() {
    const [attemptedNotes, setAttemptedNotes] = useState<AttemptedNoteType[]>([]);
    const { currentGame } = useAppStore();
    const rounds = useMemo(() => currentGame?.rounds || [], [currentGame?.rounds]);
    console.log(rounds.length);

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

    useLayoutEffect(() => {
        eventEmitter.addListener(AppEvents.NotePlayed, (event) => {
            console.log("event:::", event);
            const { currNote, playedNote, isSuccess, currNoteValue } = event.data as NotePlayedEventData;

            setAttemptedNotes((prev) => [
                ...prev,
                { id: randomUID(), you: playedNote, correct: currNote, isSuccess, noteScore: currNoteValue },
            ]);
        });
    }, []);

    useEffect(() => {
        console.log({ attemptedNotes });
    }, [attemptedNotes]);

    useEffect(() => {
        console.log({ rounds });
    }, [rounds]);

    return (
        <View style={{ ...s.attemptedNotes, transform: [{ translateY: 20 }] }}>
            {attemptedNotes.map((attempt) => (
                <AttemptedNote key={attempt.id} attempt={attempt} />
            ))}
        </View>
    );
}
