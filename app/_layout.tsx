import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { SoundContextProvider } from "@/hooks/useSoundsContext";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import * as NavigationBar from "expo-navigation-bar";
import { router, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppRoutes from "./_app.routes";
import { useFonts } from "expo-font";
import { FontAwesome } from "@expo/vector-icons";

export default function RootLayout() {
    const path = usePathname();
    // const { id, keySignature, previousPage } = useLocalSearchParams() as unknown as GameScreenParams;

    const [fontsLoaded, fontsError] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        Grotesque: require("../assets/fonts/BowlbyOneSC-Regular.ttf"),
        ...FontAwesome.font,
    });

    const _hydrated = useAppStore((state) => state._hydrated);
    // const currentGame = useAppStore((state) => state.currentGame);
    const games = useAppStore((state) => state.games);
    const initTourCompleted = useAppStore((state) => state.completedTours.init);
    const theme = useTheme();
    // const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");

    const endGame = useAppStore((state) => state.endGame);

    // ensure there's no ongoing game on app startup
    // store state is always persisted, so games can be wrongly persisted if you close the app during a game
    useEffect(() => {
        if (!_hydrated) endGame();
    }, [_hydrated]);

    // useEffect(() => {
    //     console.log("path :::", path);
    // }, [path]);

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
        NavigationBar.setVisibilityAsync("hidden");
        NavigationBar.setBehaviorAsync("overlay-swipe");

        NavigationBar.setBackgroundColorAsync(theme == "light" ? Colors.light.bg : Colors.dark.bg);
        NavigationBar.setButtonStyleAsync(theme == "light" ? "dark" : "light");

        SystemUI.setBackgroundColorAsync(theme == "light" ? Colors.light.bg : Colors.dark.bg);
        // @TODO: REMOVE THIS BEFORE BUILD
        // router.navigate("/level-selection");
        // router.navigate("/practice");
    }, [theme]);

    if (!_hydrated)
        return (
            <AppView style={{ flex: 1 }}>
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
