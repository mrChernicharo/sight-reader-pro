import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { router, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
    fade: true,
    duration: 1000,
});

export default function AppRoutes() {
    // const { id, keySignature, previousPage } = useLocalSearchParams() as unknown as GameScreenParams;
    const path = usePathname();

    const [fontsLoaded, fontsError] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        Grotesque: require("../assets/fonts/BowlbyOneSC-Regular.ttf"),
        ...FontAwesome.font,
    });

    const _hydrated = useAppStore((state) => state._hydrated);
    // const currentGame = useAppStore((state) => state.currentGame);
    const games = useAppStore((state) => state.games);
    const initTourCompleted = useAppStore((state) => state.completedTours.init);
    const soundsLoaded = useAppStore((state) => state.soundsLoaded);

    const theme = useTheme();
    // const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");

    const endGame = useAppStore((state) => state.endGame);
    const allState = useAppStore();

    // ensure there's no ongoing game on app startup
    // store state is always persisted, so games can be wrongly persisted if you close the app during a game
    useEffect(() => {
        if (!_hydrated) endGame();
    }, [_hydrated]);

    // useEffect(() => {
    // }, []);

    useEffect(() => {
        console.log("path :::", path);
    }, [path]);

    // useEffect(() => {
    //     console.log("currentGame :::", { currentGame: currentGame?.name });
    // }, [currentGame]);

    // useEffect(() => {
    //     console.log("games :::", { games: games.length, lastGame: games.at(-1) });
    // }, [games]);

    useEffect(() => {
        if (!initTourCompleted) {
            router.replace("/init/01.lang.screen");
        }
    }, [initTourCompleted]);

    useEffect(() => {
        if (soundsLoaded && fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [soundsLoaded, fontsLoaded]);

    useEffect(() => {
        NavigationBar.setVisibilityAsync("hidden");
        NavigationBar.setBehaviorAsync("overlay-swipe");

        NavigationBar.setBackgroundColorAsync(theme == "light" ? Colors.light.bg : Colors.dark.bg);
        NavigationBar.setButtonStyleAsync(theme == "light" ? "dark" : "light");

        SystemUI.setBackgroundColorAsync(theme == "light" ? Colors.light.bg : Colors.dark.bg);

        // @TODO: REMOVE THIS BEFORE BUILD
        // router.navigate("/level-selection");
        // router.navigate("/practice");
    }, [theme]);

    if (fontsError) {
        return (
            <AppView style={{ flex: 1 }}>
                <AppText>Ooops...</AppText>
            </AppView>
        );
    }

    if (!_hydrated)
        return (
            <AppView style={{ flex: 1 }}>
                <AppText>Loading...</AppText>
            </AppView>
        );

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />

            <Stack.Screen name="init" options={{ headerShown: false }} />

            <Stack.Screen name="level-selection" options={{ headerShown: false }} />

            <Stack.Screen name="level-details" options={{ headerShown: false }} />
            <Stack.Screen name="game-level" options={{ headerShown: false }} />
            <Stack.Screen name="game-over" options={{ headerShown: false }} />

            <Stack.Screen name="practice" options={{ headerShown: false }} />

            <Stack.Screen name="profile" options={{ headerShown: false }} />

            <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
    );
}
