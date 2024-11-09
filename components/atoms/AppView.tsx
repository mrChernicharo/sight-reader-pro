import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/utils/Colors";

export type AppViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function AppView({ style, lightColor, darkColor, ...otherProps }: AppViewProps) {
  const backgroundColor = useThemeColor(
    { light: (lightColor = Colors.light.background), dark: (darkColor = Colors.dark.background) },
    "background"
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
