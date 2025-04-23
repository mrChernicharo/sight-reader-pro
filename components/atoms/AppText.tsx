import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/utils/Colors";

type TextType = "default" | "defaultSemiBold" | "md" | "mdSemiBold" | "lg" | "title" | "subtitle" | "link";

export type AppTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: TextType;
    forceBlackText?: boolean;
};

export function AppText({ style, lightColor, darkColor, forceBlackText, type, ...rest }: AppTextProps) {
    // const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const themeColor = useThemeColor(
        { light: (lightColor = Colors.light.text), dark: (darkColor = Colors.dark.text) },
        "text"
    );
    const color = forceBlackText ? "black" : themeColor;

    const textStyle = s[type!] ? s[type!] : s.default;

    return <Text style={{ color, ...textStyle, ...(style as any) }} {...rest} />;
}

const s = StyleSheet.create({
    default: {
        fontSize: 14,
        lineHeight: 26,
    },
    defaultSemiBold: {
        fontSize: 14,
        lineHeight: 26,
        fontWeight: "600",
    },
    md: {
        fontSize: 16,
        lineHeight: 24,
    },
    mdSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "600",
    },
    lg: {
        fontSize: 24,
        lineHeight: 32,
    },
    title: {
        fontSize: 28,
        lineHeight: 36,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 20,
        lineHeight: 36,
        fontWeight: "bold",
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: "#0a7ea4",
    },
});
