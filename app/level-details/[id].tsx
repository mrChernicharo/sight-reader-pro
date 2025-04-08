import AppButton from "@/components/atoms/AppButton";
import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";

import { SheetMusic } from "@/components/molecules/SheetMusic";
import { Colors } from "@/utils/Colors";
import { LevelAccidentType, Clef, GameType, WinRank, KeySignature } from "@/utils/enums";
import { isNoteHigher, pickKeySignature } from "@/utils/helperFns";
import { getLevel } from "@/utils/levels";
import { Level, Note } from "@/utils/types";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FadeIn } from "@/components/atoms/FadeIn";
import { useTranslation } from "@/hooks/useTranslation";
import { ScrollView } from "react-native-gesture-handler";

export default function LevelDetails() {
    const backgroundColor = useThemeColor({ light: Colors.light.bg, dark: Colors.dark.bg }, "bg");
    const muteColor = useThemeColor({ light: Colors.light.textMute, dark: Colors.dark.textMute }, "textMute");
    const { id } = useLocalSearchParams() as { id: string };
    const { t } = useTranslation();
    const level = getLevel(id);

    if (!level) return null;

    // console.log(":::LevelDetails", level);

    // if (level.gameType !== GameType.Single) return;

    const displayInfo = {
        rangeTitleOffset: getRangeTitleOffset(level),
        accidentText: level.hasKey ? level.keySignatures.join(" | ") : getAccidentText(level.accident),
        rangeKeys: (level as Level<GameType.Single>).noteRanges.map((range) => range.split(":::") as [Note, Note]),
    };

    function handleNewGame() {
        switch (level.gameType) {
            case GameType.Single:
            case GameType.Melody: {
                const chosenKeySignature = pickKeySignature(level);
                // console.log({ level, displayInfo, chosenKeySignature });
                router.push({
                    pathname: "/game-level/[id]",
                    params: { id: String(id), keySignature: chosenKeySignature, previousPage: "/level-details" },
                });
            }
        }
    }

    return (
        <SafeAreaView style={{ minHeight: Dimensions.get("window").height, backgroundColor }}>
            <ScrollView contentContainerStyle={s.container}>
                <AppView style={s.infoContainer}>
                    <FadeIn y={50} x={0}>
                        <AppView>
                            <AppView style={s.backlinkContainer}>
                                <BackLink to="/level-selection/(tabs)" style={s.backlink} />
                            </AppView>
                            <AppText type="title" style={s.title}>
                                {level.name}
                            </AppText>
                        </AppView>
                        <AppText type="subtitle" style={s.subtitle}>
                            {level.id}
                        </AppText>
                    </FadeIn>

                    <FadeIn y={50} x={0} delay={200}>
                        <AppView style={s.midContainer}>
                            <AppText>{t(`game.type.${level.gameType}`)}</AppText>
                            <AppText>{t(`game.config.${displayInfo.accidentText}`)}</AppText>
                            <AppText>
                                <Ionicons name="time-outline" /> {level.durationInSeconds} {t("time.seconds")}
                            </AppText>
                            <AppText>
                                <Ionicons name="flag-outline" /> {level.winConditions[WinRank.Bronze]}/min
                            </AppText>
                        </AppView>
                    </FadeIn>

                    <FadeIn y={0} x={200} delay={800}>
                        <AppView style={{ borderBottomWidth: 1, borderColor: muteColor }} />
                    </FadeIn>
                </AppView>

                <FadeIn y={50} x={0} delay={400}>
                    <AppView style={s.musicSheetContainer}>
                        <AppText type="subtitle" style={[s.rangeTitle, { marginBottom: displayInfo.rangeTitleOffset }]}>
                            {t("music.noteRange")}
                        </AppText>

                        <AppView style={s.musicSheetInnerContainer}>
                            <SheetMusic.RangeDisplay
                                clef={level.clef}
                                keys={displayInfo.rangeKeys}
                                keySignature={level.hasKey ? level.keySignatures[0] : KeySignature["C"]}
                            />
                        </AppView>
                    </AppView>
                </FadeIn>

                <FadeIn y={50} x={0} delay={600} style={{ width: "100%" }}>
                    {/* <AppButton text="Start Level" textStyle={s.ctaText} containerStyle={s.cta} onPress={handleNewGame} /> */}
                    <AppView style={s.ctaContainer}>
                        <AppButton
                            text={t("game.state.start")}
                            style={s.cta}
                            textStyle={{ color: "white", fontSize: 24 }}
                            activeOpacity={0.7}
                            onPress={handleNewGame}
                        />
                    </AppView>
                </FadeIn>
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        position: "relative",
        // borderWidth: 1,
        // borderColor: "red",
        alignItems: "center",
        paddingHorizontal: 36,
        paddingVertical: 24,
    },
    infoContainer: {
        width: "100%",
        // borderWidth: 1,
        // borderColor: "green",
    },
    backlinkContainer: {
        position: "absolute",
        top: 5,
        zIndex: 1000,
    },
    backlink: {
        // borderWidth: 1,
        // borderColor: "green",
    },
    title: {
        // width: "100%",
        textAlign: "center",
        pointerEvents: "none",
        // borderWidth: 1,
        // borderColor: "blue",
    },
    subtitle: {
        color: "gray",
        textAlign: "center",
        // borderWidth: 1,
        // borderColor: "red",
    },
    midContainer: {
        alignItems: "center",
        paddingBottom: 16,
        // borderWidth: 1,
        // borderColor: "orange",
    },
    rangeTitle: {
        textAlign: "center",
        // zIndex: 100,
        // borderWidth: 1,
        // borderColor: "red",
    },
    musicSheetContainer: {
        // borderWidth: 1,
        // borderColor: "purple",
        paddingTop: 8,
    },
    musicSheetInnerContainer: {
        transform: [{ translateY: 100 }],
        // borderWidth: 1,
        // borderColor: "red",
    },
    ctaContainer: {
        width: "100%",
        transform: [{ translateY: -50 }],
        // borderWidth: 1,
        // borderColor: "red",
    },
    cta: {
        width: "100%",
        height: 56,
    },
    ctaText: {
        color: "white",
    },
});

function getRangeTitleOffset(level: Level<GameType>) {
    if (!(level as Level<GameType.Single>).noteRanges) {
        throw Error("getRangeTitleOffset [ERROR] :: level.noteRanges is wonky");
    }

    const defaultOffset = -100;
    if (level.gameType === GameType.Rhythm) return defaultOffset;

    let highNote: Note = "a/1";
    (level as Level<GameType.Single>).noteRanges.forEach((range) => {
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
