import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import RangeSliderRN from "rn-range-slider";

import Label from "./Label";
import Notch from "./Notch";
import Rail from "./Rail";
import RailSelected from "./RailSelected";
import Thumb from "./Thumb";
import { AppView } from "../AppView";
import { STYLES } from "@/utils/styles";
import { AppText } from "../AppText";
import { useTranslation } from "@/hooks/useTranslation";
import { Note } from "@/utils/types";
import { useAppStore } from "@/hooks/useAppStore";
import { Clef } from "@/utils/enums";
import { isFlatKeySignature, explodeNote } from "@/utils/helperFns";
import { NOTES_FLAT_ALL_OCTAVES, NOTES_SHARP_ALL_OCTAVES } from "@/utils/notes";

const s = STYLES.practice;

const RangeSlider = ({
    low,
    high,
    min,
    max,
    step,
    allNotes,
    handleValueChange,
}: {
    min: number;
    max: number;
    low: number;
    high: number;
    step: number;
    allNotes: Note[];
    handleValueChange: (newLow: number, newHigh: number) => void;
}) => {
    const { t } = useTranslation();
    // const { practiceSettings } = useAppStore();
    // const { clef, keySignature } = practiceSettings;

    const [textWidth, setTextWidth] = useState(60);

    const renderThumb = useCallback((name: "high" | "low") => <Thumb />, []);
    const renderRail = useCallback(() => <Rail />, []);
    const renderRailSelected = useCallback(() => <RailSelected />, []);
    const renderLabel = useCallback((value: number) => <Label text={allNotes[value]} />, [allNotes]);
    const renderNotch = useCallback(() => <Notch />, []);

    // useEffect(() => {
    //     console.log({ textWidth, allNotes });
    // }, [textWidth, allNotes]);

    return (
        <AppView style={s.menuItem}>
            <AppText
                onLayout={(ev) => {
                    const margin = 76;
                    // console.log("layout :::", ev.nativeEvent.layout);
                    setTextWidth(ev.nativeEvent.layout.width + margin);
                }}
            >
                {t("music.noteRange")}
            </AppText>

            <AppView style={s.menuTrigger}>
                <RangeSliderRN
                    high={high}
                    low={low}
                    minRange={4}
                    style={{ width: Dimensions.get("window").width - textWidth, marginLeft: 10 }}
                    min={min}
                    max={max}
                    step={step}
                    floatingLabel
                    renderThumb={renderThumb}
                    renderRail={renderRail}
                    renderRailSelected={renderRailSelected}
                    renderLabel={renderLabel}
                    renderNotch={renderNotch}
                    onValueChanged={handleValueChange}
                />
            </AppView>
        </AppView>
    );
};

export default RangeSlider;
