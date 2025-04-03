import { Stack } from "expo-router";

export default function AppRoutes() {
  return (
    <Stack>
      {/* new route not working? check if its component is DEFAULT EXPORTed */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

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
