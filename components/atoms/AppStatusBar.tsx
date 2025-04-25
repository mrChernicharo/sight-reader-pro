import { useTheme } from "@/hooks/useTheme";
import { StatusBar } from "expo-status-bar";

export function AppStatusBar() {
    const theme = useTheme();
    const style = theme == "light" ? "dark" : "light";

    return <StatusBar translucent style={style} />;
}
