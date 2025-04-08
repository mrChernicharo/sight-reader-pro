import { useTranslation } from "@/hooks/useTranslation";
import { StyleProp, TextStyle } from "react-native";
import { AppText } from "./AppText";

export function TooltipTextLines({ keypath }: { keypath: string }) {
    const tourTextProps = { forceBlackText: true, style: { textAlign: "center" } as StyleProp<TextStyle> };
    const { t } = useTranslation();

    return (
        <>
            {t(keypath)
                .split(":::")
                .map((txtLine, i) => (
                    <AppText key={i} {...tourTextProps}>
                        {txtLine}
                    </AppText>
                ))}
        </>
    );
}
