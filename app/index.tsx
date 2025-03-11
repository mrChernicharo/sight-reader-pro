import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppTextLogo } from "@/components/atoms/AppTextLogo";
import { AppView } from "@/components/atoms/AppView";
import { Colors } from "@/utils/Colors";
import { KeySignature } from "@/utils/enums";
import { getDrawNote } from "@/utils/noteFns";
import { Note } from "@/utils/types";
import { InterruptionModeIOS, InterruptionModeAndroid, Audio } from "expo-av";
import { Link, router } from "expo-router";
import { useEffect } from "react";
import { Button, StyleSheet, useColorScheme, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Home() {
  const theme = useColorScheme() ?? "light";
  // const { width, height } = useWindowDimensions();

  useEffect(() => {
    Audio.requestPermissionsAsync().then(({ granted }) => {
      if (granted) {
        Audio.setAudioModeAsync({
          // IOS
          allowsRecordingIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          // Android
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: true,
        });
      }
    });
  }, []);

  return (
    <AppView style={s.container}>
      {/* <Image src="assets/images/logo.svg" style={{ width, height: height / 4 }} /> */}

      {/* <Image source={require("@/assets/images/adaptive-icon.png")} style={s.titleImage} /> */}

      <AppTextLogo subtitles="Level up your music reading!" />

      <AppView style={{ alignItems: "center", rowGap: 12, width: 200 }}>
        {/* <TouchableOpacity>
          <Link href="/settings">
            <AppText>Settings</AppText>
          </Link>
        </TouchableOpacity> */}

        {/* <TouchableOpacity>
          <Link push href="/profile">
            <AppText>Profile</AppText>
          </Link>
        </TouchableOpacity> */}

        <Link href="/practice">
          <AppButton
            text=" Practice "
            style={[s.btn, { borderColor: Colors[theme].text }]}
            textStyle={{ color: Colors[theme].text }}
          />
        </Link>

        <Link href="/profile">
          <AppButton
            text="  Profile  "
            style={[s.btn, { borderColor: Colors[theme].text }]}
            textStyle={{ color: Colors[theme].text }}
          />
        </Link>

        <Link href="/settings">
          <AppButton
            text=" Settings "
            style={[s.btn, { borderColor: Colors[theme].text }]}
            textStyle={{ color: Colors[theme].text }}
          />
        </Link>
      </AppView>

      <Link href="/level-selection" asChild>
        <AppButton
          text="Play"
          style={{ width: 300, height: 56 }}
          textStyle={{ color: "white", fontSize: 24 }}
          activeOpacity={0.7}
        />
      </Link>
    </AppView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 100,
  },
  titleImage: {
    borderColor: "red",
    borderWidth: 2,
    borderStyle: "dashed",
    // width: "100%",
    // height: "100%",
  },
  btn: { backgroundColor: "rgba(0, 0, 0, 0)", borderWidth: 1 },
});
