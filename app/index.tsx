import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppTextLogo } from "@/components/atoms/AppTextLogo";
import { AppView } from "@/components/atoms/AppView";
import { FadeIn } from "@/components/atoms/FadeIn";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { KeySignature } from "@/utils/enums";
import { getDrawNote } from "@/utils/noteFns";
import { Note } from "@/utils/types";
import { InterruptionModeIOS, InterruptionModeAndroid, Audio } from "expo-av";
import { Link, router } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { Button, Dimensions, StyleSheet, useColorScheme, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const theme = useColorScheme() ?? "light";
  const { t } = useTranslation();
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
      <FadeIn y={50} x={0} delay={0}>
        <AppTextLogo subtitles={t("app.slogan")} />
      </FadeIn>

      <FadeIn y={50} x={0} delay={250}>
        <AppView style={{ alignItems: "center", rowGap: 12, width: 200 }}>
          <Link style={s.link} href="/practice">
            <AppButton
              text={t("routes.practice")}
              style={[s.btn, { borderColor: Colors[theme].text }]}
              textStyle={{ color: Colors[theme].text }}
            />
          </Link>

          <Link style={s.link} href="/profile">
            <AppButton
              text={t("routes.profile")}
              style={[s.btn, { borderColor: Colors[theme].text }]}
              textStyle={{ color: Colors[theme].text }}
            />
          </Link>

          <Link style={s.link} href="/settings">
            <AppButton
              text={t("routes.settings")}
              style={[s.btn, { borderColor: Colors[theme].text }]}
              textStyle={{ color: Colors[theme].text }}
            />
          </Link>
        </AppView>
      </FadeIn>

      <FadeIn y={50} x={0} delay={500}>
        <Link href="/level-selection" asChild>
          <AppButton
            text={t("routes.main.cta")}
            style={{ width: 300, height: 56 }}
            textStyle={{ color: "white", fontSize: 24 }}
            activeOpacity={0.7}
          />
        </Link>
      </FadeIn>
    </AppView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 104,
    paddingBottom: 52,
  },
  titleImage: {
    borderColor: "red",
    borderWidth: 2,
    borderStyle: "dashed",
    // width: "100%",
    // height: "100%",
  },
  link: { width: 200 },
  btn: { backgroundColor: "rgba(0, 0, 0, 0)", borderWidth: 1, width: 200 },
});
