import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppInitialization } from "@/hooks/useAppInitialization";
import { SoundContextProvider } from "@/hooks/useSoundsContext";
import { Colors } from "@/utils/Colors";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { NativeEventEmitter, NativeModules } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppRoutes from "./_app.routes";

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
        <SafeAreaProvider
            style={{
                // paddingTop: Platform.OS == "ios" ? 32 : 16,
                backgroundColor: Colors.dark.bg,
            }}
        >
            <MenuProvider>
                <SoundContextProvider>
                    <StatusBar translucent style="light" />
                    <AppRoutes />
                </SoundContextProvider>
            </MenuProvider>
        </SafeAreaProvider>
    );
}
