import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, Link, router } from "expo-router";
import { LinkProps } from "expo-router/build/link/Link";
import { GestureResponderEvent, StyleProp, View, ViewStyle, type TouchableOpacityProps } from "react-native";
import { TouchableOpacity } from "react-native";
import { AppView } from "./AppView";

// @ts-ignore
export interface BacklinkProps extends Partial<TouchableOpacityProps<{}>> {
    to?: Href;
    style?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
    // onPress?: (((event: GestureResponderEvent) => void) & (() => void)) | undefined;
}
export function BackLink(props: BacklinkProps) {
    const { to, style, wrapperStyle = {}, ...rest } = props;
    // const href = (to || "/") as Href;
    const theme = useTheme();

    return (
        <View style={{ position: "absolute", zIndex: 100, width: 28, ...(wrapperStyle as any) }}>
            {/* <Link {...rest} href={href} asChild push> */}
            <TouchableOpacity style={style} hitSlop={20} {...rest} onPress={router.back}>
                <Ionicons name="chevron-back" size={24} color={Colors[theme].text} />
            </TouchableOpacity>
            {/* </Link> */}
        </View>
    );
}
