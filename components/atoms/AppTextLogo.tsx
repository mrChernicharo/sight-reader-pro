import { AppLogo } from "./AppLogo";
import { AppText } from "./AppText";
import { AppView } from "./AppView";

export function AppTextLogo({ subtitles }: { subtitles?: string }) {
    return (
        <AppView transparentBG style={{ paddingRight: 20 }}>
            <AppView transparentBG style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <AppLogo />
                <AppText type="title" style={{ marginLeft: -2, marginTop: 4 }}>
                    Sight Reader Pro
                </AppText>
            </AppView>
            {subtitles ? <AppText>{subtitles}</AppText> : null}
        </AppView>
    );
}
