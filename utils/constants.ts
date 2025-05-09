import { TRANSLATIONS } from "@/translations";
import { Accident } from "./enums";
import { Platform, StatusBar } from "react-native";

export const GAME_WIN_MIN_ACCURACY = 0.6;

// export const glyphs = ["♯", "♭", "♮", "𝄪", "𝄫", "𝄀", "𝄁", "𝄆", "𝄇", "𝄞", "𝄢", "𝄡", "𝄐"];
export const glyphs = {
    sharp: "\u{266F}",
    flat: "\u{266D}",
    natural: "\u{266E}",
    quarter: "\u{2663}",
    two8Notes: "\u{266B}",
    two16Notes: "\u{266C}",
    trebleClef: "𝄞",
    bassClef: "𝄢",
};

export const drawAccidents: Record<Accident, string> = {
    [Accident["#"]]: "#",
    [Accident["b"]]: "b",
    [Accident["[]"]]: "n",
    [Accident["x"]]: "##",
    [Accident["bb"]]: "bb",
};

export const SUPPORTED_LANGUAGES = Object.keys(TRANSLATIONS);
export const LANGS = SUPPORTED_LANGUAGES.map((lang) => ({ key: lang, value: (TRANSLATIONS as any)[lang].lang }));

export const WALKTHROUGH_TOP_ADJUSTMENT = Platform.OS === "android" ? -StatusBar.currentHeight! : 0;
