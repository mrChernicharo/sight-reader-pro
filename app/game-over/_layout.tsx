import { Stack } from "expo-router";

export default function GameOverLayout() {
  return (
    <Stack>
      <Stack.Screen name="[gameState]" options={{ headerShown: false }} />
    </Stack>
  );
}
