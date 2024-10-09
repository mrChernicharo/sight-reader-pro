import { AppLogo } from "./AppLogo";
import { AppText } from "./AppText";
import { AppView } from "./AppView";

export function AppTextLogo({ subtitles }: { subtitles: string }) {
  return (
    <AppView style={{ alignItems: "center" }}>
      <AppView style={{ position: "relative", flexDirection: "row", paddingLeft: 8 }}>
        <AppLogo />
        <AppText type="title" style={{ position: "absolute", right: 16, top: 6 }}>
          Sight Reader Pro
        </AppText>
      </AppView>
      {subtitles ? <AppText>{subtitles}</AppText> : null}
    </AppView>
  );
}
