import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppText } from "../AppText";
import { AppView } from "../AppView";

const Label = ({ text, ...restProps }: any) => (
  <AppView style={styles.root} {...restProps}>
    <AppText style={styles.text}>{text}</AppText>
  </AppView>
);

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 8,
    // backgroundColor: "#FE6600",
    backgroundColor: "#4598ee",
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    // color: "#fff",
  },
});

export default memo(Label);
