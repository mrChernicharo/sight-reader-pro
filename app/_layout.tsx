import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const hydrated = useAppStore((state) => state._hydrated);

  if (!hydrated)
    return (
      <AppView>
        <AppText>Loading...</AppText>
      </AppView>
    );

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <Stack>
          {/*
        new route not working?
        check if its component is DEFAULT EXPORTed
      */}
          <Stack.Screen name="index" options={{ headerShown: false }} />

          <Stack.Screen name="level-selection" options={{ headerShown: false }} />
          <Stack.Screen name="level-details" options={{ headerShown: false }} />
          <Stack.Screen name="game-level" options={{ headerShown: false }} />
          <Stack.Screen name="game-over" options={{ headerShown: false }} />

          <Stack.Screen name="practice" options={{ headerShown: false }} />

          <Stack.Screen name="profile" options={{ headerShown: false }} />

          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
