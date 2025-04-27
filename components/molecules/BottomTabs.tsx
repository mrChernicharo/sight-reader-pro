import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/utils/Colors";
import { glyphs } from "@/utils/constants";
import { Clef } from "@/utils/enums";
import { testBorder } from "@/utils/styles";
import { Dimensions, Pressable, StyleSheet } from "react-native";

export function BottomTabs() {
    const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");
    const accentColor = useThemeColor({ light: Colors.light.accent, dark: Colors.dark.accent }, "accent");
    const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, "text");
    const clef = useAppStore((state) => state.selectedLevelsClef);
    const setSelectedClef = useAppStore((state) => state.setSelectedLevelsClef);
    return (
        <AppView style={s.bottomTabs}>
            <Pressable
                android_ripple={{ radius: 180, color: textColor }}
                onPress={() => setSelectedClef(Clef.Treble)}
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: 5,
                    borderColor: clef == Clef.Treble ? accentColor : backgroundColor,
                    borderTopWidth: 3,
                    height: "100%",
                }}
            >
                <AppText type="lg" style={{ lineHeight: 54 }}>
                    {glyphs[`trebleClef`]}
                </AppText>
            </Pressable>
            <Pressable
                android_ripple={{ radius: 180, color: textColor }}
                onPress={() => setSelectedClef(Clef.Bass)}
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: 5,
                    borderColor: clef == Clef.Bass ? accentColor : backgroundColor,
                    borderTopWidth: 3,
                    height: "100%",
                }}
            >
                <AppText type="title" style={{ lineHeight: 54 }}>
                    {glyphs[`bassClef`]}
                </AppText>
            </Pressable>
        </AppView>
    );
}

export const s = StyleSheet.create({
    bottomTabs: {
        position: "absolute",
        bottom: 0,
        zIndex: 100,
        flexDirection: "row",
        alignItems: "center",
        minHeight: 74,
        // ...testBorder(),
        // borderWidth: 1,
        // borderColor: "red",
    },
});
