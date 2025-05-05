import { Colors } from "@/utils/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppText } from "./AppText";

const Star = ({ color }: { color?: string }) => <Ionicons name="star" color={color} />;

// prettier-ignore
export function GameStars({ stars, color }: { stars: number, color?: string }) {
    const c = color || Colors.dark.text;
    
    if (stars == 0) return null;
    if (stars == 1) return <AppText><Star color={c} /></AppText>;
    if (stars == 2) return <AppText><Star color={c}/><Star color={c}/></AppText>;
    if (stars == 3) return <AppText><Star color={c}/><Star color={c}/><Star color={c}/></AppText>;
}
