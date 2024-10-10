import { useEffect, useRef, useState } from "react";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";
import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const intl = new Intl.DateTimeFormat("en", { second: "2-digit", minute: "2-digit" });

export function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + 1000);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <AppView>
      <AppText>{intl.format(count)}</AppText>
    </AppView>
  );
}

export function CountdownTimer({ seconds, onCountdownFinish }: { seconds: number; onCountdownFinish: () => void }) {
  const initialTime = seconds * 1000;
  const [count, setCount] = useState(initialTime);
  const done = useRef(false);
  const elapsed = 1 - count / initialTime;

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
        <AppView
          style={[{ backgroundColor: Colors.light.tint, height: 12, width: `${elapsed * 100}%`, borderRadius: 0 }]}
        />
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
});
