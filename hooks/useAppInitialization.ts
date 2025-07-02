import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import { wait } from "@/utils/helperFns";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { router, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";

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
            // router.replace("/init/01.lang.screen");
            wait(0).then(() => router.replace("/init/01.lang.screen"));
        }
    }, [initTourCompleted]);

    useEffect(() => {
        if (soundsLoaded && fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [soundsLoaded, fontsLoaded]);

    // useEffect(() => {
    //     console.log("listenerCount ::::", eventEmitter.listenerCount(AppEvents.NotePlayed));
    //     console.log("path :::", path);
    //     console.log("Dimensions :::", Dimensions.get("screen"));
    // }, [path]);

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
