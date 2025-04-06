import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { SoundContextProvider } from "@/hooks/useSoundsContext";
import { Redirect, router, usePathname } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppRoutes from "./_app.routes";

export default function RootLayout() {
    const _hydrated = useAppStore((state) => state._hydrated);
    const currentGame = useAppStore((state) => state.currentGame);
    // const language = useAppStore((state) => state.language);
    // const knowledge = useAppStore((state) => state.knowledge);
    // const username = useAppStore((state) => state.username);
    const initTourCompleted = useAppStore((state) => state.completedTours.init);
    const endGame = useAppStore((state) => state.endGame);
    const path = usePathname();

    // ensure there's no ongoing game on app startup
    // store state is always persisted, so games can be wrongly persisted if you close the app during a game
    useEffect(() => {
        if (!_hydrated) endGame();
    }, [_hydrated]);

    useEffect(() => {
        console.log({ path, ...(currentGame && { currentGame: currentGame.id }) });
    }, [currentGame?.id, path]);

    useEffect(() => {
        if (!initTourCompleted) {
            router.replace("/init/01.lang.screen");
        }
    }, [initTourCompleted]);

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
                    <AppRoutes />
                </SoundContextProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
