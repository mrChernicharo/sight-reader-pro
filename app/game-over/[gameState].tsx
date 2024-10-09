import { AppView } from "@/components/atoms/AppView";
import { GameState } from "../game-level/[id]";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/components/atoms/AppText";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import { Clef } from "@/constants/types";
import { useAppStore } from "@/hooks/useStore";

export default function GameOverScreen() {
  const { gameState, levelId, clef } = useLocalSearchParams() as {
    gameState: "win" | "lose";
    levelId: string;
    clef: Clef;
  };
  const games = useAppStore((state) => state.games);

  console.log(JSON.stringify({ games }, null, 2));

  return (
    <ScrollView>
      <AppView>
        {gameState === "win" ? (
          <AppView>
            <AppText>Congratulations!</AppText>
            <AppText>🎉</AppText>
          </AppView>
        ) : null}

        {gameState === "lose" ? (
          <AppView>
            <AppText>You Lose</AppText>
            <AppText>😩</AppText>
          </AppView>
        ) : null}

        <TouchableOpacity>
          <AppText
            onPress={() => {
              router.push({
                pathname: "/game-level/[id]",
                params: {
                  id: levelId,
                  clef,
                },
              });
            }}
          >
            Play again
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.navigate({
              pathname: "/level-selection",
            });
          }}
        >
          <AppText>Level selection</AppText>
        </TouchableOpacity>
      </AppView>
    </ScrollView>
  );
}
