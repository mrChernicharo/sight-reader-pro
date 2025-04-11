import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { SoundContextProvider } from "@/hooks/useSoundsContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/utils/Colors";
import { GameScreenParams } from "@/utils/types";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
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
    const theme = useColorScheme() ?? "light";
    const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");

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

const TEST_LEVELS_A = makeLevelGroup({
    name: "basics",
    clef: Clef.Treble,
    durations: { min: 20, max: 40 },
    keySignatures: [KeySignature.C],
    levelCount: 12,
    noteRanges: { min: [20, 25], max: [34, 38] },
    scales: [Scale.Diatonic, Scale.Pentatonic],
    winConditions: {
        min: {
            bronze: 12,
            silver: 18,
            gold: 24,
        },
        max: {
            bronze: 16,
            silver: 22,
            gold: 28,
        },
    },
});

const TEST_LEVELS_B = makeLevelGroup({
    name: "mid",
    clef: Clef.Treble,
    durations: { min: 30, max: 60 },
    keySignatures: [KeySignature.Bb, KeySignature.Eb, KeySignature.Ab, KeySignature.Db],
    levelCount: 12,
    noteRanges: { min: [20, 25], max: [34, 38] },
    scales: [Scale.Diatonic, Scale.Pentatonic, Scale.Melodic],
    winConditions: {
        min: {
            bronze: 16,
            silver: 22,
            gold: 28,
        },
        max: {
            bronze: 22,
            silver: 28,
            gold: 34,
        },
    },
});

console.log("TEST_LEVELS ::::", JSON.stringify(TEST_LEVELS_A, null, 2));
console.log("TEST_LEVELS ::::", JSON.stringify(TEST_LEVELS_B, null, 2));
