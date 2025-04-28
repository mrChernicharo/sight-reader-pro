import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { AppView } from "../AppView";
import { Colors } from "@/utils/Colors";

const RailSelected = () => {
    return <AppView style={{ ...styles.root, backgroundColor: "#5b99d4" }} />;
};

export default memo(RailSelected);

const styles = StyleSheet.create({
    root: {
        height: 5,
        borderRadius: 2,
    },
});
