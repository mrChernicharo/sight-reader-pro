import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/utils/Colors";

export type AppViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  transparentBG?: boolean;
};

export function AppView({ style, lightColor, darkColor, transparentBG, ...otherProps }: AppViewProps) {
  const themeBG = useThemeColor(
    { light: (lightColor = Colors.light.background), dark: (darkColor = Colors.dark.background) },
    "background"
  );

  const backgroundColor = transparentBG ? "transparent" : themeBG;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
