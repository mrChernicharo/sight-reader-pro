import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/utils/Colors";

type TT = "default" | "defaultSemiBold" | "md" | "mdSemiBold" | "title" | "subtitle" | "link";

export type AppTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: TT;
};

export function AppText({ style, lightColor, darkColor, type, ...rest }: AppTextProps) {
  // const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const color = useThemeColor(
    { light: (lightColor = Colors.light.text), dark: (darkColor = Colors.dark.text) },
    "text"
  );

  const textStyle = s[type!] ? s[type!] : s.default;

  return <Text style={[{ color }, textStyle, style]} {...rest} />;
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
