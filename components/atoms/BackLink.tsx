import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, Link } from "expo-router";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { TouchableOpacity, TouchableOpacityProps } from "react-native-gesture-handler";
import { AppView } from "./AppView";
import { AppText } from "./AppText";
import { LinkComponent, LinkProps } from "expo-router/build/link/Link";
import { useEffect } from "react";

export interface BacklinkProps extends Partial<LinkProps<{}>> {
  to?: Href;
  style?: StyleProp<ViewStyle>;
}
export function BackLink(props: BacklinkProps) {
  const { to, style, ...rest } = props;
  const href = (to || "/") as Href;

  useEffect(() => {
    console.log("Backlink ::: href", href, "to", to);
  }, [href]);

  return (
    <AppView style={{ width: 28 }}>
      <TouchableOpacity style={style}>
        <Link {...rest} href={href}>
          <AppText>
            <Ionicons name="chevron-back" size={24} />
          </AppText>
        </Link>
      </TouchableOpacity>
    </AppView>
  );
}
