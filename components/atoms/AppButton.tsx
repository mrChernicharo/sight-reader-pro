import React, { forwardRef, useMemo } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native-gesture-handler";
import { AppText } from "./AppText";

interface AppButtonProps extends TouchableOpacityProps {
  text: string;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
}

const AppButton = forwardRef<TouchableOpacity, AppButtonProps>((props, ref) => {
  const { text, style, textStyle, disabled, ...otherProps } = props;
  const disabledStyles = { backgroundColor: disabled ? "gray" : "blue", opacity: disabled ? 0.5 : 1 };
  const buttonStyle = [defaultStyles, disabledStyles, style];

  return (
    <TouchableOpacity activeOpacity={0.7} {...otherProps} ref={ref} style={buttonStyle} disabled={disabled}>
      <AppText style={[{ color: "white" }, textStyle]}>{text}</AppText>
    </TouchableOpacity>
  );
});

const defaultStyles = {
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 5,
  paddingHorizontal: 16,
  paddingVertical: 8,
};

export default AppButton;
