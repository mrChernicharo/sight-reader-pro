import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

const THUMB_RADIUS = 10;

const Thumb = () => <View style={styles.root} />;

const styles = StyleSheet.create({
    root: {
        width: THUMB_RADIUS * 2,
        height: THUMB_RADIUS * 2,
        borderRadius: THUMB_RADIUS,
        backgroundColor: "#5b99d4",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.16,
        shadowRadius: 6,
    },
});

export default memo(Thumb);
