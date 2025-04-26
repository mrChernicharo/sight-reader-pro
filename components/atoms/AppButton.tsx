import React, { forwardRef, ReactNode } from "react";
import { TextStyle, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from "react-native";
import { AppText } from "./AppText";

interface AppButtonProps extends TouchableOpacityProps {
    text: string;
    icon?: ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

const AppButton = forwardRef<View, AppButtonProps>((props, ref) => {
    const { text, icon, style, textStyle, disabled, ...otherProps } = props;

    const disabledStyles = { backgroundColor: disabled ? "gray" : "blue", opacity: disabled ? 0.5 : 1 };
    const buttonStyle = [defaultStyles, disabledStyles, style] as ViewStyle[];

    const Icon = () => (icon ? icon : null);

    return (
        <TouchableOpacity ref={ref} style={buttonStyle} disabled={disabled} {...otherProps}>
            <Icon />
            <AppText style={{ color: "white", ...textStyle }}>{text}</AppText>
        </TouchableOpacity>
    );
});

const defaultStyles = {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
};

export default AppButton;
