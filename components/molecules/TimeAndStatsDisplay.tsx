import { AppView } from "../atoms/AppView";
import { CountdownTimer } from "./Timer";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import { getGameStats } from "@/utils/helperFns";
import { GameStatsDisplaySimple } from "./GameStatsDisplay/GameStatsDisplaySimple";
import { useIntl } from "@/hooks/useIntl";
import { useAllLevels } from "@/hooks/useAllLevels";

export function TimerAndStatsDisplay({
    levelId,
    stopped,
    onCountdownFinish,
}: {
    levelId: string;
    stopped?: boolean;
    onCountdownFinish: () => void;
}) {
    const { intl } = useIntl();
    const { getLevel } = useAllLevels();
    const level = getLevel(levelId);
    const [hitsPerMinute, setHitsPerMinute] = useState(0);
    const { currentGame } = useAppStore();
    const { successes } = getGameStats(level, currentGame?.rounds ?? [], intl);

    function onTick(secondsRemaining: number) {
        const elapsedPercent = (level.durationInSeconds - secondsRemaining) / level.durationInSeconds;
        const minuteFraction = 60 / level.durationInSeconds;
        const _hitsPerMinute = (successes * minuteFraction) / elapsedPercent;
        setHitsPerMinute(_hitsPerMinute);

        if (elapsedPercent >= 1) {
            onCountdownFinish();
        }
    }

    return (
        <AppView style={s.container}>
            <GameStatsDisplaySimple level={level} hitsPerMinute={hitsPerMinute} />

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
