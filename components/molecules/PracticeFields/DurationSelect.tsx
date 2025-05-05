import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { GameType } from "@/utils/enums";
import { STYLES } from "@/utils/styles";
import Ionicons from "@expo/vector-icons/build/Ionicons";

import { useCallback } from "react";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

const s = STYLES.practice;

const DURATIONS = [
    { key: "15", value: 15 },
    { key: "30", value: 30 },
    { key: "45", value: 45 },
    { key: "60", value: 60 },
    { key: "90", value: 90 },
    { key: "120", value: 120 },
];
// const TYPES = Object.values(GameType).map((gt) => ({ key: gt, value: gt }));

export function DurationSelect() {
    const theme = useTheme();
    const { t } = useTranslation();
    const updatePracticeSettings = useAppStore((state) => state.updatePracticeSettings);

    const practiceSettings = useAppStore((state) => state.practiceSettings);
    const { duration } = practiceSettings;

    const setGameDuration = useCallback(
        (dur: number) => {
            updatePracticeSettings("duration", dur);
        },
        [updatePracticeSettings]
    );

    return (
        <AppView style={s.menuItem}>
            <AppText>{t("levelDetails.duration")}</AppText>

            <Menu>
                <MenuTrigger style={s.menuTrigger}>
                    <AppText style={{ color: Colors[theme].textMute }}>{duration + " " + t("time.seconds")}</AppText>

                    <Ionicons name="chevron-forward" size={20} color={Colors[theme].textMute} style={s.icon} />
                </MenuTrigger>

                <MenuOptions>
                    {DURATIONS.map((sc) => (
                        <MenuOption
                            key={sc.key}
                            onSelect={() => setGameDuration(sc.value)}
                            style={[s.menuOption, { backgroundColor: Colors[theme].bgSelected }]}
                            customStyles={{ optionText: { color: Colors[theme].text } }}
                            text={t(sc.key) + " " + t("time.seconds")}
                        />
                    ))}
                </MenuOptions>
            </Menu>
        </AppView>
    );
}
