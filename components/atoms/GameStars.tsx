import { Colors } from "@/utils/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppText } from "./AppText";
import { View, ViewStyle } from "react-native";

const Star = ({ color, style, size = 12 }: { color?: string; style?: ViewStyle; size?: number }) => (
    <View style={style}>
        <AppText>
            <Ionicons name="star" color={color} size={size} />
        </AppText>
    </View>
);

export function GameStars({
    stars,
    color = Colors.dark.text,
    size = 12,
}: {
    stars: number;
    color?: string;
    size?: number;
}) {
    switch (stars) {
        case 0:
            return null;
        case 1:
            return (
                <View style={{ flexDirection: "row" }}>
                    <Star color={color} size={size} />
                </View>
            );
        case 2:
            return (
                <View style={{ flexDirection: "row" }}>
                    <Star color={color} size={size} />
                    <Star color={color} size={size} />
                </View>
            );
        case 3:
            return (
                <View style={{ flexDirection: "row" }}>
                    <Star color={color} size={size} />
                    <Star color={color} size={size} style={{ transform: [{ translateY: -2 }] }} />
                    <Star color={color} size={size} />
                </View>
            );
    }
}
