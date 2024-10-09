import { AppView } from "@/components/atoms/AppView";
import { GameState } from "../game-level/[id]";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/components/atoms/AppText";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Clef } from "@/constants/types";
import { useAppStore } from "@/hooks/useStore";
import AppButton from "@/components/atoms/AppButton";
import { isNoteMatch } from "@/constants/helperFns";

export default function GameOverScreen() {
  const games = useAppStore((state) => state.games);
  const { gameState, levelId, clef } = useLocalSearchParams() as {
    gameState: "win" | "lose";
    levelId: string;
    clef: Clef;
  };

  const message = gameState === "win" ? "Congratulations!" : "You Lose";
  const emoji = gameState === "win" ? " 🎉 " : " 😩 ";

  const lastGame = games.at(-1);
  const playerMoves = lastGame?.notes.map((gameNote) => ({
    ...gameNote,
    success: isNoteMatch(gameNote.attempt, gameNote.note),
  }));

  console.log({ lastGame }, JSON.stringify({ playerMoves }, null, 2));

  return (
    <SafeAreaView style={s.container}>
      <AppView style={s.messageContainer}>
        <AppText type="title">{message}</AppText>
        <AppView>
          <AppText
            type="title"
            style={{
              fontSize: 64,
              // borderWidth: 2,
              flexDirection: "column",
              // height: 90,
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              lineHeight: 90,
            }}
          >
            {emoji}
          </AppText>
        </AppView>
      </AppView>

      <AppView style={s.btnsContainer}>
        <AppButton
          text="Play again"
          onPress={() => {
            router.push({
              pathname: "/game-level/[id]",
              params: { id: levelId, clef },
            });
          }}
        />
        <AppButton
          text="Level selection"
          style={{ backgroundColor: "transparent" }}
          textStyle={{ color: "gray" }}
          onPress={() => {
            router.navigate({
              pathname: "/level-selection",
            });
          }}
        />
      </AppView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  messageContainer: {
    paddingVertical: 64,
    gap: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnsContainer: {
    // flexDirection: "row",
    gap: 12,
  },
});
