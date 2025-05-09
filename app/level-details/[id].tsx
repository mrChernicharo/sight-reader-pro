import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { FadeIn } from "@/components/atoms/FadeIn";
import { GameStars } from "@/components/atoms/GameStars";
import { SheetMusic } from "@/components/molecules/SheetMusic";
import { useAllLevels } from "@/hooks/useAllLevels";
import { useAppStore } from "@/hooks/useAppStore";
import { useIntl } from "@/hooks/useIntl";
import { useTheme } from "@/hooks/useTheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { glyphs } from "@/utils/constants";
import { Clef, GameType, KeySignature, WinRank } from "@/utils/enums";
import { getLevelName, isNoteHigher, toCamelCase } from "@/utils/helperFns";
import { testBorder } from "@/utils/styles";
import { Level, Note } from "@/utils/types";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LevelDetails() {
    const { getLevel } = useAllLevels();
    // const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");
    const muteColor = useThemeColor({ light: Colors.light.textMute, dark: Colors.dark.textMute }, "textMute");
    const { id } = useLocalSearchParams() as { id: string };
    const { t } = useTranslation();
    const { intl } = useIntl();
    const level = getLevel(id);
    const { currentGame, endGame } = useAppStore();
    const theme = useTheme();

    const rangeKeys = (level as Level).noteRanges.map((range) => range.split(":::") as [Note, Note]);
    const { levelName, levelIdx } = getLevelName(level);

    const handleNewGame = useCallback(() => {
        if (currentGame) endGame();
        switch (level.type) {
            case GameType.Single:
            case GameType.Melody: {
                // console.log({ level, displayInfo });
                router.replace({
                    pathname: "/game-level/[id]",
                    params: { id: String(id), keySignature: level.keySignature, previousPage: "/level-details" },
                });
            }
        }
    }, [currentGame, level]);

    if (!level) return null;

    const percAccuracy = intl.format(level.winConditions.minAccuracy * 100);

    return (
        <SafeAreaView style={{ minHeight: "100%", backgroundColor: Colors[theme].bg }}>
            <ScrollView contentContainerStyle={s.container}>
                {/* TOP */}
                <FadeIn y={50} x={0}>
                    <AppView style={s.top}>
                        <BackLink wrapperStyle={{ left: 24, top: 5.5, position: "absolute" }} />
                        <AppText style={s.title}>
                            {t(`levelName.${toCamelCase(levelName)}`)} {levelIdx}
                        </AppText>
                    </AppView>
                </FadeIn>

                {/* MID */}
                <FadeIn y={50} x={0} delay={200}>
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

                {/* Separator */}
                <FadeIn y={0} x={-100} delay={300}>
                    <AppView style={{ ...s.separator, borderColor: muteColor }} />
                </FadeIn>

                <FadeIn y={50} x={0} delay={400}>
                    <AppText style={{ textAlign: "center" }}>{t(`game.type.${level.type}`)}</AppText>

                    <AppView style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <AppView transparentBG>
                            <Ionicons name="time-outline" size={16} color={Colors.dark.text} />
                        </AppView>

                        <AppText>{`${t("levelDetails.duration")} ${level.durationInSeconds} ${t(
                            "time.seconds"
                        )}`}</AppText>
                    </AppView>
                </FadeIn>

                {/* Separator */}
                <FadeIn y={0} x={100} delay={500}>
                    <AppView style={{ ...s.separator, borderColor: muteColor }} />
                </FadeIn>

                <FadeIn y={0} x={100} delay={600}>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <View style={{ flexDirection: "row", gap: 4 }}>
                            <GameStars stars={1} color="gold" />
                            <AppText>
                                {level.winConditions[WinRank.Bronze]} {t("game.NpM")}
                            </AppText>
                        </View>

                        <View style={{ flexDirection: "row", gap: 4 }}>
                            <GameStars stars={2} color="gold" />
                            <AppText>
                                {level.winConditions[WinRank.Silver]} {t("game.NpM")}
                            </AppText>
                        </View>

                        <View style={{ flexDirection: "row", gap: 4 }}>
                            <GameStars stars={3} color="gold" />
                            <AppText>
                                {level.winConditions[WinRank.Gold]} {t("game.NpM")}
                            </AppText>
                        </View>

                        <AppView style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 12 }}>
                            <AppView transparentBG>
                                <Ionicons name="flag-outline" size={16} color={Colors.dark.text} />
                            </AppView>

                            <AppText>{`${t("levelDetails.minAccuracy")} ${percAccuracy}%`}</AppText>
                        </AppView>
                    </View>
                </FadeIn>

                <FadeIn y={0} x={-100} delay={800}>
                    <AppView style={s.musicSheetContainer}>
                        <SheetMusic.RangeDisplay
                            clef={level.clef}
                            keys={rangeKeys}
                            keySignature={level.keySignature || KeySignature["C"]}
                        />
                    </AppView>
                </FadeIn>

                <AppView style={s.ctaContainer}>
                    <FadeIn y={50} x={0} delay={1000}>
                        <AppButton
                            text={t("game.state.start")}
                            style={s.cta}
                            textStyle={{ color: "white", fontSize: 24 }}
                            activeOpacity={0.7}
                            onPress={handleNewGame}
                        />
                    </FadeIn>
                </AppView>
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        paddingTop: 24,
        position: "relative",
        alignItems: "center",
        minHeight: Dimensions.get("window").height - (Platform.OS === "ios" ? 100 : -20),
        // ...testBorder(),
        // ...testBorder(),
    },
    top: {
        width: Dimensions.get("window").width,
        position: "relative",
        alignItems: "center",
        // ...testBorder(),
    },
    title: {
        fontFamily: "Grotesque",
        fontSize: 22,
        lineHeight: 36,
        textAlign: "center",
        pointerEvents: "none",
    },
    topInfo: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        marginTop: 32,
    },
    midContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    separator: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: Dimensions.get("window").width - 96,
        height: 20,
        marginBottom: 20,
    },
    rangeTitle: {
        textAlign: "center",
    },
    musicSheetContainer: {
        height: 200,
        // ...testBorder(),
    },
    ctaContainer: {
        position: "absolute",
        bottom: 0,
        height: 100,
        paddingHorizontal: 48,
        width: Dimensions.get("window").width,
        // ...testBorder("green"),
    },
    cta: {
        height: 56,
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

// function getAccidentText(levelAccident: LevelAccidentType) {
//     switch (levelAccident) {
//         case LevelAccidentType.None:
//             return "no accidents";
//         case LevelAccidentType["#"]:
//             return "♯ sharp accidents";
//         case LevelAccidentType.b:
//             return "♭ flat accidents";
//         default:
//             return "@TODO";
//     }
// }
