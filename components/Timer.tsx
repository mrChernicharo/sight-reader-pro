import { useEffect, useState } from "react";
import { AppText } from "./AppText";
import { AppView } from "./AppView";

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
