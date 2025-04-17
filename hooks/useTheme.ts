import { useColorScheme } from "react-native";

export const useTheme = () => useColorScheme() ?? "light";
