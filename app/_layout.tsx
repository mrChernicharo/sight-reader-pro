import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { SoundContextProvider } from "@/hooks/useSoundsContext";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { router, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Dimensions, NativeEventEmitter, NativeModules, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppRoutes from "./_app.routes";
import { AppEvents } from "@/utils/enums";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
    fade: true,
    duration: 1000,
});

export const eventEmitter = new NativeEventEmitter(NativeModules as any);

export default function RootLayout() {
    const { fontsError, _hydrated } = useAppInitialization();

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
        <SafeAreaProvider style={{ paddingTop: Platform.OS == "ios" ? 32 : 16, backgroundColor: Colors.dark.bg }}>
            <GestureHandlerRootView>
                <MenuProvider>
                    <SoundContextProvider>
                        <StatusBar translucent style="light" />
                        <AppRoutes />
                    </SoundContextProvider>
                </MenuProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}

export function useAppInitialization() {
    const path = usePathname();
    const theme = useTheme();

    const [fontsLoaded, fontsError] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        Grotesque: require("../assets/fonts/BowlbyOneSC-Regular.ttf"),
        // ...FontAwesome.font,
    });

    const _hydrated = useAppStore((state) => state._hydrated);
    const initTourCompleted = useAppStore((state) => state.completedTours.init);
    const soundsLoaded = useAppStore((state) => state.soundsLoaded);

    const endGame = useAppStore((state) => state.endGame);

    // ensure there's no ongoing game on app startup
    // store state is always persisted, so games can be wrongly persisted if you close the app during a game
    useEffect(() => {
        if (!_hydrated) endGame();
    }, [_hydrated]);

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
        console.log("listenerCount ::::", eventEmitter.listenerCount(AppEvents.NotePlayed));
        console.log("path :::", path);
        console.log("Dimensions :::", Dimensions.get("window"));
    }, [path]);

    useEffect(() => {
        NavigationBar.setVisibilityAsync("hidden");
        NavigationBar.setBehaviorAsync("overlay-swipe");

        NavigationBar.setBackgroundColorAsync(Colors.dark.bg);
        NavigationBar.setButtonStyleAsync("light");

        SystemUI.setBackgroundColorAsync(Colors.dark.bg);

        // @TODO: REMOVE THIS BEFORE BUILD
        // router.navigate("/level-selection");
        // router.navigate("/practice");
    }, [theme]);

    return {
        fontsError,
        _hydrated,
    };
}
