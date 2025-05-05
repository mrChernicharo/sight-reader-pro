import { WALKTHROUGH_TOP_ADJUSTMENT } from "@/utils/constants";
import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Tooltip, { Placement } from "react-native-tooltip-2";

interface WalkThroughTooltipProps {
    isVisible: boolean;
    placement: Placement;
    content: ReactNode;
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
}: WalkThroughTooltipProps) {
    if (children)
        return (
            <Tooltip
                isVisible={isVisible}
                placement={placement}
                contentStyle={contentStyle}
                // @ts-ignore
                arrowStyle={arrowStyle}
                topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                allowChildInteraction={false}
                closeOnChildInteraction={false}
                closeOnBackgroundInteraction={false}
                closeOnContentInteraction={false}
                content={content}
            >
                {children}
            </Tooltip>
        );
    else
        return (
            <Tooltip
                isVisible={isVisible}
                placement={placement}
                contentStyle={contentStyle}
                // @ts-ignore
                arrowStyle={arrowStyle}
                topAdjustment={WALKTHROUGH_TOP_ADJUSTMENT}
                allowChildInteraction={false}
                closeOnChildInteraction={false}
                closeOnBackgroundInteraction={false}
                closeOnContentInteraction={false}
                content={content}
            />
        );
}
