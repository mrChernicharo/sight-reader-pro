import { testBorder } from "@/utils/styles";
import { AppLogo } from "./AppLogo";
import { AppText } from "./AppText";
import { AppView } from "./AppView";
import { APP_NAME } from "@/utils/constants";

export function AppTextLogo({ subtitles }: { subtitles?: string }) {
    return (
        <AppView transparentBG style={{ paddingRight: 20 }}>
            <AppView transparentBG style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <AppLogo />
                <AppText type="title" style={{ marginLeft: -2, marginTop: 4 }}>
                    {APP_NAME}
                </AppText>
            </AppView>

            {subtitles ? (
                <AppView style={{ width: "110%", marginTop: -16 }}>
                    <AppText style={{ textAlign: "center" }}>{subtitles}</AppText>
                </AppView>
            ) : null}
        </AppView>
    );
}
