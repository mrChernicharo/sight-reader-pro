import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, Link, router } from "expo-router";
import { LinkProps } from "expo-router/build/link/Link";
import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AppText } from "./AppText";
import { AppView } from "./AppView";
import { useEffect } from "react";

// @ts-ignore
export interface BacklinkProps extends Partial<LinkProps<{}>> {
    to?: Href;
    style?: StyleProp<ViewStyle>;
    onPress?: (((event: GestureResponderEvent) => void) & (() => void)) | undefined;
}
export function BackLink(props: BacklinkProps) {
    const { to, style, onPress, ...rest } = props;
    const href = (to || "/") as Href;

    return (
        <AppView style={{ width: 28 }}>
            <Link {...rest} href={href} asChild replace>
                <TouchableOpacity style={style} onPress={onPress}>
                    <Ionicons name="chevron-back" size={24} />
                </TouchableOpacity>
            </Link>
        </AppView>
    );
}
