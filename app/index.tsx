import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { Link, router } from "expo-router";
import { Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Home() {
  const { width, height } = useWindowDimensions();
  return (
    <View style={s.container}>
      {/* <Image src="assets/images/logo.svg" style={{ width, height: height / 4 }} /> */}
      <AppText type="title">Sight Reader Pro</AppText>

      <TouchableOpacity>
        <Link href="/settings">Settings</Link>
      </TouchableOpacity>

      <TouchableOpacity>
        <Link href="/practice-settings">Practice</Link>
      </TouchableOpacity>

      <Link href="/level-selection" asChild>
        <AppButton text="Play" style={{ width: 300 }} textStyle={{ color: "white" }} />
      </Link>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
