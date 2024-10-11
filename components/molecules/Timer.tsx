import { useEffect, useRef, useState } from "react";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import { DimensionValue, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const intlMinutes = new Intl.DateTimeFormat("en", { second: "2-digit", minute: "2-digit" });

export function CountdownTimer({
  initialTime,
  onTick,
}: {
  initialTime: number;
  // count: number;
  // setCount: React.Dispatch<React.SetStateAction<number>>;
  onTick: (secondsRemaining: number) => void;
}) {
  const running = useRef(true);
  const [count, setCount] = useState(initialTime);

  const elapsed = 1 - count / initialTime;
  const barWidth = `${elapsed * 100}%` as DimensionValue;

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((curr) => {
        return curr <= 0 ? 0 : curr - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (running.current) {
      if (count <= 0) {
        running.current = false;
      }
      onTick(count);
    }
  }, [count]);



  return (
    <AppView>
      <AppText>{intlMinutes.format(count * 1000)}</AppText>

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
