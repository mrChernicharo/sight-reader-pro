import { AppText } from "@/components/atoms/AppText";
import { AppView } from "@/components/atoms/AppView";
import { BackLink } from "@/components/atoms/BackLink";
import { useAppStore } from "@/hooks/useAppStore";
import { useIntl } from "@/hooks/useIntl";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/utils/Colors";
import { glyphs } from "@/utils/constants";
import { GameType } from "@/utils/enums";
import { getUnlockedLevels, SECTIONED_LEVELS } from "@/utils/levels";
import { Level } from "@/utils/types";
import { router } from "expo-router";
import { Dimensions, Pressable, SafeAreaView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export function getLevelName(item: Level<GameType>) {
  const splitLevelName = item.name.split(" ");
  const levelIdx = splitLevelName.pop();
  const levelName = splitLevelName.join(" ");
  return { levelIdx, levelName };
}

export default function LevelSelectionScreen() {
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, "background");
  const itemBGColor = useThemeColor({ light: Colors.light.accent, dark: Colors.dark.accent }, "background");
  const { games } = useAppStore();
  const { intl } = useIntl();
  const { t } = useTranslation();

  const unlockedLevels = getUnlockedLevels(games, intl);
  const cols = 3;
  // console.log("LevelSelectionScreen :::: games", JSON.stringify(games, null, 2));
  // console.log("LevelSelectionScreen :::: unlockedLevels", JSON.stringify(unlockedLevels, null, 2));

  return (
    <SafeAreaView style={{ minHeight: "100%" }}>
      <ScrollView contentContainerStyle={{ backgroundColor }}>
        <AppView style={styles.container}>
          <BackLink style={styles.backArrow} />

          {SECTIONED_LEVELS.map((clefLevels) => {
            // console.log(JSON.stringify({ clefLevels }, null, 2));
            const grid = makeGrid(clefLevels.data, cols);
            const clef = clefLevels.data[0].clef;
            const clefInfo = { name: clef, glyph: glyphs[`${clef}Clef`] };

            return (
              <AppView key={clefLevels.title}>
                <AppView style={{ flexDirection: "row", gap: 6 }}>
                  <AppText
                    type="title"
                    style={[styles.sectionTitle, clef == "bass" && { transform: [{ translateY: 5 }] }]}
                  >
                    {clefInfo.glyph}
                  </AppText>
                  <AppText type="title" style={styles.sectionTitle}>
                    {t(`music.clefs.${clefInfo.name}`)}
                  </AppText>
                </AppView>

                <AppView style={styles.gridSection}>
                  {grid.map((row, rowIdx) => (
                    <AppView key={`row-${rowIdx}`} style={styles.gridRow}>
                      {row.map((level) => {
                        const { levelName, levelIdx } = getLevelName(level);
                        const disabled = level.index > unlockedLevels[level.clef] + 1;
                        return (
                          <Pressable
                            key={level.id}
                            disabled={disabled}
                            onPress={() => {
                              router.push({
                                pathname: "/level-details/[id]",
                                params: { id: level.id },
                              });
                            }}
                          >
                            <AppView
                              style={[
                                styles.item,
                                {
                                  backgroundColor: disabled ? "gray" : itemBGColor,
                                },
                              ]}
                            >
                              <AppText>{levelName}</AppText>
                              <AppText>{levelIdx}</AppText>
                            </AppView>
                          </Pressable>
                        );
                      })}
                    </AppView>
                  ))}
                </AppView>
              </AppView>
            );
          })}
        </AppView>
        {/* <AppView style={styles.footerFiller}></AppView> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    // paddingTop: StatusBar.currentHeight,
    minHeight: Dimensions.get("window").height,
  },
  backArrow: {
    // borderWidth: 1,
    // borderColor: '#FFF',
    height: 42,
    transform: [{ translateX: 0 }, { translateY: 8 }],
  },
  sectionTitle: {
    paddingVertical: 16,
  },
  gridSection: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 16,
  },
  gridRow: {
    flexDirection: "row",
    gap: 16,
  },
  item: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  footerFiller: {
    height: 100,
  },
});

function makeGrid<T>(nums: T[], cols = 2) {
  const grid: T[][] = [];
  nums.forEach((n, i) => {
    if (i % cols == 0) {
      grid.push([n]);
    } else {
      grid?.at(-1)?.push(n);
    }
  });

  return grid;
}
