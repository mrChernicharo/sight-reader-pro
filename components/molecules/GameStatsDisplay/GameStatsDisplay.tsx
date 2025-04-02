import { Colors } from "@/utils/Colors";
import { getGameStats } from "@/utils/helperFns";
import { GameScore, GameStatsDisplayProps, Level, LevelScore } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { AppText } from "../../atoms/AppText";
import { AppView } from "../../atoms/AppView";
import { GameType } from "@/utils/enums";
import { useAppStore } from "@/hooks/useAppStore";
import { useIntl } from "@/hooks/useIntl";
import { FadeIn } from "@/components/atoms/FadeIn";
import { useTranslation } from "@/hooks/useTranslation";

export function GameStatsDisplay({ level, hitsPerMinute }: GameStatsDisplayProps) {
  const theme = useColorScheme() ?? "light";
  const { intl } = useIntl();
  const { t } = useTranslation();

  const { currentGame } = useAppStore();

  if (!currentGame?.rounds || currentGame.rounds.length === 0) return <></>;

  const {
    accuracy = 1,
    attempts = 0,
    successes = 0,
    mistakes = 0,
    score: gs = { value: 0 },
  } = getGameStats(level, currentGame?.rounds, intl);
  const score = gs as LevelScore;
  const notesPerMinute = !hitsPerMinute ? "--" : intl.format(hitsPerMinute ?? 0);
  // useEffect(() => {
  //   console.log({ attempts, hitsPerMinute, elapsed, theme });
  // }, [attempts, hitsPerMinute, elapsed, theme]);

  return (
    <AppView transparentBG style={[s.container]}>
      <AppView transparentBG style={[s.separator]} />

      <AppView transparentBG style={[s.row]}>
        <FadeIn y={50} x={0}>
          <AppView transparentBG style={s.rowItem}>
            <AppText>
              <Ionicons name="time-outline" />
              &nbsp;{t("game.NotesPerMin")}
            </AppText>
            <AppView>
              <AppText>{notesPerMinute}</AppText>
            </AppView>
          </AppView>
        </FadeIn>

        <FadeIn y={50} x={0}>
          <AppView transparentBG style={s.rowItem}>
            <AppText>
              <Ionicons name="eye-outline" />
              &nbsp;{t("game.accuracy")}
            </AppText>
            <AppView>
              <AppText>{accuracy}</AppText>
            </AppView>
          </AppView>
        </FadeIn>
      </AppView>

      <AppView transparentBG style={[s.row]}>
        <FadeIn y={50} x={0}>
          <AppView transparentBG style={[s.rowItem]}>
            <AppText>
              <Ionicons name="musical-notes-outline" />
              &nbsp;{t("game.attempts")}
            </AppText>
            <AppView>
              <AppText>{attempts}</AppText>
            </AppView>
          </AppView>
        </FadeIn>

        <FadeIn y={50} x={0}>
          <AppView transparentBG style={s.rowItem}>
            <AppText>
              <Ionicons name="checkmark" color={Colors[theme].green} />
              &nbsp;{t("game.successes")}
            </AppText>

            <AppView>
              <AppText>{successes}</AppText>
            </AppView>
          </AppView>
        </FadeIn>

        <FadeIn y={50} x={0}>
          <AppView transparentBG style={s.rowItem}>
            <AppText>
              <Ionicons name="close-outline" color={Colors[theme].red} />
              &nbsp;{t("game.mistakes")}
            </AppText>

            <AppView>
              <AppText>{mistakes}</AppText>
            </AppView>
          </AppView>
        </FadeIn>
      </AppView>

      <AppView transparentBG style={[s.score]}>
        <AppView transparentBG style={{ alignItems: "flex-end", width: 120 }}>
          <FadeIn delay={0} x={50} duration={250} y={0}>
            <AppText style={{ color: Colors[theme].textMute }}>
              {score.hits} {t(score.hits == 1 ? "game.hit" : "game.hits")}
            </AppText>
          </FadeIn>
          <FadeIn delay={300} x={50} duration={250} y={0}>
            <AppText style={{ color: Colors[theme].textMute }}>{intl.format(score.hitScore)} pts</AppText>
            <AppText style={{ position: "absolute", left: -20, top: 0, color: Colors[theme].textMute }}>X</AppText>
          </FadeIn>
          <FadeIn delay={600} x={50} duration={250} y={0}>
            <AppText style={{ color: Colors[theme].textMute }}>{score.multiplier} mult</AppText>
            <AppText style={{ position: "absolute", left: -20, top: 0, color: Colors[theme].textMute }}>X</AppText>
          </FadeIn>
        </AppView>

        <FadeIn delay={1000} x={50} duration={250} y={0}>
          <AppView transparentBG style={[s.line, { backgroundColor: Colors[theme].text }]} />
        </FadeIn>

        <AppView transparentBG style={{ alignItems: "center" }}>
          <FadeIn delay={1500} x={-50} y={0}>
            <AppText type="subtitle">{t("game.TOTAL_SCORE")}</AppText>
          </FadeIn>
          <FadeIn delay={1600} x={-50} y={0}>
            <AppText type="title">{intl.format(score.value)}</AppText>
          </FadeIn>
        </AppView>
      </AppView>
    </AppView>
  );
}

const s = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderColor: "#cacacaca",
  },
  row: {
    flexDirection: "row",
    // justifyContent: "space-between",
    justifyContent: "center",
  },
  rowItem: {
    alignItems: "center",
    padding: 8,
    minWidth: 80,
    // borderWidth: 1,
    // borderColor: "#444",
  },
  separator: {
    height: 12,
  },
  line: { height: 1, width: 160, marginVertical: 12 },
  score: {
    paddingTop: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
