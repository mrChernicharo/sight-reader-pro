import React, { useCallback, useEffect, useState } from "react";
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

const s = STYLES.practice;

const RangeSlider = ({
    low,
    high,
    min,
    max,
    step,
    handleValueChange,
}: {
    min: number;
    max: number;
    low: number;
    high: number;
    step: number;
    handleValueChange: (newLow: number, newHigh: number) => void;
}) => {
    const { t } = useTranslation();

    const [textWidth, setTextWidth] = useState(60);

    const renderThumb = useCallback((name: "high" | "low") => <Thumb />, []);
    const renderRail = useCallback(() => <Rail />, []);
    const renderRailSelected = useCallback(() => <RailSelected />, []);
    const renderLabel = useCallback((value: number) => <Label text={value} />, []);
    const renderNotch = useCallback(() => <Notch />, []);

    useEffect(() => {
        console.log({ textWidth });
    }, [textWidth]);

    return (
        <AppView style={s.menuItem}>
            <AppText
                onLayout={(ev) => {
                    const margin = 76;
                    console.log("layout :::", ev.nativeEvent.layout);
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
                    // onLayout={(ev) => {
                    //     console.log("layout :::", ev.nativeEvent.layout);
                    // }}
                    style={{ width: Dimensions.get("window").width - textWidth, marginLeft: 10 }}
                    // style={{ width: "90%" }}
                    min={min}
                    max={max}
                    step={step}
                    floatingLabel
                    renderThumb={renderThumb}
                    renderRail={renderRail}
                    renderRailSelected={renderRailSelected}
                    // renderLabel={renderLabel}
                    // renderNotch={renderNotch}
                    onValueChanged={handleValueChange}
                />
            </AppView>
        </AppView>
    );
};

export default RangeSlider;
