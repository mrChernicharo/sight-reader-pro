import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";

import { SheetMusic } from "@/components/molecules/SheetMusic";
import { Colors } from "@/utils/Colors";
import { LevelAccidentType, Clef, GameType, WinRank, KeySignature } from "@/utils/enums";
import { isNoteHigher } from "@/utils/helperFns";
import { Level, Note } from "@/utils/types";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Dimensions, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FadeIn } from "@/components/atoms/FadeIn";
import { useTranslation } from "@/hooks/useTranslation";
import { ScrollView } from "react-native-gesture-handler";
import { useAppStore } from "@/hooks/useAppStore";
import { useEffect } from "react";
import { glyphs } from "@/utils/constants";
import { testBorder } from "@/utils/styles";
import { useAllLevels } from "@/hooks/useAllLevels";
import { useTheme } from "@/hooks/useTheme";

export default function LevelDetails() {
    const { getLevel } = useAllLevels();
    // const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");
    const muteColor = useThemeColor({ light: Colors.light.textMute, dark: Colors.dark.textMute }, "textMute");
    const { id } = useLocalSearchParams() as { id: string };
    const { t } = useTranslation();
    const level = getLevel(id);
    const { currentGame, endGame } = useAppStore();
    const theme = useTheme();

    // console.log(":::LevelDetails", level);
    // if (level.gameType !== GameType.Single) return;

    const displayInfo = {
        rangeTitleOffset: getRangeTitleOffset(level),
        accidentText: level.keySignature,
        rangeKeys: (level as Level).noteRanges.map((range) => range.split(":::") as [Note, Note]),
    };

    function handleNewGame() {
        if (currentGame) endGame();
        switch (level.type) {
            case GameType.Single:
            case GameType.Melody: {
                // console.log({ level, displayInfo });
                router.push({
                    pathname: "/game-level/[id]",
                    params: { id: String(id), keySignature: level.keySignature, previousPage: "/level-details" },
                });
            }
        }
    }

    if (!level) return null;

    return (
        <SafeAreaView style={{ minHeight: "100%", backgroundColor: Colors[theme].bg }}>
            <ScrollView contentContainerStyle={s.container}>
                <FadeIn y={50} x={0}>
                    <AppView style={s.top}>
                        <BackLink to="/level-selection" wrapperStyle={{ left: 24, top: 6, position: "absolute" }} />
                        <AppText type="title" style={s.title}>
                            {level.name}
                        </AppText>
                        {/* <AppText type="subtitle" style={s.subtitle}>
                        {level.id}
                    </AppText> */}
                    </AppView>
                    <AppView style={s.topInfo}>
                        <AppText
                            style={{ color: muteColor, lineHeight: 46, fontSize: level.clef == Clef.Bass ? 28 : 24 }}
                        >
                            {glyphs[`${level.clef}Clef`]}
                        </AppText>
                        <AppText
                            style={{
                                color: muteColor,
                                fontWeight: 700,
                                fontSize: 18,
                                marginBottom: level.clef == Clef.Bass ? 10 : 2,
                            }}
                        >
                            {t(`music.keys.${level.keySignature}`)}
                        </AppText>
                    </AppView>
                </FadeIn>

                <FadeIn y={50} x={0} delay={200} style={s.midContainer}>
                    <AppText>{t(`game.type.${level.type}`)}</AppText>
                    {/* <AppText>{t(`game.config.${displayInfo.accidentText}`)}</AppText> */}
                    <AppText>
                        <Ionicons name="time-outline" /> {level.durationInSeconds} {t("time.seconds")}
                    </AppText>
                    <AppText>
                        <Ionicons name="flag-outline" /> {level.winConditions[WinRank.Bronze]}/min
                    </AppText>
                </FadeIn>

                {/* Separator */}
                <FadeIn y={50} x={0} delay={300}>
                    <AppView style={{ borderBottomWidth: 1, borderColor: muteColor }} />
                </FadeIn>

                <FadeIn y={50} x={0} delay={400} style={s.musicSheetContainer}>
                    <SheetMusic.RangeDisplay
                        clef={level.clef}
                        keys={displayInfo.rangeKeys}
                        keySignature={level.keySignature || KeySignature["C"]}
                    />
                </FadeIn>

                <FadeIn y={50} x={0} delay={600} style={s.ctaContainer}>
                    <AppButton
                        text={t("game.state.start")}
                        style={s.cta}
                        textStyle={{ color: "white", fontSize: 24 }}
                        activeOpacity={0.7}
                        onPress={handleNewGame}
                    />
                </FadeIn>
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingHorizontal: 36,
        // minHeight: "100%",
    },
    top: {
        width: Dimensions.get("window").width,
        position: "relative",
        alignItems: "center",
        // ...testBorder(),
    },
    title: {
        textAlign: "center",
        pointerEvents: "none",
        // borderWidth: 1,
        // borderColor: "blue",
    },
    subtitle: {
        color: "gray",
        textAlign: "center",
        width: "100%",
        // borderWidth: 1,
        // borderColor: "red",
    },
    topInfo: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        marginTop: 32,
        // ...testBorder(),
    },
    midContainer: {
        alignItems: "center",
        paddingVertical: 24,
        // borderWidth: 1,
        // borderColor: "orange",
    },
    rangeTitle: {
        textAlign: "center",
        // borderWidth: 1,
        // borderColor: "red",
    },
    musicSheetContainer: {
        height: 180,
        // borderWidth: 1,
        // borderColor: "green",
    },
    ctaContainer: {
        position: "relative",
        width: Dimensions.get("window").width,
        // borderWidth: 1,
        // borderColor: "orange",
    },
    cta: {
        height: 56,
        bottom: 56,
        width: 300,
    },
    ctaText: {
        color: "white",
    },
});

function getRangeTitleOffset(level: Level) {
    if (!(level as Level).noteRanges) {
        throw Error("getRangeTitleOffset [ERROR] :: level.noteRanges is wonky");
    }

    const defaultOffset = -100;
    if (level.type === GameType.Rhythm) return defaultOffset;

    let highNote: Note = "a/1";
    (level as Level).noteRanges.forEach((range) => {
        const [, high] = range.split(":::") as [Note, Note];
        if (isNoteHigher(high, highNote)) {
            highNote = high;
        }
    });

    const [note, octave] = highNote.split("/");
    // console.log(highNote, note, octave, clef, defaultOffset);
    switch (level.clef) {
        case Clef.Bass:
            if (+octave > 3 || (+octave == 3 && note >= "g")) return defaultOffset + 50;
            return defaultOffset;
        case Clef.Treble:
            if (+octave > 6 || (+octave == 6 && note >= "a")) return defaultOffset + 50;
            return defaultOffset;
        default:
            return defaultOffset;
    }
}

function getAccidentText(levelAccident: LevelAccidentType) {
    switch (levelAccident) {
        case LevelAccidentType.None:
            return "no accidents";
        case LevelAccidentType["#"]:
            return "♯ sharp accidents";
        case LevelAccidentType.b:
            return "♭ flat accidents";
        default:
            return "@TODO";
    }
}
