import { testBorder } from "@/utils/styles";
import { AppLogo } from "./AppLogo";
import { AppText } from "./AppText";
import { AppView } from "./AppView";
import { APP_NAME } from "@/utils/APP_NAME";
import { Dimensions, Platform, StyleSheet } from "react-native";

export function AppTextLogo({ subtitles }: { subtitles?: string }) {
    return (
        <AppView transparentBG style={s.outer}>
            <AppView transparentBG style={s.titleContainer}>
                <AppView style={s.logo}>
                    <AppLogo />
                </AppView>

                <AppText type="title" style={s.title}>
                    {APP_NAME}
                </AppText>
            </AppView>

            {subtitles ? (
                <AppView style={s.subtitleContainer}>
                    <AppText style={s.subtitle}>{subtitles}</AppText>
                </AppView>
            ) : null}
        </AppView>
    );
}

const s = StyleSheet.create({
    outer: {
        width: Dimensions.get("window").width,
        // ...testBorder(),
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        // paddingRight: 12,
        // ...testBorder("purple"),
    },
    logo: {
        marginRight: -20,
        // ...testBorder("purple"),
    },
    title: {
        padding: 12,
        paddingTop: 16,
        // ...testBorder("blue"),
    },
    subtitleContainer: {
        width: "100%",
        justifyContent: "center",
        // ...testBorder("green"),
    },
    subtitle: {
        width: "100%",
        textAlign: "center",
        // lineHeight: 20,
        marginTop: -6,
        // ...testBorder("green"),
    },
});
