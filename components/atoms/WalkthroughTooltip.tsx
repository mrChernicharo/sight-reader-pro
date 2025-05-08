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
}

export function WalkthroughTooltip({
    isVisible,
    content,
    children,
    arrowStyle,
    contentStyle,
    placement,
    onClose,
}: WalkThroughTooltipProps) {
    const tooltipProps = {
        isVisible: isVisible,
        placement: placement,
        contentStyle: contentStyle,
        // @ts-ignore
        arrowStyle: arrowStyle,
        topAdjustment: WALKTHROUGH_TOP_ADJUSTMENT,
        allowChildInteraction: false,
        closeOnChildInteraction: false,
        closeOnBackgroundInteraction: false,
        closeOnContentInteraction: true,
        onClose,
        content: content,
    };

    if (children) return <Tooltip {...tooltipProps}>{children}</Tooltip>;
    else return <Tooltip {...tooltipProps} />;
}
