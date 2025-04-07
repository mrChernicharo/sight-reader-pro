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

    useEffect(() => {
        console.log("Backlink ::: href", href, "to", to);
    }, [href]);

    return (
        <AppView style={{ width: 28 }}>
            <Link asChild replace {...rest} href={href}>
                <TouchableOpacity
                    style={style}
                    // onPress={() => {
                    //     console.log("pressed!");
                    //     if (onPress) {
                    //         onPress();
                    //     } else {
                    //         console.log("go home!");
                    //         router.navigate("/");
                    //     }
                    // }}
                    onPress={onPress}
                >
                    <AppText>
                        <Ionicons name="chevron-back" size={24} />
                    </AppText>
                </TouchableOpacity>
            </Link>
        </AppView>
    );
}
