import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { SoundContextProvider } from "@/hooks/useSoundsContext";
import { usePathname } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppRoutes from "./_app.routes";

export default function RootLayout() {
  // const hydrated = useAppStore((state) => state._hydrated);
  const path = usePathname();
  const { _hydrated, currentGame, endGame } = useAppStore();

  // ensure there's no ongoing game on app startup
  // store state is always persisted, so games can be wrongly persisted if you close the app during a game
  useEffect(() => {
    if (currentGame) endGame();
  }, []);

  useEffect(() => {
    console.log({ path, currentGame: currentGame?.id || null });
  }, [currentGame?.id, path]);

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
