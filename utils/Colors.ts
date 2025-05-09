/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
    light: {
        text: "#151718",
        textMute: "#565656",
        ripple: "#b7b7b7",
        bg: "#ECEDEE",
        bgSelected: "#dadada",
        // bg: "rgb(242, 242, 242)",
        tint: tintColorLight,
        icon: "#687076",
        tabIconDefault: "#687076",
        tabIconSelected: tintColorLight,
        primary: "#4598ee",
        accent: "#ee4598",
        red: "#ff0000",
        green: "#02ba5e",

        girlBG_0: "#050a19",
        girlBG_1: "#050a19",
        girlBG_2: "#04081a",
    },
    dark: {
        text: "#ECEDEE",
        textMute: "#787878",
        ripple: "#9a9a9a",
        bg: "#151718",
        bgSelected: "#353738",
        tint: tintColorDark,
        icon: "#9BA1A6",
        tabIconDefault: "#9BA1A6",
        tabIconSelected: tintColorDark,
        primary: "#4598ee",
        accent: "#ee4598",
        red: "#ff0000",
        green: "#01df76",

        girlBG_0: "#050a19",
        girlBG_1: "#050a19",
        girlBG_2: "#04081a",
    },
};
