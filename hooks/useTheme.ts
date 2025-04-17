import { useColorScheme } from "react-native";

const useTheme = () => useColorScheme() ?? "light";
