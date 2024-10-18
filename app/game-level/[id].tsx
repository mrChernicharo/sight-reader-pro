import { AppText } from "@/components/atoms/AppText";
import { Game } from "@/components/molecules/Game";
import { Clef, GameType } from "@/constants/enums";
import { getLevel } from "@/constants/levels";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

export default function GameLevel() {
  const { id } = useLocalSearchParams() as { id: string; clef: Clef };

  const level = getLevel(id);

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
          [GameType.Single]: <Game.SingleNote />,
          [GameType.Melody]: <Game.Melody />,
          [GameType.Chord]: <Game.Chord />,
          [GameType.Rhythm]: <Game.Rhythm />,
        }[level.gameType]
      }
    </>
  );
}
