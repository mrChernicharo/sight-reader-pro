import { useEffect, useRef, useState } from "react";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import { DimensionValue, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const intl = new Intl.DateTimeFormat("en", { second: "2-digit", minute: "2-digit" });

export function CountdownTimer({
  initialTime,
  count,
  setCount,
  onCountdownFinish,
}: {
  initialTime: number;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  onCountdownFinish: () => Promise<void>;
}) {
  const done = useRef(false);
  const elapsed = 1 - count / initialTime;
  const barWidth = `${elapsed * 100}%` as DimensionValue;

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => (c <= 0 ? 0 : c - 1000));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (count <= 0 && !done.current) {
      done.current = true;
      onCountdownFinish();
    }
    // console.log(elapsed);
  }, [count]);

  return (
    <AppView>
      <AppText>{intl.format(count)}</AppText>

      <AppView style={s.bar}>
        <AppView style={[s.innerBar, { backgroundColor: Colors.light.tint, width: barWidth }]} />
      </AppView>
    </AppView>
  );
}

const s = StyleSheet.create({
  bar: {
    backgroundColor: "gray",
    width: "100%",
    height: 12,
    borderRadius: 4,
    overflow: "hidden",
  },
  innerBar: {
    height: 12,
    borderRadius: 0,
  },
});
