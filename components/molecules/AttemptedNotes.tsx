import { getAttemptedNoteDuration, wait } from "@/utils/helperFns";
import { AttemptedNote as AttemptedNoteType } from "@/utils/types";
import { useEffect } from "react";
import { AppView } from "../atoms/AppView";
import { AttemptedNote } from "../atoms/AttemptedNote";
import { STYLES } from "@/utils/styles";

const s = STYLES.game;

export function AttemptedNotes({
    rounds,
    attemptedNotes,
    setAttemptedNotes,
}: {
    rounds: number;
    attemptedNotes: AttemptedNoteType[];
    setAttemptedNotes: React.Dispatch<React.SetStateAction<AttemptedNoteType[]>>;
}) {
    useEffect(() => {
        (async () => {
            const duration = getAttemptedNoteDuration(true);
            await wait(duration);

            setAttemptedNotes((prev) => {
                prev.shift();
                return prev;
            });
        })();
    }, [rounds]);

    return (
        <AppView style={{ ...s.attemptedNotes, transform: [{ translateY: 20 }] }}>
            {attemptedNotes.map((attempt) => (
                <AttemptedNote key={attempt.id} attempt={attempt} />
            ))}
        </AppView>
    );
}
