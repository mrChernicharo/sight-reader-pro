import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";

import { STYLES } from "@/utils/styles";
import { Scale } from "@/utils/types";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useEffect, useMemo, useState } from "react";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

const s = STYLES.practice;

export function ScaleSelect() {
    const { t } = useTranslation();
    const theme = useTheme();
    const { practiceSettings, updatePracticeSettings } = useAppStore();
    const { scale } = practiceSettings;

    const SCALES = useMemo(() => Object.values(Scale).map((v) => ({ key: v, value: t(`music.scaleType.${v}`) })), [t]);
    const DEFAULT_SCALE = useMemo(() => SCALES.find((acc) => acc.key === scale), [scale]);

    const [selectedScale, setScale] = useState(scale);

    useEffect(() => {
        updatePracticeSettings("scale", selectedScale);
    }, [updatePracticeSettings, selectedScale]);

    return (
        <AppView style={s.menuItem}>
            <AppText>{t("music.scale")}</AppText>

            <Menu>
                <MenuTrigger style={{ ...s.menuTrigger, marginRight: -14 }}>
                    <AppText style={{ color: Colors[theme].textMute }}>{DEFAULT_SCALE?.value}</AppText>

                    <Ionicons name="chevron-forward" size={20} color={Colors[theme].textMute} style={s.icon} />
                </MenuTrigger>

                <MenuOptions>
                    {SCALES.map((sc) => (
                        <MenuOption
                            key={sc.key}
                            text={sc.value}
                            style={[s.menuOption, { backgroundColor: Colors[theme].bgSelected }]}
                            customStyles={{ optionText: { color: Colors[theme].text } }}
                            onSelect={() => setScale(sc.key)}
                        />
                    ))}
                </MenuOptions>
            </Menu>
        </AppView>
    );
}
