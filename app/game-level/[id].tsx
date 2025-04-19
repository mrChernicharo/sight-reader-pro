import { AppText } from "@/components/atoms/AppText";
import { GameComponent } from "@/components/molecules/Game";
import { GameType } from "@/utils/enums";
import { getLevel } from "@/utils/levels";
import { useLocalSearchParams } from "expo-router";

const GameComponents = {
    [GameType.Single]: <GameComponent.SingleNote />,
    [GameType.Melody]: <GameComponent.Melody />,
    [GameType.Chord]: <GameComponent.Chord />,
    [GameType.Rhythm]: <GameComponent.Rhythm />,
};

export default function GameLevel() {
    const { id } = useLocalSearchParams() as { id: string };

    const level = getLevel(id);
    // console.log("gameLevel ::: ", { level });

    if (!level || !id)
        return (
            <>
                <AppText>Loading...</AppText>
            </>
        );

    return <>{GameComponents[level.type]}</>;
}
