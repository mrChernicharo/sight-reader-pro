import { Dimensions, Platform, StyleSheet, ViewStyle } from "react-native";
import { MenuOption } from "react-native-popup-menu";

export const testBorder = (borderColor = "red"): ViewStyle => ({
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor,
});

export const STYLES = {
    game: StyleSheet.create({
        outerContainer: {
            flex: 1,
            justifyContent: "space-between",
            position: "relative",
            paddingTop: 8,
            // ...testBorder("purple"),
        },
        container: {
            flex: 1,
            justifyContent: "space-between",
            position: "relative",
            paddingTop: 8,
            // ...testBorder("blue"),
        },
        top: {
            position: "relative",
            height: 130,
            paddingHorizontal: 24,
            // ...testBorder("orange"),
        },
        backLink: {
            position: "absolute",
            zIndex: 20,
        },

        mainContainer: {
            position: "relative",
            bottom: 0,
            // ...testBorder("orange"),
        },

        attemptedNotes: {
            position: "relative",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: 36,
            // ...testBorder("forestgreen"),
        },
        tooltipBtn: { marginVertical: 8, minWidth: "40%" },
    }),
    init: StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 36,
            paddingVertical: 24,
            height: "100%",
            position: "relative",
            // borderWidth: 2,
            // borderColor: "red",
        },
        top: {
            width: "100%",
            top: Platform.OS === "ios" ? 64 : 48,
            position: "absolute",
            alignItems: "center",
            // borderWidth: 2,
            // borderColor: "red",
        },
        input: {
            borderWidth: 1,
            borderColor: "#999",
            width: "100%",
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 16,
            height: 46,
        },
        btnContainer: {
            position: "absolute",
            width: "100%",
            bottom: 50,
            // borderWidth: 2,
            // borderColor: "red",
        },
        btn: { width: "100%", height: 48 },
        backLink: {
            position: "absolute",
            left: Platform.OS == "ios" ? -20 : 0,
            top: 22,
        },
    }),

    practice: StyleSheet.create({
        menuItem: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            minHeight: 64,
        },
        menuTrigger: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
        },
        menuOption: {
            paddingVertical: 12,
            paddingHorizontal: 16,
        },
        icon: {
            transform: [{ translateY: 1 }],
        },
        separator: {
            borderBottomWidth: StyleSheet.hairlineWidth,
            width: Dimensions.get("window").width,
            height: 20,
            marginVertical: 10,
        },
    }),
};
