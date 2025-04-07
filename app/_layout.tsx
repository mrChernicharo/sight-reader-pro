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

export default function RootLayout() {
    const _hydrated = useAppStore((state) => state._hydrated);
    const currentGame = useAppStore((state) => state.currentGame);
    // const language = useAppStore((state) => state.language);
    // const knowledge = useAppStore((state) => state.knowledge);
    // const username = useAppStore((state) => state.username);
    const initTourCompleted = useAppStore((state) => state.completedTours.init);
    const endGame = useAppStore((state) => state.endGame);
    const startNewGame = useAppStore((state) => state.startNewGame);
    const path = usePathname();
    const { id, keySignature, previousPage } = useLocalSearchParams() as unknown as GameScreenParams;

    // ensure there's no ongoing game on app startup
    // store state is always persisted, so games can be wrongly persisted if you close the app during a game
    useEffect(() => {
        if (!_hydrated) endGame();
        // router.replace("/practice");
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

    useEffect(() => {}, []);

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
