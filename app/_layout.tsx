import { AppStatusBar } from "@/components/atoms/AppStatusBar";
import { SoundContextProvider } from "@/hooks/useSoundsContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppRoutes from "./_app.routes";

export default function RootLayout() {
    return (
        <SafeAreaProvider style={{ paddingTop: 24 }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SoundContextProvider>
                    <AppStatusBar />
                    <AppRoutes />
                </SoundContextProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
