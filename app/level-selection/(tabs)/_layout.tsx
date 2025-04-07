import { AppText } from "@/components/atoms/AppText";
import { BackLink } from "@/components/atoms/BackLink";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { glyphs } from "@/utils/constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

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

export const tabStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 24,
        // paddingTop: StatusBar.currentHeight,
        minHeight: Dimensions.get("window").height,
    },
    top: {
        width: "100%",
        position: "relative",
        alignItems: "center",
    },
    sectionTitle: {
        paddingVertical: 16,
    },
    gridSection: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
        gap: 16,
    },
    gridRow: {
        flexDirection: "row",
        gap: 16,
    },
    item: {
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
    },

    footerFiller: {
        height: 60,
    },
});

export function makeGrid<T>(nums: T[], cols = 2) {
    const grid: T[][] = [];
    nums.forEach((n, i) => {
        if (i % cols == 0) {
            grid.push([n]);
        } else {
            grid?.at(-1)?.push(n);
        }
    });

    return grid;
}
