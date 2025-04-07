import { useEffect, useRef, useState } from "react";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import { DimensionValue, StyleSheet } from "react-native";
import { Colors } from "@/utils/Colors";

const intlMinutes = new Intl.DateTimeFormat("en", { second: "2-digit", minute: "2-digit" });

export function CountdownTimer({
    initialTime,
    stopped,
    onTick,
}: {
    initialTime: number;
    stopped?: boolean;
    onTick: (secondsRemaining: number) => void;
}) {
    // const running = useRef(true);
    const [count, setCount] = useState(initialTime);

    const elapsed = 1 - count / initialTime;
    const barWidth = `${elapsed * 100}%` as DimensionValue;

    useEffect(() => {
        // console.log(":::initialize timer");
        if (stopped) return;

        const interval = setInterval(() => {
            setCount((curr) => {
                return curr <= 0 ? 0 : curr - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [stopped]);

    useEffect(() => {
        onTick(count);
    }, [count]);

    // useEffect(() => {
    //   console.log(":::Timer", count);
    //   if (count <= 0) {
    //     running.current = false;
    //   }
    // }, [count]);

    // useEffect(() => {
    //   console.log(":::initialize timer", count);

    //   return () => {
    //     console.log(":::destroy timer", count);

    //     setCount(0);
    //   };
    // }, []);

    return (
        <AppView style={s.container}>
            <AppText>{intlMinutes.format(count * 1000)}</AppText>
            <AppView style={s.bar}>
                <AppView style={[s.innerBar, { backgroundColor: Colors.light.tint, width: barWidth }]} />
            </AppView>
        </AppView>
    );
}

const s = StyleSheet.create({
    container: {
        paddingTop: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    bar: {
        backgroundColor: "gray",
        width: "80%",
        height: 12,
        borderRadius: 4,
        overflow: "hidden",
    },
    innerBar: {
        height: 12,
        borderRadius: 0,
    },
});
