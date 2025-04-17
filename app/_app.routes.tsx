import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
    fade: true,
    duration: 1000,
});

/* new route not working? check if its component is DEFAULT EXPORTed */

export default function AppRoutes() {
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
