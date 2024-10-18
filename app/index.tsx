import AppButton from "@/components/atoms/AppButton";
import { AppLogo } from "@/components/atoms/AppLogo";
import { AppText } from "@/components/atoms/AppText";
import { AppTextLogo } from "@/components/atoms/AppTextLogo";
import { AppView } from "@/components/atoms/AppView";
import { Link, router } from "expo-router";
import { Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Platform } from "react-native";
import { useEffect } from "react";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { getGamePitchesInAllOctaves } from "@/constants/brain-storming";
import { Accident, ScaleType, KeySignature } from "@/constants/enums";

export default function Home() {
  const { width, height } = useWindowDimensions();

  // const DChromaticNotes = getGamePitchesInAllOctaves({
  //   keySignature: KeySignature.D,
  //   scaleType: ScaleType.Chromatic,
  // });
  // const DMajorNotes = getGamePitchesInAllOctaves({
  //   keySignature: KeySignature.D,
  //   scaleType: ScaleType.Diatonic,
  // });
  // const DMinorNotes = getGamePitchesInAllOctaves({
  //   keySignature: KeySignature.Dm,
  //   scaleType: ScaleType.Diatonic,
  // });

  // const NotesNone = getGamePitchesInAllOctaves({ accident: Accident.None });
  // const NotesSharp = getGamePitchesInAllOctaves({ accident: Accident["#"] });
  // const NotesFlat = getGamePitchesInAllOctaves({ accident: Accident.b });
  // const NotesFlatSharp = getGamePitchesInAllOctaves({ accident: Accident["#b"] });
  // const NotesDoubleFlat = getGamePitchesInAllOctaves({ accident: Accident.bb });
  // const NotesDoubleSharp = getGamePitchesInAllOctaves({ accident: Accident.x });
  // const NotesAll = getGamePitchesInAllOctaves({ accident: Accident.All });

  // console.table({
  //   NotesNone,
  //   NotesSharp,
  //   NotesFlat,
  //   NotesFlatSharp,
  //   NotesDoubleFlat,
  //   NotesDoubleSharp,
  //   NotesAll,
  //   DChromaticNotes,
  //   DMajorNotes,
  //   DMinorNotes,
  // });

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

        {/* <TouchableOpacity>
          <Link href="/practice-settings">Practice</Link>
        </TouchableOpacity> */}
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
