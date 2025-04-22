import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { GameComponent } from "@/components/molecules/Game";
import { useAllLevels } from "@/hooks/useAllLevels";
import { GameType } from "@/utils/enums";
import { useLocalSearchParams } from "expo-router";

const GameComponents = {
    [GameType.Single]: <GameComponent.SingleNote />,
    [GameType.Melody]: <GameComponent.Melody />,
    [GameType.Chord]: <GameComponent.Chord />,
    [GameType.Rhythm]: <GameComponent.Rhythm />,
};

export default function GameLevel() {
    const { id } = useLocalSearchParams() as { id: string };
    const { getLevel } = useAllLevels();

    const level = getLevel(id);
    // console.log("gameLevel ::: ", { id, levelId: level?.id, levelIdx: level?.index });

    if (!level || !id)
        return (
            <AppView style={{ flex: 1 }}>
                <AppText>Loading...</AppText>
            </AppView>
        );

    return <>{GameComponents[level.type]}</>;
}
