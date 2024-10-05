import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="levels" />
      </Stack>
    </GestureHandlerRootView>
  );
}
