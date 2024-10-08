import { useEffect, useRef, useState } from "react";
import { AppText } from "../atoms/AppText";
import { AppView } from "../atoms/AppView";

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
  const [count, setCount] = useState(seconds * 1000);
  const done = useRef(false);

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
  }, [count]);

  return (
    <AppView>
      <AppText>{intl.format(count)}</AppText>
    </AppView>
  );
}
