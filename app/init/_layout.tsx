import { Stack } from "expo-router";

export default function LevelDetailsLayout() {
    return (
        <Stack>
            <Stack.Screen name="01.lang.screen" options={{ headerShown: false }} />
            <Stack.Screen name="02.knowledge.screen" options={{ headerShown: false }} />
            <Stack.Screen name="03.name.screen" options={{ headerShown: false }} />
        </Stack>
    );
}
