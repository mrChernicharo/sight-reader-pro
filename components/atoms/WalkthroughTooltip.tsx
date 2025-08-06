import { WALKTHROUGH_TOP_ADJUSTMENT } from "@/utils/constants";
import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Tooltip, { Placement } from "react-native-tooltip-2";

interface WalkThroughTooltipProps {
    isVisible: boolean;
    placement: Placement;
    content: ReactNode;
    onClose: () => void;
    children?: ReactNode;
    contentStyle?: StyleProp<ViewStyle>;
    arrowStyle?: StyleProp<ViewStyle>;
    useReactNativeModal?: boolean;
}

export function WalkthroughTooltip({
    isVisible,
    content,
    children,
    arrowStyle,
    contentStyle,
    placement,
    useReactNativeModal = true,
    onClose,
}: WalkThroughTooltipProps) {
    const tooltipProps = {
        isVisible,
        placement,
        contentStyle,
        arrowStyle,
        topAdjustment: WALKTHROUGH_TOP_ADJUSTMENT,
        allowChildInteraction: false,
        closeOnChildInteraction: false,
        closeOnBackgroundInteraction: true,
        closeOnContentInteraction: true,
        content,
        useReactNativeModal,
        onClose,
    };

    if (children) return <Tooltip {...tooltipProps}>{children}</Tooltip>;
    else return <Tooltip {...tooltipProps} />;
}
