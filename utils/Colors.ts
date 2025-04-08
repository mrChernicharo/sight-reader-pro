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
        background: "#ECEDEE",
        // background: "rgb(242, 242, 242)",
        tint: tintColorLight,
        icon: "#687076",
        tabIconDefault: "#687076",
        tabIconSelected: tintColorLight,
        primary: "#4598ee",
        accent: "#ee4598",
        red: "#ff0000",
        green: "#01df76",
    },
    dark: {
        text: "#ECEDEE",
        textMute: "#787878",
        background: "#151718",
        tint: tintColorDark,
        icon: "#9BA1A6",
        tabIconDefault: "#9BA1A6",
        tabIconSelected: tintColorDark,
        primary: "#4598ee",
        accent: "#ee4598",
        red: "#ff0000",
        green: "#01df76",
    },
};
