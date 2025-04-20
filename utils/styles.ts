import { StyleSheet } from "react-native";

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
            top: -118,
            left: 0,
            zIndex: 20,
            // borderWidth: 1,
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
        btn: { width: "100%" },
    }),
};
