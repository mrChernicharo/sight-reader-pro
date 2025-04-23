import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import RangeSliderRN from "rn-range-slider";

import Label from "./Label";
import Notch from "./Notch";
import Rail from "./Rail";
import RailSelected from "./RailSelected";
import Thumb from "./Thumb";

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
    // const [low, setLow] = useState(from);
    // const [high, setHigh] = useState(to);

    const renderThumb = useCallback((name: "high" | "low") => <Thumb />, []);
    const renderRail = useCallback(() => <Rail />, []);
    const renderRailSelected = useCallback(() => <RailSelected />, []);
    const renderLabel = useCallback((value: number) => <Label text={value} />, []);
    const renderNotch = useCallback(() => <Notch />, []);

    return (
        <>
            <RangeSliderRN
                high={high}
                low={low}
                minRange={4}
                // onLayout={(ev) => {
                //   console.log("layout :::", ev.nativeEvent.layout);
                // }}
                style={{ width: "100%" }}
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
        </>
    );
};

export default RangeSlider;

const s = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },
});
