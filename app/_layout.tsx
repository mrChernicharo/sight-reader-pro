import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { SoundContextProvider } from "@/hooks/useSoundsContext";
import { CurrentGame, GameScreenParams, Round } from "@/utils/types";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppRoutes from "./_app.routes";
import { GameType, GameState } from "@/utils/enums";
import { getLevel } from "@/utils/levels";
import { decideNextRound, getPossibleNotesInLevel } from "@/utils/noteFns";
import { useIntl } from "@/hooks/useIntl";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { useColorScheme } from "react-native";
// useEffect(() => {
// }, []);
export default function RootLayout() {
    const path = usePathname();
    const { id, keySignature, previousPage } = useLocalSearchParams() as unknown as GameScreenParams;

    const _hydrated = useAppStore((state) => state._hydrated);
    const currentGame = useAppStore((state) => state.currentGame);
    const initTourCompleted = useAppStore((state) => state.completedTours.init);
    const theme = useColorScheme() ?? "light";
    const backgroundColor = useThemeColor(
        { light: Colors.light.background, dark: Colors.dark.background },
        "background"
    );

    const endGame = useAppStore((state) => state.endGame);

    // ensure there's no ongoing game on app startup
    // store state is always persisted, so games can be wrongly persisted if you close the app during a game
    useEffect(() => {
        if (!_hydrated) endGame();
    }, [_hydrated]);

    useEffect(() => {
        console.log({ path, ...(currentGame && { currentGame: currentGame }) });
    }, [currentGame?.id, path]);

    useEffect(() => {
        console.log({ id, keySignature, previousPage });
    }, [id, keySignature, previousPage]);

    useEffect(() => {
        if (!initTourCompleted) {
            router.replace("/init/01.lang.screen");
        }
    }, [initTourCompleted]);

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync("rgba(0,0,0,0)");

        router.navigate("/level-selection/(tabs)");
    }, []);

    if (!_hydrated)
        return (
            <AppView>
                <AppText>Loading...</AppText>
            </AppView>
        );

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView>
                <SoundContextProvider>
                    <StatusBar translucent style={theme == "light" ? "dark" : "light"} />
                    <AppRoutes />
                </SoundContextProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
