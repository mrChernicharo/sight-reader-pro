import { Dimensions } from "react-native";

export enum DeviceYSize {
    sm = "sm",
    md = "md",
    lg = "lg",
    xl = "xl",
}

export const getDeviceYSize = () => {
    const dh = Dimensions.get("screen").height;
    if (dh <= 640) return DeviceYSize.sm;
    if (dh <= 750) return DeviceYSize.md;
    if (dh <= 900) return DeviceYSize.lg;
    return DeviceYSize.xl;
};
const DEVICE_SIZE_Y = getDeviceYSize();

const pianoHeights = {
    [DeviceYSize.sm]: { white: 140, black: 98 },
    [DeviceYSize.md]: { white: 160, black: 110 },
    [DeviceYSize.lg]: { white: 170, black: 100 },
    [DeviceYSize.xl]: { white: 180, black: 125 },
};
export const getPianoKeyHeight = () => {
    console.log("getPianoKeyHeight ::::", { DEVICE_SIZE_Y });
    return pianoHeights[DEVICE_SIZE_Y];
};

const scoreHeights = {
    [DeviceYSize.sm]: { stageHeight: 260, staveYPos: 80 },
    [DeviceYSize.md]: { stageHeight: 300, staveYPos: 110 },
    [DeviceYSize.lg]: { stageHeight: 320, staveYPos: 120 },
    [DeviceYSize.xl]: { stageHeight: 380, staveYPos: 140 },
};
export const getScoreHeight = () => {
    return scoreHeights[DEVICE_SIZE_Y];
};
