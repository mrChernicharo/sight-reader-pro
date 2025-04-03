import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, Link } from "expo-router";
import { LinkProps } from "expo-router/build/link/Link";
import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AppText } from "./AppText";
import { AppView } from "./AppView";

// @ts-ignore
export interface BacklinkProps extends Partial<LinkProps<{}>> {
  to?: Href;
  style?: StyleProp<ViewStyle>;
  onPress?: (((event: GestureResponderEvent) => void) & (() => void)) | undefined;
}
export function BackLink(props: BacklinkProps) {
  const { to, style, onPress, ...rest } = props;
  const href = (to || "/") as Href;

  // useEffect(() => {
  //   console.log("Backlink ::: href", href, "to", to);
  // }, [href]);

  return (
    <AppView style={{ width: 28 }}>
      <TouchableOpacity style={style} onPress={onPress}>
        <Link replace {...rest} href={href}>
          <AppText>
            <Ionicons name="chevron-back" size={24} />
          </AppText>
        </Link>
      </TouchableOpacity>
    </AppView>
  );
}
