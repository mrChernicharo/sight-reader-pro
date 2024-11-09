import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppTextLogo } from "@/components/atoms/AppTextLogo";
import { AppView } from "@/components/atoms/AppView";
import { KeySignature } from "@/constants/enums";
import { explodeNote, getDrawNote } from "@/constants/noteFns";
import { Note } from "@/constants/types";
import { InterruptionModeIOS, InterruptionModeAndroid, Audio } from "expo-av";
import { Link, router } from "expo-router";
import { useEffect } from "react";
import { Button, StyleSheet, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Home() {
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

      <AppView>
        <TouchableOpacity>
          <Link href="/settings">
            <AppText>Settings</AppText>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity>
          <Link push href="/profile">
            <AppText>Profile</AppText>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity>
          <Link href="/practice-settings">
            <AppText>Practice</AppText>
          </Link>
        </TouchableOpacity>
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
});
