import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useStore";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
      <Stack>
        <Stack.Screen name="index" />
        {/* <Stack.Screen name="settings" /> */}
        {/* <Stack.Screen name="practice-settings" /> */}
        {/* <Stack.Screen name="practice-level" /> */}
      </Stack>
    </GestureHandlerRootView>
  );
}
