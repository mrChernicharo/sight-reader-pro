import { AppText } from "@/components/atoms/AppText";
import { GameComponent } from "@/components/molecules/Game";
import { GameType } from "@/constants/enums";
import { getLevel } from "@/constants/levels";
import { useLocalSearchParams } from "expo-router";

export default function GameLevel() {
  const { id } = useLocalSearchParams() as { id: string };

  const level = getLevel(id);
  // console.log("gameLevel ::: ", { level });

  if (!level)
    return (
      <>
        <AppText>Loading...</AppText>
      </>
    );

  return (
    <>
      {
        {
          [GameType.Single]: <GameComponent.SingleNote />,
          [GameType.Melody]: <GameComponent.Melody />,
          [GameType.Chord]: <GameComponent.Chord />,
          [GameType.Rhythm]: <GameComponent.Rhythm />,
        }[level.gameType]
      }
    </>
  );
}
