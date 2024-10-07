import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type AppViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function AppView({ style, lightColor, darkColor, ...otherProps }: AppViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
