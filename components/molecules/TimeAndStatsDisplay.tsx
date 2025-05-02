import { useAllLevels } from "@/hooks/useAllLevels";
import { StyleSheet } from "react-native";
import { AppView } from "../atoms/AppView";
import { GameStatsDisplaySimple } from "./GameStatsDisplay/GameStatsDisplaySimple";
import { CountdownTimer } from "./Timer";

export function TimerAndStatsDisplay({
    levelId,
    stopped,
    onCountdownFinish,
}: {
    levelId: string;
    stopped?: boolean;
    onCountdownFinish: () => void;
}) {
    const { getLevel } = useAllLevels();
    const level = getLevel(levelId);

    function onTick(secondsRemaining: number) {
        const elapsedPercent = (level.durationInSeconds - secondsRemaining) / level.durationInSeconds;
        if (elapsedPercent >= 1) {
            onCountdownFinish();
        }
    }

    return (
        <AppView style={s.container}>
            <GameStatsDisplaySimple level={level} />

            <CountdownTimer stopped={stopped} initialTime={level.durationInSeconds} onTick={onTick} />
        </AppView>
    );
}
const s = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 12,
        borderRadius: 8,
        // borderWidth: 1,
        // borderColor: "red",
    },
});
