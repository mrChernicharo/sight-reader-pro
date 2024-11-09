import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { AppView } from "../AppView";
import { Colors } from "@/utils/Colors";

const RailSelected = () => <AppView style={[styles.root, { backgroundColor: Colors.light.primary }]} />;

export default memo(RailSelected);

const styles = StyleSheet.create({
  root: {
    height: 5,
    borderRadius: 2,
  },
});
