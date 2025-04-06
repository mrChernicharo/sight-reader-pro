import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppTextLogo } from "@/components/atoms/AppTextLogo";
import { AppView } from "@/components/atoms/AppView";
import { FadeIn } from "@/components/atoms/FadeIn";
import { useAppStore } from "@/hooks/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";

import Tooltip from "react-native-walkthrough-tooltip";

export default function Home() {
    const theme = useColorScheme() ?? "light";
    const { t } = useTranslation();
    const username = useAppStore((state) => state.username);
    const homeTourCompleted = useAppStore((state) => state.completedTours.home);
    const setTourCompleted = useAppStore((state) => state.setTourCompleted);

    const [ShowWelcome, setShowWelcome] = useState(false);
    const [ShowCTA, setShowCTA] = useState(false);

    useEffect(() => {
        if (!homeTourCompleted) {
            // setTimeout(() => setShowWelcome(true), 400);
            setShowWelcome(true);
        }
    }, [homeTourCompleted]);

    return (
        <AppView style={s.container}>
            <Tooltip
                isVisible={ShowWelcome}
                placement="center"
                content={
                    <AppView style={{ alignItems: "center" }}>
                        <AppText type="subtitle">Boas vindas, {username}</AppText>
                        <AppText>Obrigado por usar o Sight Reader Pro!</AppText>
                        <AppText>Vamos iniciar nosso treinamento?</AppText>
                        <AppButton
                            text="Ok, vamos lá"
                            onPress={() => {
                                setShowWelcome(false);
                                setTimeout(() => setShowCTA(true), 200);
                            }}
                        />
                    </AppView>
                }
            />

            <FadeIn y={50} x={0} delay={0}>
                <AppTextLogo subtitles={t("app.slogan")} />
            </FadeIn>

            <FadeIn y={50} x={0} delay={250}>
                <AppView style={{ alignItems: "center", rowGap: 12, width: 200 }}>
                    <Link asChild href="/practice">
                        <AppButton
                            text={t("routes.practice")}
                            style={{ ...s.btn, borderColor: Colors[theme].text }}
                            textStyle={{ color: Colors[theme].text }}
                        />
                    </Link>

                    <Link asChild href="/profile">
                        <AppButton
                            text={t("routes.profile")}
                            style={{ ...s.btn, borderColor: Colors[theme].text }}
                            textStyle={{ color: Colors[theme].text }}
                        />
                    </Link>

                    <Link asChild href="/settings">
                        <AppButton
                            text={t("routes.settings")}
                            style={{ ...s.btn, borderColor: Colors[theme].text }}
                            textStyle={{ color: Colors[theme].text }}
                        />
                    </Link>

                    {/* <Link asChild href="/init/01.lang.screen">
                        <AppButton
                            text={t("routes.init.title")}
                            style={[s.btn, { borderColor: Colors[theme].text }]}
                            textStyle={{ color: Colors[theme].text }}
                        />
                    </Link> */}
                </AppView>
            </FadeIn>

            <Tooltip
                isVisible={ShowCTA}
                placement="top"
                content={
                    <AppView>
                        <AppText>Clique aqui para jogar</AppText>
                    </AppView>
                }
            >
                <FadeIn y={50} x={0} delay={500}>
                    <Link
                        asChild
                        href="/level-selection"
                        onPress={() => {
                            setTourCompleted("home", true);
                        }}
                    >
                        <AppButton
                            text={t("routes.main.cta")}
                            style={{ width: 300, height: 56 }}
                            textStyle={{ color: "white", fontSize: 24 }}
                            activeOpacity={0.7}
                        />
                    </Link>
                </FadeIn>
            </Tooltip>
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
    btn: { backgroundColor: "transparent", borderWidth: 1, width: 200 },
});
