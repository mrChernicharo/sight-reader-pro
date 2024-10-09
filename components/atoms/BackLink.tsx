import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, Link } from "expo-router";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AppView } from "./AppView";

export function BackLink({ to, style }: { to?: string; style?: StyleProp<ViewStyle> }) {
  const href = (to || "/") as Href;
  return (
    <AppView style={{ width: 28 }}>
      <TouchableOpacity style={style}>
        <Link href={href}>
          <Ionicons name="chevron-back" size={24} />
        </Link>
      </TouchableOpacity>
    </AppView>
  );
}
