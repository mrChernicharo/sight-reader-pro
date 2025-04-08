import { AppText } from "@/components/atoms/AppText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { glyphs } from "@/utils/constants";
import { Tabs } from "expo-router";

export default function TabLayout() {
    const { t } = useTranslation();
    const accentColor = useThemeColor({ light: Colors.light.accent, dark: Colors.dark.accent }, "accent");

    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: accentColor }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: t("music.clefs.treble"),
                    headerShown: false,
                    // headerBackButtonDisplayMode: "minimal",
                    // tabBarIcon: ({ color, focused }) => <FontAwesome size={28} name="home" color={color} />,
                    tabBarIcon: ({ color, focused }) => (
                        <AppText style={{ ...(focused && { color: accentColor }) }}>{glyphs[`trebleClef`]}</AppText>
                    ),
                }}
            />
            <Tabs.Screen
                name="bass"
                options={{
                    title: t("music.clefs.bass"),
                    // headerBackButtonDisplayMode: "generic",
                    // tabBarShowLabel: false,
                    headerShown: false,

                    // tabBarIcon: ({ color, focused }) => <FontAwesome size={28} name="cog" color={color} />,
                    tabBarIcon: ({ color, focused }) => (
                        <AppText type="lg" style={{ ...(focused && { color: accentColor }) }}>
                            {glyphs[`bassClef`]}
                        </AppText>
                    ),
                }}
            />
        </Tabs>
    );
}
