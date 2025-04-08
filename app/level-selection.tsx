import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { glyphs } from "@/utils/constants";
import { Tabs } from "expo-router";

export default function LevelSelectionScreen() {
    return (
        <AppView>
            <AppText>level selection</AppText>
        </AppView>
    );
}

export function TabLayout() {
    const { t } = useTranslation();
    const accentColor = useThemeColor({ light: Colors.light.accent, dark: Colors.dark.accent }, "accent");

    return null;
}

// {/* Bottom Tabs */}
// <AppView style={{ position: "absolute", bottom: 0, zIndex: 100, flexDirection: "row" }}>
//     <Pressable
//         android_ripple={{ radius: 240 }}
//         onPress={() => setSelectedClef(Clef.Treble)}
//         style={{
//             flex: 1,
//             alignItems: "center",
//             paddingTop: 5,
//             borderColor: selectedClef == Clef.Treble ? accentColor : backgroundColor,
//             borderTopWidth: 3,
//         }}
//     >
//         <AppText type="lg" style={{ lineHeight: 54 }}>
//             {glyphs[`trebleClef`]}
//         </AppText>
//     </Pressable>
//     <Pressable
//         android_ripple={{ radius: 240 }}
//         onPress={() => setSelectedClef(Clef.Bass)}
//         style={{
//             flex: 1,
//             alignItems: "center",
//             paddingTop: 5,
//             borderColor: selectedClef == Clef.Bass ? accentColor : backgroundColor,
//             borderTopWidth: 3,
//         }}
//     >
//         <AppText type="title" style={{ lineHeight: 54 }}>
//             {glyphs[`bassClef`]}
//         </AppText>
//     </Pressable>
// </AppView>
