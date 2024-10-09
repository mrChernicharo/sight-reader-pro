import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, Link } from "expo-router";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export function BackLink({ to, style }: { to?: string; style?: StyleProp<ViewStyle> }) {
  const href = (to || "/") as Href;
  return (
    <TouchableOpacity style={style}>
      <Link href={href}>
        <Ionicons name="arrow-back" size={24} />
      </Link>
    </TouchableOpacity>
  );
}
