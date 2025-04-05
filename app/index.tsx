import AppButton from "@/components/atoms/AppButton";
import { AppTextLogo } from "@/components/atoms/AppTextLogo";
import { AppView } from "@/components/atoms/AppView";
import { FadeIn } from "@/components/atoms/FadeIn";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { Link } from "expo-router";
import { StyleSheet, useColorScheme } from "react-native";

export default function Home() {
    const theme = useColorScheme() ?? "light";
    const { t } = useTranslation();

    return (
        <AppView style={s.container}>
            <FadeIn y={50} x={0} delay={0}>
                <AppTextLogo subtitles={t("app.slogan")} />
            </FadeIn>

            <FadeIn y={50} x={0} delay={250}>
                <AppView style={{ alignItems: "center", rowGap: 12, width: 200 }}>
                    <Link style={s.link} href="/practice">
                        <AppButton
                            text={t("routes.practice")}
                            style={[s.btn, { borderColor: Colors[theme].text }]}
                            textStyle={{ color: Colors[theme].text }}
                        />
                    </Link>

                    <Link style={s.link} href="/profile">
                        <AppButton
                            text={t("routes.profile")}
                            style={[s.btn, { borderColor: Colors[theme].text }]}
                            textStyle={{ color: Colors[theme].text }}
                        />
                    </Link>

                    <Link style={s.link} href="/settings">
                        <AppButton
                            text={t("routes.settings")}
                            style={[s.btn, { borderColor: Colors[theme].text }]}
                            textStyle={{ color: Colors[theme].text }}
                        />
                    </Link>

                    <Link style={s.link} href="/init/01.lang.screen">
                        <AppButton
                            text={t("routes.init")}
                            style={[s.btn, { borderColor: Colors[theme].text }]}
                            textStyle={{ color: Colors[theme].text }}
                        />
                    </Link>
                </AppView>
            </FadeIn>

            <FadeIn y={50} x={0} delay={500}>
                <Link href="/level-selection" asChild>
                    <AppButton
                        text={t("routes.main.cta")}
                        style={{ width: 300, height: 56 }}
                        textStyle={{ color: "white", fontSize: 24 }}
                        activeOpacity={0.7}
                    />
                </Link>
            </FadeIn>
        </AppView>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 104,
        paddingBottom: 52,
    },
    link: { width: 200 },
    btn: { backgroundColor: "rgba(0, 0, 0, 0)", borderWidth: 1, width: 200 },
});
