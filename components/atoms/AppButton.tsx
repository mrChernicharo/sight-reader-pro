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

  const buttonStyle = useMemo(() => {
    return [
      style,
      {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: disabled ? "gray" : "blue",
        opacity: disabled ? 0.5 : 1,
      },
    ];
  }, [style, disabled]);

  return (
    <TouchableOpacity {...otherProps} ref={ref} style={buttonStyle} disabled={disabled}>
      <AppText style={textStyle}>{text}</AppText>
    </TouchableOpacity>
  );
});

export default AppButton;
