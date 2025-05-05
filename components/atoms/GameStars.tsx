import { Colors } from "@/utils/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppText } from "./AppText";

const Star = () => <Ionicons name="star" color={Colors.dark.text} />;

// prettier-ignore
export function GameStars({ stars }: { stars: number }) {
    if (stars == 0) return null;
    if (stars == 1) return <AppText><Star /></AppText>;
    if (stars == 2) return <AppText><Star /><Star /></AppText>;
    if (stars == 3) return <AppText><Star /><Star /><Star /></AppText>;
}
