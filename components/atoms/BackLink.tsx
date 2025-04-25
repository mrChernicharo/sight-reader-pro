import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/utils/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, Link } from "expo-router";
import { LinkProps } from "expo-router/build/link/Link";
import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AppView } from "./AppView";

// @ts-ignore
export interface BacklinkProps extends Partial<LinkProps<{}>> {
    to?: Href;
    style?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
    onPress?: (((event: GestureResponderEvent) => void) & (() => void)) | undefined;
}
export function BackLink(props: BacklinkProps) {
    const { to, style, wrapperStyle = {}, onPress, ...rest } = props;
    const href = (to || "/") as Href;
    const theme = useTheme();

    return (
        <AppView style={{ position: "absolute", zIndex: 100, width: 28, ...(wrapperStyle as any) }}>
            <Link {...rest} href={href} asChild replace>
                <TouchableOpacity style={style} hitSlop={20} onPress={onPress}>
                    <Ionicons name="chevron-back" size={24} color={Colors[theme].text} />
                </TouchableOpacity>
            </Link>
        </AppView>
    );
}
