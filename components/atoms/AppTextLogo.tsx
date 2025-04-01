import { AppLogo } from "./AppLogo";
import { AppText } from "./AppText";
import { AppView } from "./AppView";

export function AppTextLogo({ subtitles }: { subtitles: string }) {
  return (
    <AppView style={{ alignItems: "center" }}>
      <AppView style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <AppLogo />
        <AppText type="title">Sight Reader Pro</AppText>
      </AppView>
      {subtitles ? <AppText>{subtitles}</AppText> : null}
    </AppView>
  );
}
