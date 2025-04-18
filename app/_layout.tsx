import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { SoundContextProvider } from "@/hooks/useSoundsContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/utils/Colors";
import { GameScreenParams } from "@/utils/types";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { router, useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppRoutes from "./_app.routes";
import { Clef, KeySignature } from "@/utils/enums";
import { makeLevelGroup, Scale } from "@/utils/types.v2";

export default function RootLayout() {
    const path = usePathname();
    const { id, keySignature, previousPage } = useLocalSearchParams() as unknown as GameScreenParams;

    const _hydrated = useAppStore((state) => state._hydrated);
    const currentGame = useAppStore((state) => state.currentGame);
    const initTourCompleted = useAppStore((state) => state.completedTours.init);
    const theme = useTheme();
    const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");

    const endGame = useAppStore((state) => state.endGame);

    // ensure there's no ongoing game on app startup
    // store state is always persisted, so games can be wrongly persisted if you close the app during a game
    useEffect(() => {
        if (!_hydrated) endGame();
    }, [_hydrated]);

    useEffect(() => {
        console.log("path :::", { path, ...(currentGame && { currentGame: currentGame.id }) });
        currentGame && console.log("currentGame :::", { currentGame: currentGame.name });
    }, [currentGame?.id, path]);

    useEffect(() => {
        console.log("params :::", { id, keySignature, previousPage });
    }, [id, keySignature, previousPage]);

    useEffect(() => {
        if (!initTourCompleted) {
            router.replace("/init/01.lang.screen");
        }
    }, [initTourCompleted]);

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync(theme == "light" ? Colors.light.bg : Colors.dark.bg);
        NavigationBar.setButtonStyleAsync(theme == "light" ? "dark" : "light");
        SystemUI.setBackgroundColorAsync(theme == "light" ? Colors.light.bg : Colors.dark.bg);
        // @TODO: REMOVE THIS BEFORE BUILD
        // router.navigate("/level-selection");
        // router.navigate("/practice");
    }, [theme]);

    if (!_hydrated)
        return (
            <AppView>
                <AppText>Loading...</AppText>
            </AppView>
        );

    return (
        <SafeAreaProvider style={{ paddingTop: 24 }}>
            <GestureHandlerRootView>
                <SoundContextProvider>
                    <StatusBar translucent style={theme == "light" ? "dark" : "light"} />
                    <AppRoutes />
                </SoundContextProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
