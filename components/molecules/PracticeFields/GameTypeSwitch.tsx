import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { GameType } from "@/utils/enums";
import { STYLES } from "@/utils/styles";
import { Ionicons } from "@expo/vector-icons";

import { useCallback } from "react";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

const s = STYLES.practice;

const TYPES = [
    { key: GameType.Single, value: `game.type.single` },
    { key: GameType.Melody, value: `game.type.melody` },
];
// const TYPES = Object.values(GameType).map((gt) => ({ key: gt, value: gt }));

export function GameTypeSwitch() {
    const theme = useTheme();
    const { t } = useTranslation();
    const updatePracticeSettings = useAppStore((state) => state.updatePracticeSettings);

    const practiceSettings = useAppStore((state) => state.practiceSettings);
    const { gameType } = practiceSettings;

    const setGameType = useCallback(
        (type: GameType) => {
            updatePracticeSettings("gameType", type);
        },
        [updatePracticeSettings]
    );

    return (
        <AppView style={s.menuItem}>
            <AppText>{t("game.type.title")}</AppText>

            <Menu>
                <MenuTrigger style={s.menuTrigger}>
                    <AppText style={{ color: Colors[theme].textMute }}>{t(`game.type.${gameType}`)}</AppText>

                    <Ionicons name="chevron-forward" size={20} color={Colors[theme].textMute} style={s.icon} />
                </MenuTrigger>

                <MenuOptions>
                    {TYPES.map((sc) => (
                        <MenuOption
                            key={sc.key}
                            onSelect={() => setGameType(sc.key)}
                            style={[s.menuOption, { backgroundColor: Colors[theme].bgSelected }]}
                            customStyles={{ optionText: { color: Colors[theme].text } }}
                            text={t(sc.value)}
                        />
                    ))}
                </MenuOptions>
            </Menu>
        </AppView>
    );
}
