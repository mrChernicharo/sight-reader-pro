import { Dimensions, StyleSheet, ViewStyle } from "react-native";
import { MenuOption } from "react-native-popup-menu";

export const STYLES = {
    game: StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "space-between",
            position: "relative",
            paddingTop: 8,
            // borderWidth: 1,
            // borderColor: "blue",
        },
        top: {
            position: "relative",
            height: 130,
            paddingHorizontal: 24,
            // borderWidth: 1,
            // borderColor: "green",
        },
        backLink: {
            position: "absolute",
            zIndex: 20,
            // top: -118,
            // left: 0,
            // borderWidth: 1,
            // borderColor: "red",
        },
        attemptedNotes: {
            position: "relative",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: 36,
            // borderWidth: 2,
            // borderColor: "red",
        },
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
            top: 24,
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
        },
        btnContainer: {
            position: "absolute",
            width: "100%",
            bottom: 50,
            // borderWidth: 2,
            // borderColor: "red",
        },
        btn: { width: "100%", height: 48 },
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

export const testBorder = (borderColor = "red"): ViewStyle => ({
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor,
});
